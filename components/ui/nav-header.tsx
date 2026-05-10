"use client";

import Link from "next/link";
import React from "react";

type TabItem = {
  label: string;
  href: string;
};

const TABS: TabItem[] = [
  { label: "Home", href: "#home" },
  { label: "Pricing", href: "#products" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

function NavHeader() {
  return (
    <nav aria-label="Primary" className="flex justify-center">
      <ul className="relative flex w-fit flex-row flex-nowrap items-center justify-center gap-2 sm:gap-3 md:gap-5">
        {TABS.map((tab) => (
          <Tab key={tab.label} href={tab.href}>
            {tab.label}
          </Tab>
        ))}
      </ul>
    </nav>
  );
}

type TabProps = {
  children: React.ReactNode;
  href: string;
};

const Tab = ({ children, href }: TabProps) => {
  return (
    <li className="relative z-10">
      <Link
        href={href}
        className="block cursor-pointer whitespace-nowrap px-1.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-black sm:px-2 sm:text-xs md:px-3 md:py-1.5 md:text-sm"
      >
        {children}
      </Link>
    </li>
  );
};

export default NavHeader;
