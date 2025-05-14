import React, { useEffect, useState } from 'react';
import styles from './PageLoader.module.css';

const PageLoader = () => {
  const [shouldRemove, setShouldRemove] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (isFading) {
      const timer = setTimeout(() => {
        setShouldRemove(true);
      }, 500); // Match this with the CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isFading]);

  useEffect(() => {
    // Start fade out animation after a brief delay
    const timer = setTimeout(() => {
      setIsFading(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  if (shouldRemove) return null;

  return (
    <div className={`${styles.loaderContainer} ${isFading ? styles.fadeOut : ''}`}>
      <div className={styles.loader}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>
      <div className={styles.loadingText}>Sizigia</div>
    </div>
  );
};

export default PageLoader; 