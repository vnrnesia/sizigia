import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        Sizigia
      </div>
      <nav className={styles.nav}>
        <a href="#" className={styles.navLink}>О нас</a>
        <a href="#" className={styles.navLink}>Галерия</a>
        <a href="#" className={styles.navLink}>Контакт</a>
      </nav>
    </header>
  );
};

export default Header; 