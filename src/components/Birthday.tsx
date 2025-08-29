"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";

const BirthdayCelebration: React.FC = () => {
  const [isPopped, setIsPopped] = useState(false);
  const [showPoem, setShowPoem] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const birthdayMessageRef = useRef<HTMLDivElement>(null);
  const poemRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Balloon animation variants
  const balloonVariants: Variants = {
    initial: { scale: 0, y: 100, rotate: -20 },
    float: {
      scale: 1,
      y: [0, -20, 0],
      rotate: [-5, 5, -5],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 2,
          ease: "easeInOut",
        },
        rotate: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 4,
          ease: "easeInOut",
        },
        scale: { duration: 2, ease: "easeInOut" },
      },
    },
    pop: {
      scale: [1, 1.3, 0],
      rotate: [0, 20, -20],
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  // Confetti configuration
  const confettiConfig = {
    colors: [
      "#FFD700", "#FF69B4", "#00FF00", "#00BFFF",
      "#FF4500", "#8A2BE2", "#FF1493", "#32CD32",
      "#FFA500", "#00CED1", "#4B0082", "#7FFFD4", "#FFB6C1"
    ],
    shapes: ["square", "circle", "triangle", "star"], // Removed "heart" to prevent clipPath issues
    count: 150,
  };

  // Poem lines
  const poemLines = [
    "✨ ترے وجود سے مہک رہا ہے جہاں",
    "🌟 تری مسکراہٹ سے جگمگا ہے سماں",
    "🎈 یہ دن تری حیات کا ہے روشنی کا سفر",
    "💝 محبتوں کا پیام، خوشبو کا ہے اثر",
    "🎂 اے دلربا! تیری مسکراہٹ ہے تحفۂ رب",
    "⭐ تجھے مبارک ہو یہ دن، خوشیوں کا سبب"
  ];

  // Auto-scroll function
  const scrollToElement = (elementRef: React.RefObject<HTMLDivElement | null>, delay: number = 0) => {
    setTimeout(() => {
      elementRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, delay);
  };

  // Initialize audio on component mount
  useEffect(() => {
    const audioElement = new Audio('/sound-effect-happy-birthday-music-box-333245.mp3');
    audioElement.preload = 'auto';
    audioElement.volume = 0.8;
    audioRef.current = audioElement;

    // Add event listeners for debugging
    audioElement.addEventListener('canplaythrough', () => {
      console.log('Audio loaded and ready');
      setAudioReady(true);
    });

    audioElement.addEventListener('loadeddata', () => {
      console.log('Audio data loaded');
    });

    audioElement.addEventListener('error', (e) => {
      console.error('Audio loading error:', e);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle click anywhere on the page to enable audio (fallback)
  useEffect(() => {
    const handleClick = async () => {
      if (audioRef.current && !isPopped) {
        try {
          // Try to play a silent sound to unlock audio context
          audioRef.current.currentTime = 0;
          await audioRef.current.play();
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          console.log('Audio context unlocked');
        } catch (error) {
          console.log('Audio unlock failed:', error);
        }
      }
    };

    document.addEventListener('click', handleClick, { once: true });
    return () => document.removeEventListener('click', handleClick);
  }, [isPopped]);

  // Start celebration
  useEffect(() => {
    const startCelebration = async () => {
      setIsPopped(true);

      // Play audio
      if (audioRef.current) {
        try {
          audioRef.current.currentTime = 0;
          console.log('Playing birthday audio...');
          const playPromise = audioRef.current.play();
          await playPromise;
          console.log('Audio playing successfully!');
        } catch (error) {
          console.error('Audio playback failed:', error);
        }
      }

      // Auto-scroll to birthday message after balloon pops
      scrollToElement(birthdayMessageRef, 1000);

      // Show poem after popping
      setTimeout(() => {
        setShowPoem(true);
        // Auto-scroll to poem when it appears
        scrollToElement(poemRef, 500);
      }, 800);
    };

    const popTimer = setTimeout(() => {
      startCelebration();
    }, 1000);

    return () => clearTimeout(popTimer);
  }, []);

  // Auto-scroll to button when poem finishes
  useEffect(() => {
    if (showPoem) {
      const buttonScrollTimer = setTimeout(() => {
        scrollToElement(buttonRef, 0);
      }, (poemLines.length * 1200) + 2000); // After all poem lines + 2 seconds

      return () => clearTimeout(buttonScrollTimer);
    }
  }, [showPoem]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-start overflow-x-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 py-4 sm:py-8">
      {/* Animated Background Sparkles */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`sparkle-bg-${i}`}
            className="absolute h-2 w-2 rounded-full bg-white"
            initial={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              y: [-10, 10],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Main Balloon */}
      <motion.div
        className="relative mb-4 sm:mb-8 mt-8 sm:mt-16"
        variants={balloonVariants}
        initial="initial"
        animate={isPopped ? "pop" : "float"}
      >
        <motion.div
          className="h-32 w-24 sm:h-40 sm:w-32 rounded-full bg-gradient-to-br from-pink-400 to-red-600 shadow-lg"
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            className="absolute bottom-0 left-1/2 h-8 sm:h-12 w-1 origin-top -translate-x-1/2 bg-gradient-to-b from-gray-300 to-gray-400"
          />
        </motion.div>
      </motion.div>

      {/* Debug Audio Button - Remove this after testing */}
      {!isPopped && (
        <button
          onClick={async () => {
            if (audioRef.current) {
              try {
                audioRef.current.currentTime = 0;
                await audioRef.current.play();
                console.log('Manual audio test successful');
              } catch (error) {
                console.error('Manual audio test failed:', error);
              }
            }
          }}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test Audio 🔊
        </button>
      )}

      {/* Confetti */}
      <AnimatePresence>
        {isPopped && (
          <>
            {Array.from({ length: confettiConfig.count }).map((_, i) => {
              const color = confettiConfig.colors[Math.floor(Math.random() * confettiConfig.colors.length)];
              const shape = confettiConfig.shapes[Math.floor(Math.random() * confettiConfig.shapes.length)];
              const size = Math.random() * 8 + 4;

              // Define clipPath for different shapes
              let clipPath = "none";
              if (shape === "circle") {
                clipPath = "circle(50%)";
              } else if (shape === "triangle") {
                clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
              } else if (shape === "star") {
                clipPath = "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
              }

              return (
                <motion.div
                  key={`confetti-${i}`}
                  className="absolute z-10"
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: color,
                    borderRadius: shape === "circle" ? "50%" : "2px",
                    clipPath: clipPath,
                  }}
                  initial={{
                    scale: 0,
                    x: "50vw",
                    y: "50vh",
                    opacity: 1,
                  }}
                  animate={{
                    scale: [0, 1, 0.5],
                    x: [`${Math.random() * 100}vw`, `${Math.random() * 120 - 10}vw`],
                    y: [`50vh`, `${Math.random() * -120}vh`],
                    opacity: [1, 1, 0],
                    rotate: Math.random() * 720 - 360,
                  }}
                  transition={{
                    duration: Math.random() * 2 + 2,
                    ease: "easeOut",
                    delay: Math.random() * 0.5,
                  }}
                  exit={{ opacity: 0 }}
                />
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Birthday Message */}
      <AnimatePresence>
        {isPopped && (
          <motion.div ref={birthdayMessageRef}>
            <motion.h1
              className="relative z-20 bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-3xl sm:text-4xl md:text-6xl font-extrabold text-transparent drop-shadow-lg text-center px-4"
              initial={{ scale: 0, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            >
              Happy Birthday
              <br />
              <span className="bg-gradient-to-r mb-6 sm:mb-10 from-rose-300 via-pink-300 flex justify-center to-purple-300 bg-clip-text text-transparent">
                Afiya!
              </span>
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Poem */}
      <AnimatePresence>
        {showPoem && (
          <motion.div
            ref={poemRef}
            className="relative mb-6 sm:mb-8 z-20 mt-4 sm:mt-8 space-y-2 sm:space-y-3 text-center max-w-xs sm:max-w-2xl px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {poemLines.map((line, index) => (
              <motion.p
                key={`poem-${index}`}
                className="text-base sm:text-xl font-medium tracking-wide text-white/90 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 1.2,
                  duration: 0.8,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.05,
                  color: confettiConfig.colors[index % confettiConfig.colors.length],
                  transition: { duration: 0.2 }
                }}
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snake Game Button */}
      <AnimatePresence>
        {showPoem && (
          <motion.div ref={buttonRef} className="relative z-20 mb-8 px-4">
            <Link href="/snake-game" passHref>
              <motion.button
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer w-full sm:w-auto"
                initial={{ opacity: 0, scale: 0, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: (poemLines.length * 1.2) + 1, // Appears 1 second after last poem line
                  duration: 0.6,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 25px rgba(34, 197, 94, 0.6)",
                  rotate: [0, -2, 2, 0]
                }}
                whileTap={{ scale: 0.95 }}
              >
                Open Gift! 🎁
              </motion.button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BirthdayCelebration;