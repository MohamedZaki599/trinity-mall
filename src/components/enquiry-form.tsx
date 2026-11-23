"use client";

import { FormEvent, useState } from "react";
import { useLanguage } from "@/components/language-provider";

export function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const { tr } = useLanguage();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone") ?? "").replace(/[\s-]/g, "");
    if (!/^((\+20|0020|0)1[0-25]\d{8})$/.test(phone)) { setError(tr("أدخل رقم هاتف مصريًا صحيحًا.", "Enter a valid Egyptian mobile number.")); setMessage(null); return; }
    if (!data.get("consent")) { setError(tr("يرجى تأكيد الموافقة قبل الإرسال.", "Please confirm consent before submitting.")); setMessage(null); return; }
    const entry = { id: crypto.randomUUID(), name: data.get("name"), phone, category: data.get("category"), business: data.get("business"), area: data.get("area"), status: "New", source: "MVP website", createdAt: new Date().toISOString(), isDemo: false };
    const saved = JSON.parse(localStorage.getItem("trinity-enquiries") || "[]");
    localStorage.setItem("trinity-enquiries", JSON.stringify([entry, ...saved]));
    event.currentTarget.reset(); setError(null); setMessage(tr("تم حفظ استفسارك محليًا داخل النموذج التجريبي. لم يتم إرسال أي بيانات إلى جهة خارجية.", "Your enquiry was saved locally in this demo. No data was sent to a third party."));
  }
  const categories = [["buy", tr("شراء / امتلاك", "Buy / own")], ["lease", tr("تأجير", "Lease")], ["corporate", tr("شراكة مؤسسية", "Corporate partnership")], ["general", tr("استفسار عام", "General enquiry")]];
  return <form className={`enquiry-form ${compact ? "compact" : ""}`} onSubmit={submit} noValidate><div className="form-grid"><label>{tr("الاسم الكامل", "Full name")}<input required name="name" placeholder={tr("اكتب اسمك", "Enter your full name")} /></label><label>{tr("رقم الهاتف", "Phone number")}<input required name="phone" inputMode="tel" placeholder="01XXXXXXXXX" /></label>{!compact && <label>{tr("البريد الإلكتروني", "Email")} <em>{tr("اختياري", "optional")}</em><input name="email" type="email" placeholder="name@example.com" /></label>}<label>{tr("ما الذي تبحث عنه؟", "What are you looking for?")}<select required name="category" defaultValue=""><option value="" disabled>{tr("اختر المسار", "Choose a path")}</option>{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>{tr("طبيعة النشاط", "Business activity")}<input name="business" placeholder={tr("مثال: كافيه، مكتب، خدمات", "e.g. café, office, services")} /></label><label>{tr("المساحة التقريبية", "Desired area")} <em>{tr("اختياري", "optional")}</em><input name="area" inputMode="numeric" placeholder={tr("بالمتر المربع", "in m²")} /></label>{!compact && <label className="full-width">{tr("رسالة إضافية", "Additional note")}<textarea name="message" rows={4} placeholder={tr("شاركنا ما تحتاجه أو أي تفاصيل مهمة.", "Tell us what you need or share any relevant details.")} /></label>}</div><label className="consent"><input type="checkbox" name="consent" />{tr("أوافق على حفظ هذه البيانات محليًا ضمن النموذج التوضيحي.", "I agree to save these details locally for this prototype.")}</label>{error && <p className="form-error" role="alert">{error}</p>}{message && <p className="form-success" role="status">{message}</p>}<div className="form-submit"><button className="button button-gold" type="submit">{tr("احفظ الاستفسار", "Save enquiry")} <span>↗</span></button><p>{tr("يمكنك متابعة الطلب بعد الحفظ من لوحة العملاء التجريبية.", "After saving, you can review the request in the demo lead desk.")}</p></div></form>;
}
