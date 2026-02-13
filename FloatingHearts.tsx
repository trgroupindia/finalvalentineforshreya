
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface FloatingHeartsProps {
  speed?: number;
}

const HeartIcon: React.FC<{ style: React.CSSProperties, speed: number }> = ({ style, speed }) => (
  <motion.div
    style={style}
    initial={{ y: "110vh", opacity: 0, scale: 0 }}
    animate={{ 
      y: "-10vh", 
      opacity: [0, 0.6, 0.6, 0],
      scale: [0.5, 1, 1, 0.5],
      rotate: [0, 45, -45, 0]
    }}
    transition={{
      duration: (Math.random() * 10 + 15) / speed,
      repeat: Infinity,
      ease: "linear",
      delay: Math.random() * 5
    }}
    className="absolute text-pink-300 pointer-events-none"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  </motion.div>
);

export const FloatingHearts: React.FC<FloatingHeartsProps> = ({ speed = 1 }) => {
  const hearts = useMemo(() => Array.from({ length: 25 }), []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((_, i) => (
        <HeartIcon 
          key={i} 
          speed={speed}
          style={{ 
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 20 + 10}px`
          }} 
        />
      ))}
    </div>
  );
};
