"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NavMenuButton } from "@/components/ui/nav-menu-button";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Pricing", href: "#products" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export function NavBar() {
  const [moveUp, setMoveUp] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const prevY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - prevY.current;

      if (currentY < 20) {
        setMoveUp(false);
      } else if (delta > 2) {
        setMoveUp(true);
      } else if (delta < -2) {
        setMoveUp(false);
      }

      prevY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`top-nav ${moveUp ? "nav-hidden" : ""}`}
        role="banner"
      >
        <Link href="#home" className="brand-link" aria-label="Capabloo home">
          <Image
            src="/branding/capabloo-logo.png"
            alt="Capabloo"
            width={320}
            height={105}
            priority
            className="brand-logo"
            style={{ height: "auto" }}
            sizes="(max-width: 768px) 220px, 300px"
          />
        </Link>

        <NavMenuButton
          open={menuOpen}
          onToggle={() => setMenuOpen((open) => !open)}
          controlsId="nav-drawer"
        />
      </header>

      {menuOpen && (
        <button
          type="button"
          className="drawer-overlay"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}

      <aside
        id="nav-drawer"
        className={`mobile-drawer ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
