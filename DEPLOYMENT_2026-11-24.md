# سجل التهيئة والنشر — 2026-11-24

سجل كامل لما تم في جلسة تجهيز Neon وResend وGitHub وVercel، بما فيها المشاكل التي ظهرت وحلولها.

---

## 1. الملخص

انتقل المشروع من كود جاهز محليًا إلى **نشر إنتاجي عامل**:

- قاعدة بيانات Neon مربوطة ومُرحَّلة.
- استقبال استفسارات حقيقي يُحفظ في Postgres.
- إشعار بريدي عبر Resend يعمل ومُختبر.
- مستودع GitHub خاص مربوط بـ Vercel.
- نشر تلقائي عند أي push على `master`.
- لوحة عملاء محمية تعمل بعد إصلاح مشكلة الـ hash.

**روابط:**

| الخدمة | الرابط |
| --- | --- |
| الموقع | https://trinity-mall-mvp.vercel.app |
| لوحة العملاء | https://trinity-mall-mvp.vercel.app/admin/login |
| المستودع | https://github.com/MohamedZaki599/trinity-mall |
| Neon | لوحة المشروع في neon.tech |
| Resend | لوحة المشروع في resend.com |

---

## 2. ما تم تنفيذه

### 2.1 Neon (قاعدة البيانات)

- إنشاء مشروع Postgres.
- استخراج رابطين:
  - **Pooled** → `DATABASE_URL` (للتطبيق وقت التشغيل).
  - **Direct** → `DATABASE_URL_UNPOOLED` (للترحيل فقط).
- تطبيق الترحيل:

```powershell
npm run db:migrate
```

- النتيجة: الجداول `enquiries`, `audit_events`, `rate_limit_buckets` + 5 قيود CHECK + 5 فهارس.
- تم اختبار قيد الهاتف فعليًا: إدخال رقم غير صالح مرفوض.

### 2.2 Resend (الإشعارات)

- إنشاء API Key بصلاحية إرسال.
- قبل توثيق دومين، المرسل `onboarding@resend.dev` يوصل فقط لبريد صاحب الحساب.
- لذلك `LEAD_NOTIFICATION_TO` = بريد الحساب مؤقتًا.
- تم التحقق من وصول رسالتين تجريبيتين فعليًا.

### 2.3 متغيرات البيئة

أُنشئ `.env.local` بأسرار مولّدة عشوائيًا:

- `SESSION_SECRET` — 64 حرفًا.
- `IP_HASH_SECRET` — 64 حرفًا.
- `CRON_SECRET` — 32 حرفًا.

والقيم التي عبّأها المستخدم:

| المتغير | المصدر |
| --- | --- |
| `DATABASE_URL` | Neon pooled |
| `DATABASE_URL_UNPOOLED` | Neon direct |
| `ADMIN_EMAIL` | بريد الأدمن |
| `ADMIN_PASSWORD_HASH` | `npm run hash-password` |
| `RESEND_API_KEY` | Resend |
| `LEAD_NOTIFICATION_TO` | بريد استقبال الإشعارات |
| `LEAD_NOTIFICATION_FROM` | `Trinity Mall <onboarding@resend.dev>` |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` محليًا |

`.env.local` مستبعد من Git. `.env.example` فقط هو المُلتزم.

### 2.4 اختبار E2E محلي

تم إرسال استفسار حقيقي عبر Server Action (بنفس مسار progressive enhancement):

- النتيجة: صف محفوظ، الهاتف مطبّع إلى `+20…`، الإيميل والرسالة محفوظان، `consent_policy_version = 1.0`.
- `email_sent_at` مضبوط و`email_error = null`.
- صف `enquiry.created` في `audit_events`.
- حُذفت بيانات الاختبار والعدّادات بعد التحقق.

### 2.5 GitHub

- إنشاء ريبو خاص باسم `trinity-mall`.
- `master` كان عند خط الأساس، فتم دمج `production-hardening` بـ fast-forward.
- إضافة `origin` ودفع `master` (المتتبَّع الآن لـ `origin/master`).

### 2.6 Vercel

- تسجيل الدخول عبر `npx vercel login`.
- المشروع الحالي: `trinity-mall-mvp` (منظمة `mohamedzaki599s-projects`).
- حذف متغيرات Basic Auth القديمة: `SITE_AUTH_USER` و`SITE_AUTH_PASSWORD`.
- إضافة المتغيرات العشرة إلى **Production + Preview + Development**.
- `NEXT_PUBLIC_SITE_URL`:
  - Production/Preview: `https://trinity-mall-mvp.vercel.app`
  - Development: `http://localhost:3000`
- ربط المستودع:

```powershell
npx vercel git connect https://github.com/MohamedZaki599/trinity-mall.git
```

- أول نشر إنتاجي عبر:

```powershell
npx vercel --prod
```

### 2.7 اختبار الإنتاج

| الفحص | النتيجة |
| --- | --- |
| `/` | 200 |
| `/contact` | 200 |
| `/units` | 200 |
| `/admin/leads` بدون جلسة | 307 → login |
| `/admin/login` | 200 |
| `/units/does-not-exist` | 404 حقيقي |
| `/api/admin/export` بدون جلسة | 401 |
| رؤوس HSTS / XCTO / X-Frame / Referrer / Permissions / CSP | موجودة |
| `robots.txt` و`sitemap.xml` | يستخدمان دومين الإنتاج |

كما أُرسل استفسار حقيقي على الإنتاج وتأكد حفظه و`email_sent_at`، ثم حُذف.

### 2.8 المشكلة والحل: تسجيل الدخول

**العَرَض:** رفض كلمة المرور برسالة "بيانات الدخول غير صحيحة".

**التشخيص:**
- البريد صحيح.
- صيغة الـ hash صحيحة ظاهريًا لكن **طولها 76 بدل 97**.
- جزء الـ hash كان 22 حرفًا بدل 43 → القيمة مقتطعة عند النسخ.

**الحل:**
1. إعادة كتابة `scripts/hash-password.mjs`:
   - يسأل عن كلمة المرور مرتين (إدخال مخفي).
   - يتأكد من الـ hash بـ `verify` قبل الكتابة.
   - يكتب القيمة مباشرة في `.env.local` بدل الطباعة والنسخ.
2. إضافة تسجيل واضح عند فشل تحليل الـ hash في `src/lib/auth/password.ts` لتمييزه عن كلمة مرور خاطئة.
3. استبدال القيمة في Vercel للبيئات الثلاث وإعادة النشر.
4. التحقق: محاولة بكلمة مرور خاطئة رجعت `INVALID_CREDENTIALS` **بدون** خطأ argon2، أي أن الـ hash يُقرأ سليمًا.
5. تحديث `README.md` و`DEPLOYMENT.md` بمنهجية التوليد الجديدة.
6. التأكيد النهائي: الدخول نجح.

### 2.9 الكوميتات

```
41beeb2  Write the admin password hash directly and verify it
768e19f  Opt admin pages out of instant-navigation validation
fd29a89  Document the Phase 0 launch work and deployment runbook
d06b4d8  Make the MVP launch-ready: lead capture, auth, legal and SEO
a6e920d  Baseline the interview MVP before production hardening
```

بعد `41beeb2` أنشأ Vercel نشرًا تلقائيًا من الـ push وأصبح **Ready في 22 ثانية**.

---

## 3. حالة الأنظمة الحالية

| النظام | الحالة |
| --- | --- |
| Neon | متصل، 3 جداول، صفر استفسارات حقيقية (حُذفت بيانات الاختبار) |
| Resend | مفتاح يعمل، رسائل الاختبار وصلت |
| Vercel | 10 متغيرات × 3 بيئات، Git متصل، نشر تلقائي يعمل |
| GitHub | `master` نظيف ومتزامن |
| محليًا | `.env.local` مكتمل، الخادم يعمل على المنفذ 3000 |

---

## 4. أوامر مرجعية

```powershell
# تشغيل محلي
npm run dev

# إعادة توليد كلمة مرور الأدمن (يكتبها في .env.local)
npm run hash-password

# تطبيق ترحيل جديد
npm run db:migrate

# إنشاء ترحيل بعد تعديل المخطط
npm run db:generate

# بيانات تجريبية (محلي فقط)
$env:SEED_DEMO_DATA="true"; npm run seed:demo

# نشر إنتاجي يدوي
npx vercel --prod

# دفع تغيير (ينشر تلقائيًا)
git push origin master
```

---

## 5. المتبقي قبل الإطلاق العام (محتوى لا كود)

1. استبدال placeholders الكيان القانوني في `src/content/legal.ts`:
   - `[LEGAL ENTITY NAME]`
   - `[COMMERCIAL REGISTRATION NO.]`
   - `[REGISTERED ADDRESS]`
   - `[PRIVACY CONTACT EMAIL]`
2. اعتماد رقم التواصل الرسمي وإظهاره.
3. اعتماد المساحة والطوابق وحالة التسليم والإتاحة والشروط.
4. توثيق دومين Resend إن أردت إرسال الإشعارات لفريق كامل بدل بريد الحساب.
5. ربط دومين مخصص إن توفر، ثم تحديث `NEXT_PUBLIC_SITE_URL` وإعادة النشر.
6. إزالة أي صفوف `is_demo` من الإنتاج إن أُضيفت.

---

## 6. ملاحظات تشغيلية

- `NEXT_PUBLIC_SITE_URL` يُدمج **وقت البناء**؛ أي تغيير يحتاج إعادة نشر.
- أي push إلى `master` يُنشر تلقائيًا.
- لتغيير كلمة مرور الأدمن: `npm run hash-password` ثم تحديث `ADMIN_PASSWORD_HASH` في Vercel وإعادة النشر.
- الجلسات الحالية تُبطل عند تغيير `SESSION_SECRET`.
- cron اليومي على `/api/cron/retention` يحذف الاستفسارات الأقدم من 24 شهرًا ويُنظّف عدّادات المعدل.
- نسخ Neon الاحتياطية: يُفضّل تفعيل Point-in-Time Restore.
- لا تضع أي مفتاح في Git أو في محادثة.
