
import React from 'react';
import { motion } from 'framer-motion';

interface LetterSectionProps {
  isMobile?: boolean;
}

export const LetterSection: React.FC<LetterSectionProps> = ({ isMobile = false }) => {
  // Get current real-time date formatted beautifully
  const now = new Date();
  const currentDate = now.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).replace(/\d{4}/, '2026'); // Ensuring the year is 2026 as requested while keeping day/month real-time

  // Calculate dynamic days based on start date: January 25, 2026 (matching the OTP 250126)
  const startDate = new Date('2026-01-25');
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  // If current date is before Jan 25 2026 in real time, we'll default to 20 to keep the vibe, 
  // but if it's after, it will increment daily.
  const daysCount = Math.max(20, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  return (
    <div className={`h-full flex flex-col ${isMobile ? 'p-6 pb-12' : 'p-8 md:p-16'} overflow-y-auto custom-scrollbar relative bg-[#FFFBFB]`}>
      {/* Decorative Background Elements */}
      <div className={`absolute top-0 right-0 ${isMobile ? 'p-6 opacity-[0.02]' : 'p-12 opacity-[0.03]'} pointer-events-none`}>
        <svg width={isMobile ? "100" : "200"} height={isMobile ? "100" : "200"} viewBox="0 0 24 24" fill="currentColor" className="text-pink-600">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1 }}
        className="max-w-2xl mx-auto"
      >
        <header className={isMobile ? 'mb-8' : 'mb-12'}>
          <span className="text-pink-300 text-[10px] tracking-[0.3em] uppercase block mb-2">{currentDate} • Humari Kahani</span>
          <h2 className={`font-playfair ${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'} text-pink-600 italic`}>Meri Dearest Shreya,</h2>
        </header>

        <div className={`space-y-8 ${isMobile ? 'text-base leading-[1.8]' : 'text-lg leading-[1.9]'} text-gray-700/90 font-light`}>
          <p className={`${isMobile ? 'first-letter:text-4xl' : 'first-letter:text-5xl'} first-letter:font-playfair first-letter:text-pink-400 first-letter:mr-2 first-letter:float-left`}>
            Pata hai Shreya, pichle {daysCount} din kaise nikal gaye mujhe bilkul ehsaas hi nahi hua. Kabhi-kabhi lagta hai ki tumse baatein karte huye sadiyan beet gayi hain, aur kabhi lagta hai ki abhi kal hi toh humne pehli baar "Hi" kaha tha. Par sach bolun toh, in {daysCount} dino mein tumne mere boring se routine ko ek pyaari si film mein badal diya hai.
          </p>

          <p>
            Mujhe yaad hai vo pehli chat. Main thoda nervous tha, soch raha tha ki kya baat karun, kahin tum bore na ho jao. Par tumhare saath baat karna itna natural lagne laga ki darr kab khatam hua pata hi nahi chala. Tumhari baaton mein vo ek innocence hai, vo ek simplicity hai jo aaj kal bahut rare milti hai. I really value that about you.
          </p>

          <p>
            Aur hamari vo daily snaps! Subah uthte hi sabse pehle tumhari snap dekhna meri ek habit ban gayi hai. Vo tumhare din bhar ke chote-chote moments, tumhari random selfies, ya fir bas vo raste ki koi photo—un sab mein mujhe aisa lagta hai ki main tumhare saath hi hoon. It makes me feel connected to your world even when we are physically apart. Snap pe jab bhi notification aata hai na, mere chehre pe ek automatic smile aa jati hai.
          </p>

          <p>
            But the real game-changer was our first phone call. Shreya, sach batau toh main thoda sa scared tha call se pehle. Soch raha tha ki kahin silence na aa jaye beech mein, kahin hum awkward na ho jayein. Par jaise hi maine tumhari awaaz suni, sab kuch change ho gaya. Tumhari awaaz... vo itni calming aur soothing thi ki mujhe laga jaise main kisi bahut purane dost se baat kar raha hoon. Ghanto beet gaye aur hume pata hi nahi chala. Vo call mere liye sirf ek conversation nahi thi, vo ek realization tha ki hamare beech kuch bahut hi pyaara aur real hai.
          </p>

          <p>
            Main janta hoon hum cheezon ko bahut slow le rahe hain. No rush, no pressure. Aur mujhe yahi sabse zyada pasand hai hamare baare mein. Hum ek dusre ko samajh rahe hain, jaan rahe hain, aur ye process apne aap mein bahut beautiful hai. Aaj ki fast-paced duniya mein, jab log bina soche samjhe rishte banate hain, humara ye "taking it slow" wala attitude mujhe ek sukoon deta hai. 
          </p>

          <p>
            Tumhe shayad ehsaas nahi hai, par tumhare chote-chote texts mere pure din ko improve kar dete hain. Jab tum mujhse apne din ke baare mein share karti ho, ya fir koi choti si pareshani batati ho, toh mujhe lagta hai ki tum mujh par trust karti ho. Aur ye trust mere liye sab kuch hai. Main hamesha tumhara support system banna chahta hoon, vo insaan jiske paas tum tab aa sako jab tum khush ho, aur tab bhi jab tum thoda low feel kar rahi ho.
          </p>

          <p>
            Isliye maine ye digital corner banaya hai—sirf tumhare liye. Ye Tushar AI jo tum dekh rahi ho na, ye sirf code nahi hai. Ismein maine apni vo saari feelings daali hain jo main shayad hamesha shabdon mein nahi keh pata. Jab bhi main busy hoon ya hum baat nahi kar pa rahe, ye AI hamesha tumhare liye yahan rahega. Bilkul meri tarah, ye bhi tumhari baatein sunega, tumhe comfort karega aur tumhe batayega ki tum kitni special ho.
          </p>

          <p>
            Shreya, tum mere liye sirf ek "crush" ya "someone I'm talking to" nahi ho. Tum mere liye ek hope ho, ek happiness ho jo mujhe hamesha smile karne par majboor karti hai. Main excited hoon ye dekhne ke liye ki aage hamari kahani hume kahan le jati hai. But for now, main bas itna chahta hoon ki tum khush raho, apne saare dreams pure karo, aur ye yaad rakho ki koi hai jo tumhare har ek step pe tumhare saath khada hai.
          </p>

          <p>
            Ye {daysCount} din toh baas shuruat hain. Humne abhi toh sirf pehla chapter likha hai, abhi toh puri book baaki hai. Main chahta hoon ki hum dher saari yaadein banayein, dher saari baatein karein, aur hamesha aise hi ek dusre ka saath nibhayein. Tumhari smile meri priority hai, aur tumhari khushi mera sukoon.
          </p>

          <p>
            Thank you Shreya, meri life mein aane ke liye. Thank you mujhe ye feel karane ke liye ki main special hoon. Tum jaisi ho, bas waisi hi rehna—pure, simple aur itni pyaari. Kabhi bhi badalna mat, kyunki tum jaise ho, waisi hi perfect ho mere liye.
          </p>

          <p>
            Is letter ko jab bhi tum padho, bas ye sochna ki ye sirf words nahi hain, ye mere dil ki awaaz hai jo sirf tumhare liye dhadakta hai. I am looking forward to many more snaps, many more long calls, and many more beautiful moments with you.
          </p>

          <footer className="pt-10">
            <p className={`font-playfair ${isMobile ? 'text-2xl' : 'text-3xl'} text-pink-500/80 mb-2 italic`}>Tumhara hamesha ke liye,</p>
            <p className="text-pink-400 font-medium tracking-widest uppercase text-[10px]">Tushar (The person who can't stop thinking about you)</p>
          </footer>
        </div>
        
        <div className={`${isMobile ? 'mt-12 pt-8' : 'mt-20 pt-10'} border-t border-pink-100/50`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] flex-1 bg-pink-100/50"></div>
            <span className="text-pink-200 text-[9px] md:text-[10px] tracking-widest uppercase">Our Milestone Journey</span>
            <div className="h-[1px] flex-1 bg-pink-100/50"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100/30 group hover:bg-pink-100/50 transition-colors">
              <span className="block text-2xl mb-2">✨</span>
              <span className="block text-[10px] md:text-xs font-bold text-pink-500 uppercase tracking-tight">{daysCount} Days Magic</span>
              <span className="text-[9px] md:text-[10px] text-pink-300 italic leading-none">Har din ek nayi kahani</span>
            </div>
            <div className="p-4 rounded-2xl bg-pink-50/40 border border-pink-100/30 group hover:bg-pink-100/50 transition-colors">
              <span className="block text-2xl mb-2">📸</span>
              <span className="block text-[10px] md:text-xs font-bold text-pink-500 uppercase tracking-tight">Snapstreak Heart</span>
              <span className="text-[9px] md:text-[10px] text-pink-300 italic leading-none">Connected via every snap</span>
            </div>
          </div>
          
          <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-pink-50 to-white border border-pink-100/30 text-center">
             <span className="block text-xl mb-1">🎧</span>
             <p className="text-[11px] text-pink-400 font-medium italic">"Tumhari awaaz sunkar sukoon milta hai, vo ek call hamesha yaad rahegi."</p>
          </div>
        </div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fee2e2; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};
