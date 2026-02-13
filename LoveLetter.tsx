
import React from 'react';
import { motion } from 'framer-motion';

export const LoveLetter: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 1.5,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="love-letter" className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="glass max-w-2xl w-full p-8 md:p-12 rounded-3xl relative"
      >
        <div className="absolute -top-6 -right-6 text-5xl rotate-12">🌹</div>
        <div className="absolute -bottom-6 -left-6 text-5xl -rotate-12">💌</div>
        
        <h2 className="font-playfair text-3xl md:text-4xl text-pink-600 mb-8 border-b border-pink-100 pb-4">
          Dearest Shreya,
        </h2>
        
        <div className="space-y-6 text-lg text-gray-700 font-light leading-relaxed">
          <motion.p variants={itemVariants}>
            From the moment we first spoke, I knew there was something magical about you. Your laugh is my favorite melody, and your smile is the sunshine that brightens my darkest days.
          </motion.p>
          
          <motion.p variants={itemVariants}>
            Every conversation we have, every message we exchange, adds another beautiful page to our story. I find myself constantly looking at my phone, hoping for a notification from you.
          </motion.p>
          
          <motion.p variants={itemVariants}>
            This small digital corner is a tribute to the happiness you've brought into my life. You are special in ways words can't quite capture, but I'll never stop trying.
          </motion.p>
          
          <motion.p variants={itemVariants} className="font-playfair text-xl text-pink-500 pt-6">
            With all my love,<br/>
            Tushar
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
};
