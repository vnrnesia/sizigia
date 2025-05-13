import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';

  // Sayfa yüklenirken animasyonu tetiklemek için bir durum ekleyebiliriz.
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isAboutPage) {
      setIsTransitioning(true);  // About sayfasına gidildiğinde animasyonu başlat
    } else {
      setIsTransitioning(false);  // Diğer sayfalarda animasyon bitmeli
    }
  }, [isAboutPage]);

  return (
    <header className={`${styles.header} ${isTransitioning ? styles.blackText : ''}`}>
      <div className={styles.logo}>
        <Link to="/" className={isAboutPage ? styles.blackText : ''}>
          Sizigia
        </Link>
      </div>
      <nav className={styles.nav}>
        <Link to="/about" className={`${styles.navLink} ${isAboutPage ? styles.blackText : ''}`}>
          О нас
        </Link>
        <Link to="/gallery" className={`${styles.navLink} ${isAboutPage ? styles.blackText : ''}`}>
          Галерия
        </Link>
        <Link to="/contact" className={`${styles.navLink} ${isAboutPage ? styles.blackText : ''}`}>
          Контакт
        </Link>
      </nav>
    </header>
  );
};

export default Header;
