'use client';

import Image from 'next/image';
import brandLogo from '@public/solo_logo.png';
import brandWrite from '@public/solo_scritta.png';
import styles from './NavBar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.brandContainer}>
        <Image
          src={brandLogo}
          alt="Polyglot Logo"
          className={styles.brandLogo}
        />
        <Image
          src={brandWrite}
          alt="Polyglot Text"
          className={styles.brandWrite}
        />
      </div>
    </nav>
  );
}