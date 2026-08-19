"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/v2/copy";
import styles from "./SiteHeader.module.css";
import { asset } from "@/lib/asset";

/** Cabeçalho com o logo oficial. O filete só aparece depois que a página rola. */
export function SiteHeader() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${solid ? styles.solid : ""}`}>
      <div className={styles.inner}>
        <a href="#top" aria-label="Anchor by Cardioline, home">
          <Image
            src={asset("/brand/cardioline-logo.svg")}
            alt="Cardioline"
            width={600}
            height={38}
            priority
            className={styles.logo}
          />
        </a>
        <nav className={styles.nav} aria-label="Main">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className={styles.link}>
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#pricing" className={styles.cta}>
          Get Anchor
        </a>
      </div>
    </header>
  );
}
