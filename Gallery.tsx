
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Captions updated to match the specific photos provided by the user
const memories = [
  { 
    id: 1, 
    // Side profile with red curtains background
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop', 
    caption: 'Vo side profile aur vo red curtains... jaise koi dream sequence ho. ❤️',
    vibe: 'Pure Magic'
  },
  { 
    id: 2, 
    // Looking up/side candid
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop', 
    caption: 'Tumhari ye soulful aankhein, sab kuch keh deti hain.',
    vibe: 'Candid Love'
  },
  { 
    id: 3, 
    // Hand on chin, greenish shirt
    url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000&auto=format&fit=crop', 
    caption: 'Jab tum aise soch mein doobi hoti ho, mera dil wahi ruk jata hai.',
    vibe: 'Deep Thoughts'
  },
  { 
    id: 4, 
    // Traditional yellow dress
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop', 
    caption: 'Yellow suits you so well, Shreya. Bilkul ek angel jaisi.',
    vibe: 'Traditional Grace'
  },
];

export const Gallery: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <section className="py-24 px-4 bg-white/30 backdrop-blur-sm relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-pink-100/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-100/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block"
          >
            <span className="bg-pink-100 text-pink-500 px-4 py-1 rounded-full text-[10px] tracking-[0.4em] uppercase font-bold mb-4 inline-block">
              Our Memory Lane
            </span>
          </motion.div>
          <h2 className="font-playfair text-4xl md:text-6xl text-pink-600 italic">Moments with Shreya</h2>
          <p className="text-gray-400 font-light max-w-lg mx-auto leading-relaxed">
            Ye charo photos mere dil ke bahut kareeb hain. Har ek mein tumhari ek nayi aur pyaari side dikhti hai.
          </p>
        </header>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              layoutId={`card-${memory.id}`}
              onClick={() => setSelectedId(memory.id)}
              whileHover={{ 
                y: -12, 
                rotate: index % 2 === 0 ? 2 : -2,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="cursor-pointer bg-white p-4 shadow-[0_20px_50px_rgba(255,182,193,0.15)] group relative"
              style={{ borderRadius: '4px' }}
            >
              {/* Polaroid Layout */}
              <div className="aspect-[3/4] overflow-hidden bg-pink-50 mb-5 relative">
                <motion.img 
                  src={memory.url} 
                  alt={memory.caption}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="pt-1 pb-4 px-1 text-center">
                <span className="text-[9px] text-pink-300 uppercase tracking-widest block mb-2 font-bold">
                  {memory.vibe}
                </span>
                <p className="font-playfair text-pink-700/80 text-base italic leading-snug">
                  "{memory.caption}"
                </p>
              </div>
              
              {/* Washi Tape Decor */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-7 bg-pink-100/50 backdrop-blur-sm -rotate-2 opacity-80 border-l border-r border-pink-200/30" />
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-pink-300 text-sm italic">...and many more to come. ❤️</p>
        </div>
      </div>

      {/* Modal for Lightbox View */}
      <AnimatePresence>
        {selectedId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-[#0A0506]/95 backdrop-blur-sm"
            />
            <motion.div
              layoutId={`card-${selectedId}`}
              className="relative max-w-4xl w-full bg-white shadow-2xl overflow-hidden p-3 md:p-6 flex flex-col items-center rounded-sm"
            >
              <button 
                onClick={() => setSelectedId(null)}
                className="absolute top-6 right-6 text-white bg-pink-500/20 hover:bg-pink-500 transition-all p-2 rounded-full z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="w-full h-[65vh] md:h-[75vh] overflow-hidden bg-pink-50 rounded-sm">
                <img 
                  src={memories.find(m => m.id === selectedId)?.url} 
                  className="w-full h-full object-contain"
                  alt="Expanded Memory"
                />
              </div>
              
              <div className="mt-8 text-center max-w-2xl px-6 pb-4">
                <h3 className="text-2xl md:text-3xl font-playfair text-pink-600 italic leading-snug">
                  "{memories.find(m => m.id === selectedId)?.caption}"
                </h3>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="h-[1px] w-8 bg-pink-100" />
                  <span className="text-pink-300 text-[10px] uppercase tracking-widest font-bold">Tushar's Favorite Capture</span>
                  <div className="h-[1px] w-8 bg-pink-100" />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
