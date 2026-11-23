"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/login/actions";
import { useLanguage } from "@/components/language-provider";

const errors: Record<string, [string, string]> = {
  INVALID_CREDENTIALS: ["بيانات الدخول غير صحيحة.", "Invalid email or password."],
  RATE_LIMITED: ["محاولات كثيرة. حاول بعد 15 دقيقة.", "Too many attempts. Try again in 15 minutes."],
};

export function LoginForm({ next }: { next: string }) {
  const { tr } = useLanguage();
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <section className="contact-form-shell login-shell">
      <p className="kicker">{tr("دخول الفريق", "TEAM ACCESS")}</p>
      <h1>{tr("لوحة العملاء", "Lead desk")}</h1>
      <form className="enquiry-form" action={action}>
        <div className="form-grid">
          <label className="full-width">
            {tr("البريد الإلكتروني", "Email")}
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="name@example.com"
            />
          </label>
          <label className="full-width">
            {tr("كلمة المرور", "Password")}
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
        </div>
        <input type="hidden" name="next" value={next} />
        {state.error && (
          <p className="form-error" role="alert">
            {tr(
              errors[state.error]?.[0] ?? errors.INVALID_CREDENTIALS[0],
              errors[state.error]?.[1] ?? errors.INVALID_CREDENTIALS[1],
            )}
          </p>
        )}
        <div className="form-submit">
          <button className="button button-gold" type="submit" disabled={pending}>
            {pending ? tr("جارٍ الدخول…", "Signing in…") : tr("تسجيل الدخول", "Sign in")}
          </button>
        </div>
      </form>
    </section>
  );
}
