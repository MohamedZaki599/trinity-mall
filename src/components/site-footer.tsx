import Link from "next/link";
import { publishedLocation } from "@/content/project";

export function SiteFooter() { return <footer className="site-footer"><div><strong>TRINITY MALL</strong><p>{publishedLocation} <span>· Published location</span></p></div><div><Link href="/contact">Enquire</Link><Link href="/admin/leads">Demo lead dashboard</Link></div></footer>; }
