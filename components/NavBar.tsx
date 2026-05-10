"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Pricing", href: "#products" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

export function NavBar() {
  const [moveUp, setMoveUp] = useState(false);
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

  return (
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

      <nav className="desktop-nav" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div aria-hidden="true" />
    </header>
  );
}
