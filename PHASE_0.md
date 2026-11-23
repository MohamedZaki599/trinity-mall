# تقرير Phase 0 — تجهيز MVP للإطلاق

**التاريخ:** 2026-11-24
**الفرع:** `production-hardening`
**الكوميتات:** `a6e920d` (خط الأساس) ثم `d06b4d8` (تنفيذ Phase 0)

---

## 1. الملخص التنفيذي

كان المشروع عرضًا تقديميًا ناجحًا بصريًا لكنه غير قادر على استقبال عميل واحد: الاستفسارات تُحفظ في `localStorage` ولا تصل لأحد، ولوحة العملاء مفتوحة، وبعض حقول الفورم تُجمع ثم تُفقد.

الآن أصبح المشروع يملك المسار الكامل: **زائر → تحقق سيرفري → قاعدة بيانات → إشعار بريدي → لوحة محمية → متابعة وتصدير**، مع صفحات قانونية، تنقل موبايل، حالات 404/خطأ حقيقية، وSEO وأمان أساسيين.

**لم يُختبر بعد:** الحفظ الفعلي في قاعدة البيانات، وصول الإيميل، وتسجيل دخول ناجح — لأن ذلك يتطلب مفاتيح Neon وResend حقيقية.

---

## 2. ما تم تنفيذه

### 2.1 استقبال الاستفسارات
- **Server Action** في `src/app/actions/enquiry.ts` بدل الحفظ المحلي.
- تحقق سيرفري كامل في `src/lib/validation/enquiry.ts`: الاسم، تطبيع الهاتف المصري (010/011/012/015 → `+20…`)، إيميل اختياري، المساحة، الرسالة، والموافقة.
- حماية سبام: حقل honeypot مخفي + فحص زمني (`rendered_at`) + حدود معدل في Postgres.
- **حدود المعدل:** 5/10 دقائق و30/يوم لكل IP، و3/ساعة لكل رقم هاتف.
- حفظ `email` و`message` (كانا يُفقدان)، وتسجيل `consent_at` + نسخة السياسة.
- IP يُخزَّن كـ HMAC-SHA256 فقط، ولا يُحفظ خامًا.
- إشعار Resend بعد الرد عبر `after()`، وفشل الإيميل يُسجَّل في `email_error` دون فقدان الـ lead.

### 2.2 قاعدة البيانات
- Neon Postgres + Drizzle ORM.
- جداول: `enquiries`, `audit_events`, `rate_limit_buckets` في `src/db/schema.ts`.
- قيود CHECK للحالة والتصنيف واللغة وصيغة الهاتف والمساحة، وفهارس للتاريخ والحالة والهاتف وIP.
- ترحيل جاهز للمراجعة: `drizzle/0000_last_goblin_queen.sql`.
- الاتصال lazy (`getDb()`) حتى يعمل `next build` دون أسرار.
- سياسة احتفاظ 24 شهرًا + تنظيف عدّادات المعدل عبر `/api/cron/retention`.

### 2.3 المصادقة ولوحة العملاء
- حذف `middleware.ts` (Basic Auth للموقع كله) واستبداله بـ `src/proxy.ts`:
  - matcher ثابت `/admin/:path*` و`/units/:slug`.
  - تحقق متفائل من الجلسة + إرجاع 404 للسلَغ غير الموجودة.
- جلسة `iron-session` مشفّرة: HttpOnly، Secure في الإنتاج، SameSite=Lax، 8 ساعات.
- كلمة المرور argon2id، ويُخزَّن الـ hash فقط.
- `requireAdmin()` للصفحات و`assertAdmin()` لكل mutation — التحقق الحقيقي داخل كل مسار، وليس في proxy.
- تقييد الدخول 5 محاولات/15 دقيقة لكل IP ولكل بريد، برسالة موحّدة.
- لوحة جديدة server-rendered (`src/app/admin/leads/page.tsx`): بحث، فلترة بالحالة، ترقيم 25/صفحة، تغيير حالة مع audit trail، حذف ناعم، تصدير CSV محمي.
- CSV مؤمّن ضد حقن الصيغ (`= + - @`).
- بيانات الديمو أصبحت صفوف `is_demo` تُزرع فقط عند `SEED_DEMO_DATA=true`، مع شارة وزر إزالة.

### 2.4 الواجهة وإمكانية الوصول
- قائمة موبايل مكوّنة من زر disclosure (`aria-expanded`/`aria-controls`)، إغلاق بـ Esc وإرجاع التركيز، إغلاق بالضغط خارجها، وقفل تمرير الصفحة.
- Skip link في `body` و`id="main"` على كل الصفحات.
- `error.tsx` (يستخدم `retry`) و`not-found.tsx`.
- تحويل صفحة الوحدة إلى Server Component مع `notFound()` حقيقي.
- إزالة روابط الـ demo من الهيدر والفوتر ومن الصفحة الرئيسية، وتحديث النصوص التي كانت تقول "محلي فقط".
- صفحتان قانونيتان `/privacy` و`/terms` بالعربية والإنجليزية، ونص موافقة مرتبط بالسياسة (v1.0).

### 2.5 SEO والأمان
- `metadataBase` وOpen Graph وTwitter وcanonical في `src/app/layout.tsx`.
- metadata لكل مسار عبر `layout.tsx` للأقسام (مع إبقاء الصفحات client كما هي).
- `sitemap.ts` و`robots.ts` (منع `/admin` و`/api`) و`opengraph-image.tsx` مولّدة 1200×630.
- رؤوس أمان في `next.config.ts`: HSTS، `X-Content-Type-Options`، `X-Frame-Options`، `Referrer-Policy`، `Permissions-Policy`، وCSP كـ **Report-Only** أولًا.
- `poweredByHeader: false`.

### 2.6 التشغيل والتوثيق
- `.env.example` بكل المتغيرات المطلوبة.
- سكربتات: `hash-password`, `seed:demo`, `db:generate`, `db:migrate`, `db:studio`, `typecheck`.
- `vercel.json` لجدولة retention اليومي.
- `README.md` محدّث ودليل نشر تفصيلي في `DEPLOYMENT.md`.

---

## 3. الملفات المضافة والمعدّلة والمحذوفة

### ملفات جديدة
| المسار | الغرض |
| --- | --- |
| `.env.example` | قائمة المتغيرات |
| `DEPLOYMENT.md` | دليل النشر خطوة بخطوة |
| `drizzle.config.ts`, `drizzle/*` | إعداد وملفات الترحيل |
| `scripts/hash-password.mjs`, `scripts/seed-demo.mjs` | أدوات تشغيل |
| `src/db/schema.ts`, `src/db/index.ts` | المخطط والاتصال |
| `src/lib/env.ts`, `ip.ts`, `rate-limit.ts`, `email.ts` | البنية التحتية للسيرفر |
| `src/lib/auth/{types,session,password}.ts` | الجلسة وكلمة المرور |
| `src/lib/validation/enquiry.ts`, `src/lib/leads/state.ts` | التحقق وحالة الفورم |
| `src/app/actions/{enquiry,admin}.ts` | Server Actions |
| `src/app/admin/layout.tsx`, `login/*` | حماية الإدارة والدخول |
| `src/app/api/admin/export/route.ts`, `api/cron/retention/route.ts` | التصدير والاحتفاظ |
| `src/app/{privacy,terms}/page.tsx`, `src/content/legal.ts` | السياسات |
| `src/app/{error,not-found}.tsx` | حالات الخطأ |
| `src/app/{sitemap,robots}.ts`, `opengraph-image.tsx` | SEO |
| `src/app/production.css` | أنماط الميزات الجديدة |
| `src/app/{units,contact,corporate-partners}/layout.tsx` | metadata لكل مسار |
| `src/components/{admin/login-form,admin/status-select,mobile-nav,legal-content}.tsx` | مكوّنات جديدة |
| `src/proxy.ts` | التحقق المبكر |
| `vercel.json` | cron |

### ملفات معدّلة جوهريًا
- `package.json` — اعتماديات وسكربتات.
- `next.config.ts` — رؤوس الأمان.
- `src/app/layout.tsx` — metadata، skip link، production.css.
- `src/components/enquiry-form.tsx` — إعادة كتابة بالكامل على `useActionState`.
- `src/components/lead-dashboard.tsx` — من localStorage إلى بيانات السيرفر.
- `src/app/admin/leads/page.tsx` — Server Component يقرأ من DB.
- `src/components/site-header.tsx`, `site-footer.tsx` — موبايل وروابط قانونية وإزالة demo.
- `src/components/unit-detail.tsx` + `src/app/units/[slug]/page.tsx` — lookup سيرفري و404.
- `src/app/page.tsx`, `contact/page.tsx`, `corporate-partners/page.tsx`, `units/page.tsx` — نصوص واقعية و`id="main"`.
- `README.md`, `.gitignore` (استثناء `.env.example`).

### محذوف
- `middleware.ts` — استُبدل بـ `src/proxy.ts`.

---

## 4. نتائج التحقق

| الفحص | النتيجة |
| --- | --- |
| `npx eslint .` | ✅ صفر أخطاء |
| `npx tsc --noEmit` | ✅ صفر أخطاء |
| `npx next build` | ✅ 17 صفحة/مسار |
| `/units/does-not-exist` | ✅ HTTP 404 + صفحة 404 |
| `/admin/leads` بدون جلسة | ✅ 307 → `/admin/login?next=…` |
| `/api/admin/export` بدون جلسة | ✅ 401 |
| رؤوس HSTS/XCTO/CSP | ✅ موجودة |
| `npm audit --omit=dev` | ✅ 0 ثغرات |
| وجود عناصر الفورم والقائمة في HTML | ✅ honeypot، consent، mobile-menu، skip-link |

**لم يُتحقق منه:** إدخال صف فعلي في DB، وصول إيميل Resend، تسجيل دخول ناجح، سلوك القائمة تفاعليًا في متصفح حقيقي (المتصفح المدمج غير مفعّل على هذا التنصيب).

---

## 5. قرارات تقنية اتُخذت

1. **Server Actions بدل Route Handler للفورم** — CSRF مدمج، progressive enhancement، ولا سطح API عام يحتاج تحصينًا.
2. **Drizzle + neon-http** — أخف من Prisma على cold starts، وSQL الترحيل قابل للمراجعة.
3. **iron-session + argon2 لحساب واحد** — أبسط وأقل سطحًا من Auth.js، مع تحقق حقيقي في كل مسار لأن proxy ليس حد أمان.
4. **404 للسلَغ عبر `proxy.ts`** — مع `cacheComponents` يبدأ الـ shell بحالة 200 قبل أي فحص داخل الصفحة، وهذا هو الحل الرسمي في التوثيق.
5. **حذف `app/loading.tsx` الجذري** — كان يبدأ البث بـ200 لكل المسارات ويمنع 404 الحقيقي. الأولوية لصحة الحالة.
6. **CSP Report-Only** — فرض `script-src` بدون nonce يكسر سكربتات Next، وnonce يقتل الكاش مع Cache Components.
7. **صفحات القانون client + layout لـ metadata** — تفاديًا لإعادة بناء نظام اللغة في هذه المرحلة.

---

## 6. ما تم تأجيله (وأسبابه)

| البند | السبب |
| --- | --- |
| تحسين الأداء (صورة الهيرو 2.1MB، تحويل الصفحات لسيرفر) | خارج نطاق الحواجز؛ يحتاج قياس Lighthouse أولًا |
| i18n في الـ URL (`/ar`, `/en`) وhreflang | تغيير معماري واسع، وأفضل بعد استقرار المحتوى |
| اختبارات آلية (Vitest/Playwright) وCI | لم تدخل نطاق المرحلة؛ البديل الآن فحص يدوي موثّق |
| Analytics وSentry | يحتاج موافقة خصوصية وتحديث السياسة أولًا |
| JSON-LD | مُنع بسبب أداة حقن HTML المباشر في الطبقة الأمنية؛ يمكن إضافته لاحقًا عبر أداة مُتحقَّق منها |
| Loading UI | حُذف لأنه يفرض 200؛ يمكن إعادته لمسارات محددة لا تحتوي 404 |
| Cookie banner | لا تحليلات الآن؛ التخزين الوحيد تفضيل اللغة |
| إشعارات واتساب/تليجرام | قرار المستخدم كان Resend |
| أدوار متعددة للأدمن | القرار: حساب واحد |
| CRM وتوزيع الـ leads وSLA | تكامل خارجي يحتاج اعتمادًا منفصلًا |
| CMS وإدارة المخزون | خارج النطاق |
| اختبار المتصفح التفاعلي | المتصفح المدمج غير مفعّل على التنصيب |

---

## 7. ملاحظات وديون تقنية

- `NEXT_PUBLIC_SITE_URL` يُدمج **وقت البناء**، فأي تغيير يحتاج إعادة نشر.
- حتى توثيق دومين Resend، المرسل `onboarding@resend.dev` يوصل فقط لبريد صاحب الحساب.
- `seed:demo` يحتاج Node 22.9+ بسبب `--env-file-if-exists`.
- 11 ثغرة moderate في اعتماديات التطوير فقط (drizzle-kit/esbuild)، ولا تظهر في `--omit=dev`.
- بيانات الاعتماد غير موجودة، لذا مسار DB/email غير مُثبت عمليًا.
- لا يوجد remote للريبو؛ الفرع محلي فقط.
- سيرفر اختبار قد يبقى على المنفذ 3004 (PID 5000) بعد جلسة التحقق.
- ملفات `DEPLOYMENT.md` و`README.md` و`PHASE_0.md` غير مُcommitَين حتى الآن.

---

## 8. اقتراحات الخطوات القادمة

### المرحلة 0.5 — قبل الإطلاق (نصف يوم)
1. إنشاء Neon وتعبئة `.env.local`.
2. `npm run db:migrate` ثم اختبار محلي كامل حسب `DEPLOYMENT.md`.
3. توليد hash كلمة المرور وضبط `ADMIN_EMAIL`.
4. إعداد Resend وتوثيق الدومين.
5. commit للملفات الثلاثة الحالية + إنشاء remote ودفع الفرع.
6. نشر Preview على Vercel واختباره، ثم Production.

### المرحلة 1 — جودة الإطلاق (3–5 أيام)
1. **الأداء:** ضغط الهيرو إلى WebP/AVIF، تحويل الصفحات إلى Server Components مع جزر client صغيرة، وقياس LCP.
2. **i18n:** نقل اللغة إلى المسار (`/ar`, `/en`) مع hreflang وmetadata لكل لغة.
3. **الاختبارات:** Vitest للتحقق من الهاتف/الإيميل، وPlaywright لمسار الفورم + الدخول + تغيير الحالة، مع CI على GitHub Actions.
4. **المراقبة:** Sentry للأخطاء + Plausible/GA بعد تحديث سياسة الخصوصية وإضافة بانر.
5. **إمكانية الوصول:** تدقيق كامل (تباين، ترتيب تركيز، قارئ شاشة) واختبار 375/768/1440.
6. **JSON-LD:** إضافة `LocalBusiness` من الحقائق المعتمدة فقط.

### المرحلة 2 — التشغيل (بعد أول leads حقيقية)
1. CRM (HubSpot/Zoho) أو webhook، مع إبقاء DB مصدر الحقيقة.
2. توزيع leads على مندوبين وSLA للمتابعة.
3. CMS للمحتوى والمخزون بدل تعديل الكود.
4. قناة واتساب Business للتنبيه الفوري.
5. تدريب نسخ احتياطي واستعادة Neon (RPO/RTO).
6. تشديد CSP إلى Enforced بعد استراتيجية nonce/hash مناسبة.

---

## 9. حالة Git الحالية

```
d06b4d8  Make the MVP launch-ready: lead capture, auth, legal and SEO
a6e920d  Baseline the interview MVP before production hardening
ed86191  Initial commit from Create Next App
```

**غير مُcommit:** `DEPLOYMENT.md`, `PHASE_0.md`, وتعديل رابط الدليل في `README.md`.
