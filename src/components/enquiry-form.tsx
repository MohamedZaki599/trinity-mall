"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { submitEnquiry } from "@/app/actions/enquiry";
import { useLanguage } from "@/components/language-provider";
import { initialEnquiryState } from "@/lib/leads/state";
import type { EnquiryField } from "@/lib/validation/enquiry";

const messages: Record<string, [string, string]> = {
  INVALID_NAME: ["يرجى إدخال اسم صحيح (حرفان على الأقل).", "Enter a valid name (at least two characters)."],
  INVALID_PHONE: ["أدخل رقم هاتف مصريًا صحيحًا.", "Enter a valid Egyptian mobile number."],
  INVALID_EMAIL: ["أدخل بريدًا إلكترونيًا صحيحًا.", "Enter a valid email address."],
  INVALID_CATEGORY: ["اختر نوع الاستفسار.", "Choose an enquiry type."],
  INVALID_AREA: ["أدخل مساحة صحيحة بالمتر المربع.", "Enter a valid area in m²."],
  INVALID_MESSAGE: ["الرسالة طويلة جدًا.", "The message is too long."],
  CONSENT_REQUIRED: ["يرجى تأكيد الموافقة قبل الإرسال.", "Please confirm consent before submitting."],
  RATE_LIMITED: ["تم استلام طلبات كثيرة. حاول بعد قليل.", "Too many submissions. Please try again shortly."],
  SPAM_REJECTED: ["تعذّر إرسال النموذج. حاول مرة أخرى.", "We could not submit the form. Please try again."],
  SERVER_ERROR: ["حدث خطأ غير متوقع. حاول لاحقًا.", "Something went wrong. Please try again later."],
};

export function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const { tr, locale } = useLanguage();
  const [state, formAction, pending] = useActionState(submitEnquiry, initialEnquiryState);
  const renderedAtRef = useRef<HTMLInputElement>(null);
  const uid = useId();

  useEffect(() => {
    if (renderedAtRef.current) renderedAtRef.current.value = String(Date.now());
  }, []);

  if (state.status === "success") {
    return (
      <div className="enquiry-form">
        <p className="form-success" role="status">
          {tr(
            "تم استلام استفسارك. سيتواصل معك فريق Trinity Mall قريبًا.",
            "Your enquiry was received. The Trinity Mall team will contact you shortly.",
          )}
        </p>
      </div>
    );
  }

  const fieldError = (name: EnquiryField) => (state.status === "error" ? state.fields[name] : undefined);

  const errorProps = (name: EnquiryField) => {
    const code = fieldError(name);
    return {
      "aria-invalid": code ? true : undefined,
      "aria-describedby": code ? `${uid}-${name}-error` : undefined,
    };
  };

  const fieldMessage = (name: EnquiryField) => {
    const code = fieldError(name);
    if (!code) return null;
    const copy = messages[code] ?? messages.SERVER_ERROR;
    return (
      <span className="field-error" id={`${uid}-${name}-error`}>
        {tr(copy[0], copy[1])}
      </span>
    );
  };

  const categories: Array<[string, string]> = [
    ["buy", tr("شراء / امتلاك", "Buy / own")],
    ["lease", tr("تأجير", "Lease")],
    ["corporate", tr("شراكة مؤسسية", "Corporate partnership")],
    ["general", tr("استفسار عام", "General enquiry")],
  ];

  return (
    <form className={`enquiry-form ${compact ? "compact" : ""}`} action={formAction} noValidate>
      <div className="form-grid">
        <label>
          {tr("الاسم الكامل", "Full name")}
          <input
            required
            name="name"
            autoComplete="name"
            placeholder={tr("اكتب اسمك", "Enter your full name")}
            {...errorProps("name")}
          />
          {fieldMessage("name")}
        </label>

        <label>
          {tr("رقم الهاتف", "Phone number")}
          <input
            required
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="01XXXXXXXXX"
            {...errorProps("phone")}
          />
          {fieldMessage("phone")}
        </label>

        {!compact && (
          <label>
            {tr("البريد الإلكتروني", "Email")} <em>{tr("اختياري", "optional")}</em>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              {...errorProps("email")}
            />
            {fieldMessage("email")}
          </label>
        )}

        <label>
          {tr("ما الذي تبحث عنه؟", "What are you looking for?")}
          <select required name="category" defaultValue="" {...errorProps("category")}>
            <option value="" disabled>
              {tr("اختر المسار", "Choose a path")}
            </option>
            {categories.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {fieldMessage("category")}
        </label>

        <label>
          {tr("طبيعة النشاط", "Business activity")}
          <input
            name="business"
            placeholder={tr("مثال: كافيه، مكتب، خدمات", "e.g. café, office, services")}
          />
        </label>

        <label>
          {tr("المساحة التقريبية", "Desired area")} <em>{tr("اختياري", "optional")}</em>
          <input
            name="area"
            inputMode="numeric"
            placeholder={tr("بالمتر المربع", "in m²")}
            {...errorProps("area")}
          />
          {fieldMessage("area")}
        </label>

        {!compact && (
          <label className="full-width">
            {tr("رسالة إضافية", "Additional note")}
            <textarea
              name="message"
              rows={4}
              placeholder={tr(
                "شاركنا ما تحتاجه أو أي تفاصيل مهمة.",
                "Tell us what you need or share any relevant details.",
              )}
              {...errorProps("message")}
            />
            {fieldMessage("message")}
          </label>
        )}
      </div>

      <label className="consent">
        <input type="checkbox" name="consent" {...errorProps("consent")} />
        <span>
          {tr(
            "أوافق على احتفاظ Trinity Mall ببياناتي والتواصل معي بخصوص استفساري وفق سياسة الخصوصية (v1.0).",
            "I agree to Trinity Mall storing my details and contacting me about my enquiry under the Privacy Policy (v1.0).",
          )}
        </span>
      </label>
      {fieldMessage("consent")}

      <div className="hp-field" aria-hidden="true">
        <label>
          Company website
          <input name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="locale" value={locale} />
      <input ref={renderedAtRef} type="hidden" name="rendered_at" defaultValue="" />

      {state.status === "error" && state.form && (
        <p className="form-error" role="alert">
          {tr(messages[state.form]?.[0] ?? messages.SERVER_ERROR[0], messages[state.form]?.[1] ?? messages.SERVER_ERROR[1])}
        </p>
      )}

      <div className="form-submit">
        <button className="button button-gold" type="submit" disabled={pending}>
          {pending
            ? tr("جارٍ الإرسال…", "Sending…")
            : tr("أرسل الاستفسار", "Send enquiry")}{" "}
          <span>↗</span>
        </button>
        <p>
          {tr(
            "بياناتك تُستخدم للرد على استفسارك فقط.",
            "Your details are used only to respond to your enquiry.",
          )}
        </p>
      </div>
    </form>
  );
}
