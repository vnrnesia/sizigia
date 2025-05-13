import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FrameScroll.module.css";
import { motion, AnimatePresence } from "framer-motion";

const FrameScroll = () => {
  const navigate = useNavigate();
  const [currentFrame, setCurrentFrame] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentText, setCurrentText] = useState("всем");
  const [fadeOutText, setFadeOutText] = useState("");
  const [isTextTransitioning, setIsTextTransitioning] = useState(false);
  const totalFrames = 106;

  const texts = ["всем", "привет", "севодня", "мы", "посмотрим", "сизигиа"];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = scrollPosition / (documentHeight - windowHeight);

      setScrollProgress(scrollPercentage);

      const textIndex = Math.min(
        Math.floor(scrollPercentage * texts.length),
        texts.length - 1
      );

      if (currentText !== texts[textIndex] && !isTextTransitioning) {
        setIsTextTransitioning(true);
        setFadeOutText(currentText);

        setCurrentText(texts[textIndex]);

        setTimeout(() => {
          setFadeOutText("");
          setIsTextTransitioning(false);
        }, 600);
      }

      const frameNumber = Math.min(
        Math.max(1, Math.floor(scrollPercentage * totalFrames) + 1),
        totalFrames
      );

      setCurrentFrame(frameNumber);

      if (frameNumber === totalFrames && !showVideo && !isTransitioning) {
        setIsTransitioning(true);
        setTimeout(() => {
          setShowVideo(true);
          setTimeout(() => {
            setIsTransitioning(false);
          }, 500);
        }, 500);
      } else if (frameNumber < totalFrames && showVideo && !isTransitioning) {
        setIsTransitioning(true);
        setTimeout(() => {
          setShowVideo(false);
          setTimeout(() => {
            setIsTransitioning(false);
          }, 500);
        }, 500);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentText, showVideo, isTransitioning, isTextTransitioning]);

  const getTextPosition = () => {
    if (showVideo) {
      return "translate(-50%, -150%)";
    }
    const slideUpAmount = -scrollProgress * 80;
    return `translate(-50%, calc(-50% + ${slideUpAmount}vh))`;
  };

  return (
    <>
      <div className={styles.container}>
        <div
          className={`${styles.frameContainer} ${
            isTransitioning ? styles.transitioning : ""
          }`}
        >
          <img
            src={`/frames/frame_${String(currentFrame).padStart(3, "0")}.webp`}
            alt={`Frame ${currentFrame}`}
            className={`${styles.frame} ${
              showVideo || isTransitioning ? styles.fadeOut : ""
            }`}
          />
          <video
            className={`${styles.video} ${showVideo ? styles.fadeIn : ""}`}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
          {showVideo && (
            <div className={styles.centeredText}>
              Умный дамах <br />
            </div>
          )}
        </div>
        <div
          className={styles.greeting}
          style={{ transform: getTextPosition() }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentText}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.3 }}
              className={styles.text}
            >
              {currentText}
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className={`${styles.scrollIndicator} ${!showVideo ? styles.show : ''}`}
          onClick={() => navigate("/about")}
          style={{ cursor: "pointer" }}
        >
          <span className={styles.scrollText}>узнать больше</span>
          <svg
            className={styles.scrollArrow}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5L12 19M12 19L5 12M12 19L19 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div
          className={`${styles.videoButton} ${showVideo ? styles.show : ''}`}
          onClick={() => navigate("/about")}
          style={{ cursor: "pointer" }}
        >
          <span className={styles.buttonText}>узнать больше</span>
        </div>
      </div>
    </>
  );
};

export default FrameScroll;
