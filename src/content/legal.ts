export const POLICY_VERSION = "1.0";
export const POLICY_EFFECTIVE_DATE = "2026-11-24";
export const DATA_RETENTION_MONTHS = 24;

// Replace every bracketed placeholder with management-approved details before launch.
export const legalEntity = {
  name: "[LEGAL ENTITY NAME]",
  registration: "[COMMERCIAL REGISTRATION NO.]",
  address: "[REGISTERED ADDRESS]",
  email: "[PRIVACY CONTACT EMAIL]",
};

export type Bilingual = { ar: string; en: string };
export type LegalSection = { title: Bilingual; body: Bilingual[] };

export const privacySections: LegalSection[] = [
  {
    title: { ar: "من نحن", en: "Who we are" },
    body: [
      {
        ar: `هذا الموقع تشغّله ${legalEntity.name} ("Trinity Mall"). نحن المتحكم في البيانات الشخصية التي تُجمع عبر نماذج الاستفسار. يمكن التواصل معنا بخصوص الخصوصية عبر ${legalEntity.email}.`,
        en: `This website is operated by ${legalEntity.name} ("Trinity Mall"). We are the controller of the personal data collected through the enquiry forms. You can reach us about privacy at ${legalEntity.email}.`,
      },
    ],
  },
  {
    title: { ar: "البيانات التي نجمعها", en: "Data we collect" },
    body: [
      {
        ar: "نجمع الاسم، رقم الهاتف، والبريد الإلكتروني (اختياري)، وطبيعة النشاط، والمساحة المطلوبة، ونص رسالتك، ولغة الموقع، وتاريخ الموافقة. كما نحفظ بصمة مشفّرة (HMAC) لعنوان IP لأغراض منع الإساءة فقط، ولا نحفظ عنوان IP الخام.",
        en: "We collect your name, phone number, optional email, business activity, desired area, your message, site language and the time of consent. We also store a keyed hash (HMAC) of your IP address solely for abuse prevention; we do not store the raw IP address.",
      },
    ],
  },
  {
    title: { ar: "لماذا نعالج بياناتك", en: "Why we process it" },
    body: [
      {
        ar: "نعالج بياناتك بناءً على موافقتك، ولغرض واحد فقط: الرد على استفسارك بخصوص البيع أو التأجير أو الشراكة، وترتيب زيارة أو اجتماع عند الحاجة. لا نستخدم بياناتك في تسويق غير مطلوب.",
        en: "We process your data on the basis of your consent and for one purpose only: responding to your sales, leasing or partnership enquiry and arranging a visit or meeting when needed. We do not use your data for unsolicited marketing.",
      },
    ],
  },
  {
    title: { ar: "مدة الاحتفاظ", en: "Retention" },
    body: [
      {
        ar: `نحتفظ بالاستفسار لمدة ${DATA_RETENTION_MONTHS} شهرًا من تاريخ استلامه، ثم يُحذف نهائيًا أو تُزال منه البيانات الشخصية. يمكنك طلب الحذف في أي وقت.`,
        en: `We retain an enquiry for ${DATA_RETENTION_MONTHS} months from receipt, after which it is permanently deleted or stripped of personal data. You can request deletion at any time.`,
      },
    ],
  },
  {
    title: { ar: "من يصل إلى بياناتك", en: "Who can access it" },
    body: [
      {
        ar: "يصل إلى البيانات فريق Trinity Mall المخوّل فقط. نستخدم مزوّدي خدمة للمعالجة: Vercel (استضافة)، Neon (قاعدة بيانات)، وResend (إرسال بريد التنبيه). قد تتم المعالجة خارج مصر، ونعتمد على الضمانات التعاقدية المتاحة لدى هؤلاء المزوّدين. لا نبيع بياناتك.",
        en: "Only authorised Trinity Mall staff can access the data. We use processors: Vercel (hosting), Neon (database) and Resend (notification email). Processing may take place outside Egypt, relying on the contractual safeguards those providers offer. We never sell your data.",
      },
    ],
  },
  {
    title: { ar: "حقوقك", en: "Your rights" },
    body: [
      {
        ar: "لك الحق في الوصول إلى بياناتك، وتصحيحها، وحذفها، وسحب موافقتك في أي وقت. أرسل طلبك إلى " + legalEntity.email + " وسنستجيب خلال مدة معقولة.",
        en: "You may access, correct or delete your data, and withdraw consent at any time. Send your request to " + legalEntity.email + " and we will respond within a reasonable period.",
      },
    ],
  },
  {
    title: { ar: "ملفات تعريف الارتباط والتخزين المحلي", en: "Cookies and local storage" },
    body: [
      {
        ar: "لا نستخدم ملفات تتبّع أو تحليلات. يخزّن المتصفح تفضيل اللغة فقط (عربي/إنجليزي) في التخزين المحلي، وهو تخزين ضروري وظيفيًا. إذا أضفنا تحليلات لاحقًا فسنطلب موافقتك أولًا.",
        en: "We do not use tracking cookies or analytics. Your browser stores only the language preference (Arabic/English) in local storage, which is strictly functional. If analytics are added later, we will ask for your consent first.",
      },
    ],
  },
  {
    title: { ar: "الأمان", en: "Security" },
    body: [
      {
        ar: "نستخدم اتصالًا مشفّرًا، وتخزينًا في قاعدة بيانات محمية، وصلاحية وصول محدودة للفريق، وحماية من الإساءة. لا يمكن ضمان أمان أي نظام بشكل مطلق.",
        en: "We use encrypted transport, a protected database, limited staff access and abuse protection. No system can be guaranteed absolutely secure.",
      },
    ],
  },
  {
    title: { ar: "تحديثات السياسة", en: "Policy updates" },
    body: [
      {
        ar: `النسخة الحالية ${POLICY_VERSION} بتاريخ ${POLICY_EFFECTIVE_DATE}. عند تغيير جوهري نحدّث رقم النسخة، ويُحفظ رقم النسخة المقبول مع كل استفسار جديد.`,
        en: `Current version ${POLICY_VERSION}, effective ${POLICY_EFFECTIVE_DATE}. On a material change we update the version number, and the accepted version is stored with each new enquiry.`,
      },
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    title: { ar: "طبيعة الموقع", en: "Nature of the site" },
    body: [
      {
        ar: "هذا الموقع منصة تعريفية لاستقبال الاستفسارات بخصوص Trinity Mall. محتواه ليس عرضًا تجاريًا ملزمًا، ولا يُنشئ أي حق أو التزام تعاقدي.",
        en: "This site is an informational platform for receiving enquiries about Trinity Mall. Its content is not a binding commercial offer and creates no contractual right or obligation.",
      },
    ],
  },
  {
    title: { ar: "بيانات توضيحية", en: "Illustrative data" },
    body: [
      {
        ar: "الوحدات والمساحات المعروضة بيانات تجريبية للتوضيح فقط. الإتاحة الفعلية والمساحات والأسعار والشروط يؤكدها فريق Trinity Mall في عرض رسمي.",
        en: "Units and areas shown are sample data for illustration only. Actual availability, areas, prices and terms are confirmed by the Trinity Mall team in a formal proposal.",
      },
    ],
  },
  {
    title: { ar: "ملكية المحتوى", en: "Content ownership" },
    body: [
      {
        ar: "الشعار والصور والتصورات المعمارية مملوكة للمشروع ومزوّديها، ولا يجوز إعادة استخدامها دون إذن. الصور الموصوفة كتصورات ليست صورًا لحالة تشغيل حالية.",
        en: "The logo, photographs and architectural visualisations belong to the project and its suppliers and may not be reused without permission. Images labelled as visualisations are not photographs of current operating conditions.",
      },
    ],
  },
  {
    title: { ar: "الاستخدام المقبول", en: "Acceptable use" },
    body: [
      {
        ar: "يُمنع إرسال بيانات كاذبة أو محتوى مسيء أو محاولات إساءة استخدام النماذج. نحتفظ بحق رفض أو حذف أي استفسار.",
        en: "Submitting false details, abusive content or attempts to abuse the forms is prohibited. We reserve the right to reject or delete any enquiry.",
      },
    ],
  },
  {
    title: { ar: "حدود المسؤولية", en: "Liability" },
    body: [
      {
        ar: "نبذل جهدًا معقولًا لصحة المعلومات، لكننا لا نضمن خلوها من الأخطاء أو استمرار توفر الموقع دون انقطاع. لا نتحمل مسؤولية قرارات اتُخذت بناءً على محتوى توضيحي.",
        en: "We take reasonable care with the accuracy of information but do not warrant that it is error-free or that the site will be uninterrupted. We are not liable for decisions made on illustrative content.",
      },
    ],
  },
  {
    title: { ar: "القانون الحاكم", en: "Governing law" },
    body: [
      {
        ar: "تخضع هذه الشروط لقوانين جمهورية مصر العربية. أي نزاع يخضع لاختصاص المحاكم المختصة.",
        en: "These terms are governed by the laws of the Arab Republic of Egypt, and disputes are subject to the competent courts.",
      },
    ],
  },
  {
    title: { ar: "التواصل", en: "Contact" },
    body: [
      {
        ar: `${legalEntity.name} — ${legalEntity.address}. البريد: ${legalEntity.email}.`,
        en: `${legalEntity.name} — ${legalEntity.address}. Email: ${legalEntity.email}.`,
      },
    ],
  },
];
