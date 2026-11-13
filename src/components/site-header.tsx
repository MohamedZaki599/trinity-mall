import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return <header className="site-header"><Link className="brand" href="/" aria-label="Trinity Mall home"><Image src="/assets/00-trinity-mall-gold-logo.png" alt="Trinity Mall gold logo" width={50} height={50} priority /><span><strong>TRINITY</strong><small>MALL / NEW ASSIUT</small></span></Link><nav aria-label="Main navigation"><Link href="/#overview">Overview</Link><Link href="/units">Units</Link><Link href="/corporate-partners">Corporate partners</Link><Link href="/#location">Location</Link></nav><Link className="button button-gold header-cta" href="/contact">Explore opportunities</Link></header>;
}
