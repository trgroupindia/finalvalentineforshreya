
import React from 'react';
import { motion } from 'framer-motion';

const milestones = [
  { title: "First Chat 💬", date: "The Day it Started", desc: "A simple hello that changed everything." },
  { title: "First Call 📞", date: "Hours turned to minutes", desc: "Hearing your voice for the first time felt like home." },
  { title: "Forever Promise ❤️", date: "Every Single Day", desc: "I choose you, today and every tomorrow." },
];

export const Timeline: React.FC = () => {
  return (
    <section className="py-24 px-4 max-w-4xl mx-auto">
      <h2 className="font-playfair text-4xl text-center text-pink-600 mb-20">Our Journey So Far</h2>
      
      <div className="relative">
        {/* Central Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-pink-200" />
        
        <div className="space-y-24">
          {milestones.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`relative flex items-center ${i % 2 === 0 ? 'justify-start' : 'justify-end'} w-full`}
            >
              {/* Heart Connector */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 bg-white rounded-full border-2 border-pink-400 flex items-center justify-center z-10 shadow-lg">
                <span className="text-pink-500 text-xs">❤️</span>
              </div>
              
              <div className={`w-[45%] glass p-6 rounded-2xl shadow-sm ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                <h3 className="font-semibold text-xl text-pink-600">{m.title}</h3>
                <span className="text-sm text-pink-300 italic block mb-2">{m.date}</span>
                <p className="text-gray-600 text-sm leading-relaxed">{m.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
