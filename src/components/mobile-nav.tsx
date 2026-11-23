"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/language-provider";

export function MobileNav() {
  const { tr } = useLanguage();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const links = [
    { href: "/#opportunities", label: tr("الفرص", "Opportunities") },
    { href: "/units", label: tr("استكشف المساحات", "Explore spaces") },
    { href: "/corporate-partners", label: tr("شراكات الشركات", "Corporate") },
    { href: "/contact", label: tr("ابدأ استفسارك", "Start enquiry") },
  ];

  return (
    <div className="mobile-nav">
      <button
        ref={buttonRef}
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? tr("إغلاق القائمة", "Close menu") : tr("فتح القائمة", "Open menu")}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden>{open ? "✕" : "☰"}</span>
      </button>

      <div id="mobile-menu" ref={panelRef} className="mobile-menu" hidden={!open}>
        <nav aria-label={tr("التنقل الرئيسي", "Main navigation")}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
