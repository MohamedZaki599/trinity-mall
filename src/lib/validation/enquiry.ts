import { z } from "zod";
import { enquiryCategories, type EnquiryCategory, type EnquiryLocale } from "@/db/schema";

export type EnquiryField = "name" | "phone" | "email" | "category" | "area" | "message" | "consent";

export type EnquiryValues = {
  name: string;
  phoneE164: string;
  email: string | null;
  category: EnquiryCategory;
  business: string | null;
  areaSqm: number | null;
  message: string | null;
  locale: EnquiryLocale;
};

export type EnquiryValidation =
  | { ok: true; value: EnquiryValues }
  | { ok: false; fields: Partial<Record<EnquiryField, string>> };

const phonePattern = /^\+201[0125]\d{8}$/;

// Accepts 01012345678, 1012345678, +201012345678 and 00201012345678.
export function normalizeEgyptianPhone(input: string): string | null {
  const digits = input.replace(/[\s\-()]/g, "");
  const match = digits.match(/^(?:\+20|0020|0)?(1[0125]\d{8})$/);
  return match ? `+20${match[1]}` : null;
}

export function parseEnquiryInput(raw: {
  name: string;
  phone: string;
  email: string;
  category: string;
  business: string;
  area: string;
  message: string;
  locale: string;
  consent: string;
}): EnquiryValidation {
  const fields: Partial<Record<EnquiryField, string>> = {};

  const name = raw.name.trim();
  if (name.length < 2 || name.length > 120) fields.name = "INVALID_NAME";

  const phoneE164 = normalizeEgyptianPhone(raw.phone);
  if (!phoneE164 || !phonePattern.test(phoneE164)) fields.phone = "INVALID_PHONE";

  const emailRaw = raw.email.trim();
  if (emailRaw && !z.email().max(254).safeParse(emailRaw).success) fields.email = "INVALID_EMAIL";

  const category = raw.category.trim();
  if (!(enquiryCategories as readonly string[]).includes(category)) {
    fields.category = "INVALID_CATEGORY";
  }

  const areaRaw = raw.area.trim();
  let areaSqm: number | null = null;
  if (areaRaw) {
    const parsed = Number(areaRaw);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 99999) fields.area = "INVALID_AREA";
    else areaSqm = parsed;
  }

  const message = raw.message.trim();
  if (message.length > 2000) fields.message = "INVALID_MESSAGE";

  if (!["on", "true"].includes(raw.consent.trim())) fields.consent = "CONSENT_REQUIRED";

  if (Object.keys(fields).length > 0) return { ok: false, fields };

  return {
    ok: true,
    value: {
      name,
      phoneE164: phoneE164 as string,
      email: emailRaw || null,
      category: category as EnquiryCategory,
      business: raw.business.trim() || null,
      areaSqm,
      message: message || null,
      locale: raw.locale === "en" ? "en" : "ar",
    },
  };
}
