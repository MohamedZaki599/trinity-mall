import type { EnquiryField } from "@/lib/validation/enquiry";

export type EnquiryState =
  | { status: "idle" }
  | { status: "success"; id: string }
  | { status: "error"; fields: Partial<Record<EnquiryField, string>>; form?: string };

export const initialEnquiryState: EnquiryState = { status: "idle" };
