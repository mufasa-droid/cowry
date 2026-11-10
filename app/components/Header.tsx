"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Nearby", isActive: pathname === "/" || pathname.startsWith("/place") },
    { href: "/plan", label: "Plan a trip", isActive: pathname.startsWith("/plan") },
    { href: "/about", label: "About", isActive: pathname === "/about" },
  ];

  return (
    <header className="border-b border-cowry-hairline bg-white">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Wordmark & Demo data badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2.5">
            <Link
              href="/"
              className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-cowry-ink hover:text-cowry-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary"
            >
              BRT Lagos
            </Link>
            <span className="text-xs text-cowry-muted select-none" aria-label="Demo data prototype">
              Demo data
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav aria-label="Main Navigation">
          <ul className="flex items-center gap-1 sm:gap-2 -ml-2 sm:ml-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`inline-flex items-center min-h-[44px] px-2.5 sm:px-3 text-sm transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cowry-primary ${
                    link.isActive
                      ? "text-cowry-ink font-semibold border-b-2 border-cowry-primary -mb-[1px]"
                      : "text-cowry-muted hover:text-cowry-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

