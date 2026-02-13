
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  onEnter?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onEnter }) => {
  const text = "For Someone Very Special... Shreya ❤️";
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    if (onEnter) {
      onEnter();
    } else {
      document.getElementById('love-letter')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex flex-col items-center justify-center z-20 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl"
      >
        <h1 className="font-playfair text-5xl md:text-8xl font-bold text-pink-600 drop-shadow-lg leading-tight">
          {displayText}<span className="animate-pulse">|</span>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-6 text-xl md:text-2xl text-pink-400 font-light"
        >
          A small digital world made just for you.
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3, duration: 0.5 }}
          whileHover={{ scale: 1.1, boxShadow: "0 0 25px rgba(255, 77, 109, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEnter}
          className="mt-12 px-10 py-4 bg-pink-500 text-white rounded-full text-lg font-semibold shadow-xl transition-all hover:bg-pink-600 flex items-center gap-2 mx-auto"
        >
          Enter My World
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </motion.button>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-pink-300 animate-bounce cursor-pointer"
        onClick={() => document.getElementById('love-letter')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
};
