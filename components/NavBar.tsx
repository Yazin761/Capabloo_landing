"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NavHeader from "@/components/ui/nav-header";

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
    <header className="z-50">
      <div
        className={`fixed top-6 left-4 transition-transform duration-300 md:left-8 ${
          moveUp ? "-translate-y-24" : "translate-y-0"
        }`}
      >
        <Link
          href="#home"
          className="inline-flex items-center"
          aria-label="Capabloo home"
        >
          <Image
            src="/branding/capabloo-logo.png"
            alt="Capabloo"
            width={128}
            height={42}
            priority
            className="h-auto w-[132px] md:w-[178px]"
          />
        </Link>
      </div>

      <div
        className={`fixed top-7 left-1/2 -translate-x-1/2 transition-transform duration-300 ${
          moveUp ? "-translate-y-24" : "translate-y-0"
        }`}
      >
        <NavHeader />
      </div>
    </header>
  );
}
