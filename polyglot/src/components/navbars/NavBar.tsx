'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/lib/actions/auth';
import brandLogo from '@public/solo_logo.png';
import brandWrite from '@public/solo_scritta.png';
import styles from './NavBar.module.css';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
  };

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.brandContainer}>
        <Image src={brandLogo} alt="Polyglot Logo" className={styles.brandLogo} />
        <Image src={brandWrite} alt="Polyglot Text" className={styles.brandWrite} />
      </Link>

      <div className={styles.navActions}>
        <Link href="/profile" className={styles.profileBtn}>
          Profilo
        </Link>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Esci
        </button>
      </div>
    </nav>
  );
}