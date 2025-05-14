import styles from "./About.module.css";

function About() {
  return (
    <div className={styles.page}>
      <div className={styles.centeredText}>
        Умный дамах 
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.contentBox}>
          <h2>content</h2>
          <p>content</p>
        </div>
        <div className={styles.contentBox}>
          <h2>content</h2>
          <p>content</p>
        </div>
        <div className={styles.contentBox}>
          <h2>content</h2>
          <p>content</p>
        </div>
        <div className={styles.contentBox}>
          <h2>content</h2>
          <p>content</p>
        </div>
      </div>
    </div>
  );
}

export default About;
