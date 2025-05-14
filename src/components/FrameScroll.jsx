import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FrameScroll.module.css";
import { motion, AnimatePresence } from "framer-motion";
import PageLoader from "./PageLoader";

const CHUNK_SIZE = 10;
const PRELOAD_AHEAD = 20;
const INITIAL_FRAMES_TO_LOAD = 106;

const FrameScroll = () => {
  const navigate = useNavigate();
  const [currentFrame, setCurrentFrame] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentText, setCurrentText] = useState("всем");
  const [fadeOutText, setFadeOutText] = useState("");
  const [isTextTransitioning, setIsTextTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedFrames, setLoadedFrames] = useState(0);
  const totalFrames = 106;

  const canvasRef = useRef(null);
  const frameImagesRef = useRef({});
  const loadingChunksRef = useRef(new Set());

  const texts = ["всем", "привет", "севодня", "мы", "посмотрим", "мы", "посмотрим", "мы", "посмотрим", "всем", "привет", "севодня", "мы", "посмотрим", "мы", "посмотрим", "мы", "посмотрим", "сизигиа"];

  const loadFrameChunk = async (startFrame, endFrame) => {
    const chunkKey = `${startFrame}-${endFrame}`;
    if (loadingChunksRef.current.has(chunkKey)) return;
    
    loadingChunksRef.current.add(chunkKey);
    
    for (let i = startFrame; i <= endFrame && i <= totalFrames; i++) {
      if (!frameImagesRef.current[i]) {
        const img = new Image();
        const frameNum = String(i).padStart(3, "0");
        img.src = `/frames/frame_${frameNum}.webp`;
        await new Promise((resolve) => {
          img.onload = () => {
            setLoadedFrames(prev => {
              const newCount = prev + 1;
              if (newCount === INITIAL_FRAMES_TO_LOAD) {
                setIsLoading(false);
              }
              return newCount;
            });
            resolve();
          };
          img.onerror = () => {
            console.error(`Failed to load frame ${frameNum}`);
            resolve();
          };
        });
        frameImagesRef.current[i] = img;
      }
    }
    
    loadingChunksRef.current.delete(chunkKey);
  };

  const drawFrame = (frameNumber) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const img = frameImagesRef.current[frameNumber];
    
    if (img) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        drawFrame(currentFrame);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentFrame]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = scrollPosition / (documentHeight - windowHeight);

      setScrollProgress(scrollPercentage);

      const textIndex = Math.min(
        Math.floor(scrollPercentage * texts.length * 1.5),
        texts.length - 1
      );

      if (currentText !== texts[textIndex] && !isTextTransitioning) {
        setIsTextTransitioning(true);
        setFadeOutText(currentText);

        setCurrentText(texts[textIndex]);

        setTimeout(() => {
          setFadeOutText("");
          setIsTextTransitioning(false);
        }, 300);
      }

      const frameNumber = Math.min(
        Math.max(1, Math.floor(scrollPercentage * totalFrames) + 1),
        totalFrames
      );

      setCurrentFrame(frameNumber);

      const nextChunkStart = Math.min(frameNumber + 1, totalFrames);
      const nextChunkEnd = Math.min(frameNumber + PRELOAD_AHEAD, totalFrames);
      loadFrameChunk(nextChunkStart, nextChunkEnd);

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

  useEffect(() => {
    const initialChunkEnd = Math.min(CHUNK_SIZE, totalFrames);
    loadFrameChunk(1, initialChunkEnd);
  }, []);

  useEffect(() => {
    drawFrame(currentFrame);
  }, [currentFrame]);

  const getTextPosition = () => {
    if (showVideo) {
      return "translate(-50%, -150%)";
    }
    const slideUpAmount = -scrollProgress * 80;
    return `translate(-50%, calc(-50% + ${slideUpAmount}vh))`;
  };

  return (
    <>
      {isLoading && <PageLoader />}
      <div className={styles.container}>
        <div
          className={`${styles.frameContainer} ${
            isTransitioning ? styles.transitioning : ""
          }`}
        >
          <canvas
            ref={canvasRef}
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
              transition={{ duration: 0.2, ease: "easeOut" }}
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