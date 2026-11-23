# دليل النشر — Trinity Mall

خطوات تشغيل النسخة الإنتاجية على Neon + Vercel + Resend. اتبعها بالترتيب؛ كل خطوة تنتهي بفحص واضح.

> لا تضع أي مفتاح في Git أو في محادثة. كل القيم تُكتب في `.env.local` محليًا وفي Vercel Environment Variables.

---

## 0. المتطلبات

- حساب [Neon](https://neon.tech) وحساب [Resend](https://resend.com).
- الوصول إلى مشروع Vercel `trinity-mall-mvp` (موجود في `.vercel/project.json`).
- Node.js 22.9+ (سكربت `seed:demo` يستخدم `--env-file-if-exists`)؛ المشروع مُختبر على 26.
- قرارات محتوى جاهزة: الاسم القانوني، رقم التواصل الرسمي، الحقائق المعتمدة.

---

## 1. إنشاء قاعدة البيانات على Neon

1. أنشئ مشروعًا جديدًا واختر أقرب منطقة لمصر (مثل `eu-central-1`).
2. من صفحة **Connection Details** انسخ الرابطين:
   - **Pooled connection** → `DATABASE_URL` (يحتوي `-pooler` في اسم المضيف).
   - **Direct connection** → `DATABASE_URL_UNPOOLED` (للترحيل فقط).
3. تأكد أن الرابطين ينتهيان بـ `?sslmode=require`.

---

## 2. إعداد البيئة محليًا

```powershell
Copy-Item .env.example .env.local
```

ولّد القيم السرية:

```powershell
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(48))
```

كرر الأمر ثلاث مرات لـ `SESSION_SECRET` و`IP_HASH_SECRET` و`CRON_SECRET` (الأخير يمكن أن يكون 24 حرفًا).

ولّد hash كلمة مرور الأدمن:

```powershell
npm run hash-password -- "كلمة-مرور-قوية-وطويلة"
```

املأ `.env.local`:

| المتغير | القيمة |
| --- | --- |
| `DATABASE_URL` | رابط Neon المجمّع |
| `DATABASE_URL_UNPOOLED` | رابط Neon المباشر |
| `ADMIN_EMAIL` | بريد الأدمن |
| `ADMIN_PASSWORD_HASH` | ناتج `hash-password` |
| `SESSION_SECRET` | 48 بايت عشوائية |
| `IP_HASH_SECRET` | 48 بايت عشوائية |
| `RESEND_API_KEY` | من لوحة Resend |
| `LEAD_NOTIFICATION_TO` | بريد الفريق الذي سيستقبل الإشعارات |
| `LEAD_NOTIFICATION_FROM` | مرسل موثّق (انظر الخطوة 5) |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` محليًا |
| `CRON_SECRET` | سر عشوائي |

---

## 3. تطبيق المخطط

```powershell
npm run db:migrate
```

افحص أن الجداول الثلاثة موجودة (`enquiries`, `audit_events`, `rate_limit_buckets`):

```powershell
npm run db:studio
```

(اختياري) بيانات تجريبية محلية فقط:

```powershell
$env:SEED_DEMO_DATA="true"; npm run seed:demo
```

---

## 4. اختبار محلي كامل قبل أي نشر

```powershell
npm run dev
```

افتح `http://localhost:3000` ونفّذ القائمة:

| الاختبار | النتيجة المتوقعة |
| --- | --- |
| إرسال فورم صحيح | صف جديد في DB + إيميل + ظهور فوري في `/admin/leads` |
| رقم هاتف غلط | خطأ inline، ولا صف في DB |
| إرسال 6 مرات متتالية | رسالة تقييد (rate limit) |
| بريد إلكتروني اختياري غلط | خطأ `INVALID_EMAIL` |
| كلمة مرور خاطئة 5 مرات | تقييد 15 دقيقة |
| تغيير حالة lead | الحالة تُحفظ + صف في `audit_events` |
| تصدير CSV | ملف ينزل ويحتوي كل الأعمدة |
| `/units/لا-يوجد` | صفحة 404 وحالة HTTP 404 |
| عرض 375px | زر القائمة يفتح ويغلق وكل الروابط تعمل |

تحقق يدوي من الإيميل: افتح لوحة Resend → **Emails** وتأكد أن الحالة `Delivered`.

---

## 5. إعداد Resend

1. أنشئ API Key بصلاحية الإرسال فقط.
2. **قبل توثيق الدومين:** المرسل `onboarding@resend.dev` يوصل **فقط** إلى بريد صاحب حساب Resend. اجعل `LEAD_NOTIFICATION_TO` هو نفس البريد مؤقتًا.
3. عند توفر الدومين: أضفه في Resend، ثم أضف سجلات DNS (SPF وDKIM وDMARC) عند مزوّد الدومين.
4. بعد التحقق، غيّر `LEAD_NOTIFICATION_FROM` إلى شيء مثل:
   `Trinity Mall <leads@yourdomain.com>`
   و`LEAD_NOTIFICATION_TO` إلى بريد فريق المبيعات.

---

## 6. إعداد Vercel

1. أضف كل متغيرات `.env.local` في **Project → Settings → Environment Variables** لكل البيئات: Production وPreview وDevelopment.
2. `NEXT_PUBLIC_SITE_URL` يُدمج وقت البناء:
   - Production: الدومين النهائي.
   - Preview: الدومين النهائي أو alias ثابت (لا تتركه `localhost`).
3. لا تضع `DATABASE_URL_UNPOOLED` في كود التطبيق — يُستخدم فقط للترحيل.
4. انشر Preview أولًا واختبره، ثم Production.

---

## 7. ترحيل قاعدة الإنتاج

نفّذه **قبل** أول نشر يكتب استفسارات:

```powershell
$env:DATABASE_URL_UNPOOLED="رابط-الإنتاج-المباشر"; npm run db:migrate
```

الترحيل الحالي إنشائي فقط (إنشاء جداول وفهارس) ولا يحذف بيانات.

---

## 8. المهام المجدولة

`vercel.json` يضم cron يوميًا على `/api/cron/retention` لحذف الاستفسارات الأقدم من 24 شهرًا وتنظيف عدّادات المعدل.

- عيّن `CRON_SECRET` في Vercel؛ سيرسلها Vercel تلقائيًا في `Authorization: Bearer`.
- بدون `CRON_SECRET` سيرد المسار بـ503.
- خطة Hobby تسمح بـ cron يومي فقط، وهو ما يكفينا.

---

## 9. فحص ما بعد النشر

| الفحص | الأمر / الطريقة |
| --- | --- |
| الصفحة الرئيسية و/vitals | افتح الرابط وتأكد من عدم وجود أخطاء console |
| حالة 404 | `curl -I https://<domain>/units/unknown` → `404` |
| حماية الإدارة | `curl -I https://<domain>/admin/leads` → `307` إلى login |
| تصدير محمي | `curl -I https://<domain>/api/admin/export` → `401` |
| الرؤوس الأمنية | `curl -I https://<domain>/` → HSTS وXCTO وCSP |
| sitemap/robots | افتح `/sitemap.xml` و`/robots.txt` وتأكد من الدومين الصحيح |
| إرسال lead حقيقي | استخدم رقمك ثم احذفه من اللوحة بعد التأكد |

---

## 10. التراجع (Rollback)

- **التطبيق:** Vercel → Deployments → اختر النشر السابق → **Promote to Production**.
- **قاعدة البيانات:** الترحيلات إضافية؛ لا حاجة لتراجع. لو حدث خطأ، استخدم Point-in-Time Restore من Neon.
- تغيير `SESSION_SECRET` يُبطل كل الجلسات الحالية (سلوك متوقع).

---

## 11. قائمة Go / No-Go قبل الإطلاق العام

- [ ] استبدال `[LEGAL ENTITY NAME]` و`[COMMERCIAL REGISTRATION NO.]` و`[REGISTERED ADDRESS]` و`[PRIVACY CONTACT EMAIL]` في `src/content/legal.ts`.
- [ ] اعتماد رقم التواصل الرسمي وإظهاره.
- [ ] اعتماد المساحة والطوابق وحالة التسليم والإتاحة والشروط.
- [ ] توثيق دومين Resend وضبط بريد الفريق.
- [ ] ضبط `NEXT_PUBLIC_SITE_URL` على الدومين النهائي.
- [ ] إزالة أي صفوف `is_demo` من الإنتاج.
- [ ] التأكد أن `/admin` غير مفهرس (`noindex` + robots).

---

## 12. ملاحظات أمان

- `.env.local` مستبعد من Git؛ `.env.example` فقط هو المُلتزم.
- لا تشارك `ADMIN_PASSWORD_HASH` أو المفاتيح في المحادثات.
- نسخ Neon الاحتياطية: فعّل Point-in-Time Restore (RPO المستهدف 24 ساعة).
- لتغيير كلمة مرور الأدمن: ولّد hash جديدًا وحدّث المتغير في Vercel ثم أعد النشر.
