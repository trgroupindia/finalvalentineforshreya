
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const MusicSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-24 px-4 flex flex-col items-center justify-center bg-transparent overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl w-full text-center space-y-12"
      >
        <div className="relative inline-block">
          {/* Vinyl Record */}
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 3, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
            className="w-48 h-48 md:w-64 md:h-64 bg-zinc-900 rounded-full border-[10px] border-zinc-800 shadow-2xl relative flex items-center justify-center overflow-hidden"
          >
            <div className="w-full h-full absolute flex items-center justify-center">
               <div className="w-full h-[1px] bg-zinc-700 absolute rotate-0 opacity-20"></div>
               <div className="w-full h-[1px] bg-zinc-700 absolute rotate-45 opacity-20"></div>
               <div className="w-full h-[1px] bg-zinc-700 absolute rotate-90 opacity-20"></div>
               <div className="w-full h-[1px] bg-zinc-700 absolute rotate-135 opacity-20"></div>
            </div>
            <div className="w-16 h-16 md:w-20 md:h-20 bg-pink-400 rounded-full border-4 border-zinc-900 z-10 flex items-center justify-center">
              <div className="w-3 h-3 bg-zinc-900 rounded-full"></div>
            </div>
          </motion.div>
          
          {/* Tone Arm */}
          <motion.div 
            animate={{ rotate: isPlaying ? 30 : 0 }}
            className="absolute -right-4 top-0 w-32 h-4 bg-zinc-400 origin-left rounded-full shadow-md pointer-events-none"
            style={{ transformOrigin: '0% 50%' }}
          />
        </div>

        <div className="space-y-4">
          <h2 className="font-playfair text-3xl text-pink-600">This song reminds me of you...</h2>
          <p className="text-gray-500 font-light italic">"Can't Help Falling in Love"</p>
          
          {/* Equalizer Bars */}
          <div className="flex justify-center items-end h-8 gap-1">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: isPlaying ? [8, 32, 12, 24, 10] : 8 }}
                transition={{ duration: 0.5 + Math.random(), repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 bg-pink-400 rounded-full"
              />
            ))}
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="mt-6 px-8 py-3 glass rounded-full text-pink-600 font-semibold hover:bg-white/40 transition-all active:scale-95"
          >
            {isPlaying ? 'Pause Melody' : 'Play Melody'}
          </button>
          
          <p className="text-xs text-pink-300 pt-4">Imagine your favorite soft acoustic track playing...</p>
        </div>
      </motion.div>
    </section>
  );
};
