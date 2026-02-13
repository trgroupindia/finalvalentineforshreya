
import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { LoveLetter } from './components/LoveLetter';
import { Timeline } from './components/Timeline';
import { Counter } from './components/Counter';
import { MusicSection } from './components/MusicSection';
import { Surprise } from './components/Surprise';
import { FloatingHearts } from './components/FloatingHearts';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { AnimatePresence, motion } from 'framer-motion';

export type AppView = 'landing' | 'login' | 'dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');

  return (
    <div className="relative min-h-screen text-gray-800 selection:bg-pink-200 overflow-x-hidden">
      <FloatingHearts speed={view === 'login' ? 2 : 1} />
      
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              filter: "blur(20px)",
              transition: { duration: 1.2 } 
            }}
          >
            <Hero onEnter={() => setView('login')} />
            <motion.main className="relative z-10">
              <LoveLetter />
              <MusicSection />
              <Timeline />
              <Counter />
              <Surprise />
              <footer className="py-12 text-center text-pink-600 bg-white/20 backdrop-blur-sm">
                <p className="font-playfair italic text-xl">"I love you more than words can say."</p>
                <p className="mt-4 text-sm opacity-70">Made with ❤️ by Tushar for Shreya</p>
              </footer>
            </motion.main>
          </motion.div>
        )}

        {view === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: "brightness(2) contrast(0.5)", transition: { duration: 0.8 } }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <LoginView onSuccess={() => setView('dashboard')} />
          </motion.div>
        )}

        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <DashboardView />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Cinematic Transition Overlay */}
      <AnimatePresence>
        {view === 'login' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-pink-500/10 pointer-events-none z-[40]"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
