
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LetterSection } from './LetterSection';
import { TusharAIChat } from './TusharAIChat';

export const DashboardView: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [showEntry, setShowEntry] = useState(true);
  const [isLetterOpen, setIsLetterOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEntry(false);
      setIsReady(true);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFBFB] flex flex-col relative overflow-hidden selection:bg-pink-100">
      {/* Cinematic Entry Fade */}
      <AnimatePresence>
        {showEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center"
            >
              <h1 className="font-playfair text-4xl md:text-7xl text-pink-500 mb-4">
                Hi Shreya ❤️
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-pink-300 tracking-[0.2em] uppercase text-[10px] md:text-xs"
              >
                Welcome to our little world
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="flex h-screen w-full relative z-10"
      >
        {/* Main Dashboard Layout */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Main Content Area */}
          <div className="flex-1 flex relative h-full">
            {/* Desktop Left: Letter Section (Always visible on big screens) */}
            <div className="hidden lg:block w-[400px] border-r border-pink-100/30 bg-[#FFFBFB] shadow-inner overflow-hidden">
              <LetterSection />
            </div>

            {/* AI Chat Panel - Occupies full space on mobile, remainder on desktop */}
            <div className="flex-1 flex flex-col h-full bg-transparent overflow-hidden">
              <TusharAIChat onToggleLetter={() => setIsLetterOpen(true)} />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Mobile / Tablet Overlay for Letter */}
      <AnimatePresence>
        {isLetterOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="fixed inset-0 z-[150] bg-white lg:hidden overflow-hidden flex flex-col"
          >
            <div className="p-4 bg-white/80 backdrop-blur-md flex justify-between items-center border-b border-pink-50 shrink-0">
              <h3 className="font-playfair text-pink-600 font-bold text-lg">Tushar's Letter</h3>
              <button 
                onClick={() => setIsLetterOpen(false)} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-50 text-pink-400 active:scale-90 transition-transform"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <LetterSection isMobile />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mood Glow Effects */}
      <div 
        id="mood-glow" 
        className="fixed inset-0 pointer-events-none transition-all duration-2000 z-0 opacity-40 mix-blend-soft-light"
      />
    </div>
  );
};
