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
    <ul className="relative flex w-fit items-center gap-3 md:gap-4">
      {TABS.map((tab) => (
        <Tab key={tab.label} href={tab.href}>
          {tab.label}
        </Tab>
      ))}
    </ul>
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
        className="block cursor-pointer px-2 py-1 text-xs font-semibold uppercase tracking-wide text-black md:px-3 md:py-1.5 md:text-sm"
      >
        {children}
      </Link>
    </li>
  );
};

export default NavHeader;
