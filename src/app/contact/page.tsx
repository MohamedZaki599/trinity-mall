"use client";
import { EnquiryForm } from "@/components/enquiry-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useLanguage } from "@/components/language-provider";
export default function ContactPage() { const { tr } = useLanguage(); return <><SiteHeader /><main className="inner-page contact-page v2-page"><section className="contact-intro"><span>01</span><div><p className="kicker">{tr("طلب معلومات", "REQUEST INFORMATION")}</p><h1>{tr("ابدأ من احتياجك.\nثم حدّد الخطوة التالية.", "Start with your need.\nThen define the next step.")}</h1><p>{tr("أجب عن الأسئلة الأساسية لنفهم ما تبحث عنه. هذا النموذج تجريبي ويحفظ البيانات محليًا فقط.", "Answer the essential questions so we can understand what you need. This demo saves data locally only.")}</p></div></section><section className="contact-form-shell"><EnquiryForm /></section></main><SiteFooter /></>; }
