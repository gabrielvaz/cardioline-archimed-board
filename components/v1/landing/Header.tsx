"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/v1/cn";
import { Container } from "@/components/v1/ui/Container";
import { Button } from "@/components/v1/ui/Button";
import { AnchorLockup } from "@/components/v1/ui/Logo";
import { IconClose, IconMenu } from "@/components/v1/icons";

const NAV = [
  { label: "Anchor", href: "#anchor" },
  { label: "How it works", href: "#how-it-works" },
  { label: "For cardiologists", href: "#for-cardiologists" },
  { label: "For hospitals", href: "#for-hospitals" },
  { label: "Pricing", href: "#pricing" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Impede o scroll do fundo enquanto o menu movel esta aberto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white/92 backdrop-blur-[10px] transition-shadow duration-200",
        scrolled ? "border-b border-line shadow-[0_1px_2px_rgba(7,16,70,0.04)]" : "border-b border-transparent",
      )}
    >
      <Container>
        <div className="flex h-16 items-center gap-6 lg:h-[72px] lg:gap-12">
          <a href="#top" aria-label="Anchor by Cardioline, home" className="shrink-0">
            <AnchorLockup priority />
          </a>

          <nav aria-label="Main" className="hidden flex-1 items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[0.9375rem] font-medium text-ink-2 transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <Button href="#pricing" variant="ghost">
              Sign in
            </Button>
            <Button href="#pricing">Get started</Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="ml-auto flex size-10 items-center justify-center rounded-lg border border-line text-ink lg:hidden"
          >
            {open ? <IconClose className="size-5" /> : <IconMenu className="size-5" />}
          </button>
        </div>
      </Container>

      {open ? (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto border-t border-line bg-white lg:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3.5 text-lg font-medium text-ink"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2.5 border-t border-line pt-5">
              <Button href="#pricing" variant="secondary" size="lg" full onClick={() => setOpen(false)}>
                Sign in
              </Button>
              <Button href="#pricing" size="lg" full onClick={() => setOpen(false)}>
                Get started
              </Button>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
