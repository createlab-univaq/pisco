import Image from "next/image";
import Link from "next/link";
import brandLogo from '@public/solo_logo.png';
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <Image
          src={brandLogo}
          alt="Polyglot Logo"
          width={80}
          height={80}
          priority
          className={styles.logo}
        />
        <h1 className={styles.title}>Welcome to Polyglot</h1>
        <p className={styles.subtitle}>
          The advanced node-based editor for designing, validating, and publishing interactive learning flows.
        </p>

        <Link href="/login" className={styles.ctaButton}>
          Get Started
        </Link>
      </div>
    </main>
  );
}