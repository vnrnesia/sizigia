import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FrameScroll.module.css";
import { motion, AnimatePresence } from "framer-motion";
import PageLoader from "./PageLoader";

const CHUNK_SIZE = 10;
const PRELOAD_AHEAD = 20;
const INITIAL_FRAMES_TO_LOAD = 106;
const TOTAL_FRAMES = 106;

const FrameScroll = () => {
  const navigate = useNavigate();
  const [currentFrame, setCurrentFrame] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentText, setCurrentText] = useState("всем");
  const [isTextTransitioning, setIsTextTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedFrames, setLoadedFrames] = useState(0);

  const canvasRef = useRef(null);
  const frameImagesRef = useRef({});
  const loadingChunksRef = useRef(new Set());

  const texts = ["всем", "привет", "севодня", "мы", "посмотрим", "мы", "посмотрим", "мы", "посмотрим", "всем", "привет", "севодня", "мы", "посмотрим", "мы", "посмотрим", "мы", "посмотрим", "сизигиа"];

  // Frame preloader
  const loadFrameChunk = async (startFrame, endFrame) => {
    const chunkKey = `${startFrame}-${endFrame}`;
    if (loadingChunksRef.current.has(chunkKey)) return;

    loadingChunksRef.current.add(chunkKey);

    for (let i = startFrame; i <= endFrame && i <= TOTAL_FRAMES; i++) {
      if (!frameImagesRef.current[i]) {
        const img = new Image();
        const frameNum = String(i).padStart(3, "0");
        img.src = `/frames/frame_${frameNum}.webp`;
        await new Promise((resolve) => {
          img.onload = () => {
            setLoadedFrames((prev) => {
              const newCount = prev + 1;
              if (newCount === INITIAL_FRAMES_TO_LOAD) {
                setIsLoading(false);
              }
              return newCount;
            });
            resolve();
          };
          img.onerror = resolve;
        });
        frameImagesRef.current[i] = img;
      }
    }

    loadingChunksRef.current.delete(chunkKey);
  };

  // Draw image on canvas
  const drawFrame = (frameNumber) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const img = frameImagesRef.current[frameNumber];

    if (img) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  };

  // Canvas resizing only once on mount and on resize
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = 1920;
        canvas.height = 1080;
        drawFrame(currentFrame);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Draw frame on change with animation frame
  useEffect(() => {
    requestAnimationFrame(() => drawFrame(currentFrame));
  }, [currentFrame]);

  // Scroll listener wrapped in requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const scrollProgress = scrollTop / (documentHeight - windowHeight);

          const frameNumber = Math.min(
            Math.max(1, Math.floor(scrollProgress * TOTAL_FRAMES) + 1),
            TOTAL_FRAMES
          );

          setCurrentFrame(frameNumber);

          const textIndex = Math.min(
            Math.floor(scrollProgress * texts.length * 1.5),
            texts.length - 1
          );

          if (!isTextTransitioning && texts[textIndex] !== currentText) {
            setIsTextTransitioning(true);
            setCurrentText(texts[textIndex]);
            setTimeout(() => setIsTextTransitioning(false), 300);
          }

          // Preload ahead
          loadFrameChunk(
            Math.min(frameNumber + 1, TOTAL_FRAMES),
            Math.min(frameNumber + PRELOAD_AHEAD, TOTAL_FRAMES)
          );

          // Video transition
          if (frameNumber === TOTAL_FRAMES && !showVideo && !isTransitioning) {
            setIsTransitioning(true);
            setTimeout(() => {
              setShowVideo(true);
              setTimeout(() => setIsTransitioning(false), 500);
            }, 500);
          } else if (frameNumber < TOTAL_FRAMES && showVideo && !isTransitioning) {
            setIsTransitioning(true);
            setTimeout(() => {
              setShowVideo(false);
              setTimeout(() => setIsTransitioning(false), 500);
            }, 500);
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [currentText, isTextTransitioning, showVideo, isTransitioning]);

  useEffect(() => {
    loadFrameChunk(1, CHUNK_SIZE);
  }, []);

  const getTextPosition = () => {
    if (showVideo) return "translate(-50%, -150%)";
    const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const slideUpAmount = -progress * 80;
    return `translate(-50%, calc(-50% + ${slideUpAmount}vh))`;
  };

  return (
    <>
      {isLoading && <PageLoader />}
      <div className={styles.container}>
        <div className={`${styles.frameContainer} ${isTransitioning ? styles.transitioning : ""}`}>
          <canvas
            ref={canvasRef}
            className={`${styles.frame} ${showVideo || isTransitioning ? styles.fadeOut : ""}`}
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

        <div className={styles.greeting} style={{ transform: getTextPosition() }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentText}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={styles.text}
            >
              {currentText}
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className={`${styles.scrollIndicator} ${!showVideo ? styles.show : ""}`}
          onClick={() => navigate("/about")}
          style={{ cursor: "pointer" }}
        >
          <span className={styles.scrollText}>узнать больше</span>
          <svg className={styles.scrollArrow} width="24" height="24" viewBox="0 0 24 24">
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
          className={`${styles.videoButton} ${showVideo ? styles.show : ""}`}
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
