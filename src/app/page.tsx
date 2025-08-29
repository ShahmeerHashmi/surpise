"use client"; // if you're using App Router (`app/page.tsx`)
import React from "react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const buttonControls = useAnimation();
  const bearControls = useAnimation();

  const handleClick = async () => {
    await buttonControls.start({
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.5 },
    });

    await bearControls.start({
      y: [0, -20, 0],
      transition: { duration: 0.5 },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#F1FEFF] to-[#A7C6ED] text-gray-800 px-4">
      {/* Animated Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-5xl font-extrabold mb-5 text-center"
      >
        Welcome to the Birthday Celebration!
      </motion.h1>

      {/* Bear Image with Hover Animation */}
      <motion.div
        animate={bearControls}
        whileHover={{ scale: 1.05 }}
        className="mb-6"
      >
        <Image
          src="https://media.giphy.com/media/1msDUtCpBk1BihoOGD/giphy.gif"
          alt="Birthday gif"
          width={300}
          height={300}
          className="rounded-full shadow-lg"
        />
      </motion.div>

      {/* Button Link */}
      <Link href="/Birthday">
        <motion.button
          onClick={handleClick}
          animate={buttonControls}
          whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(255, 255, 255, 0.8)" }}
          whileTap={{ scale: 0.9 }}
          className="px-8 py-4 mt-5 text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          Click Me!
        </motion.button>
      </Link>
    </div>
  );
}
