
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginViewProps {
  onSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [typingHeading, setTypingHeading] = useState('');

  const headingText = "Welcome, Shreya ❤️";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypingHeading(headingText.slice(0, i));
      i++;
      if (i > headingText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay
    await new Promise(r => setTimeout(r, 1500));

    if (email === "shreya@tushar.in" && password === "Shreya@2026") {
      setSuccessMsg("I was waiting for you...");
      setTimeout(onSuccess, 1000);
    } else {
      setError("Only someone special can enter ❤️");
      setIsLoading(false);
    }
  };

  const handleOtpChange = (val: string, index: number) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    if (val && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpLogin = async () => {
    setIsLoading(true);
    setError('');
    const fullOtp = otp.join('');

    await new Promise(r => setTimeout(r, 1500));

    if (fullOtp === "250126") {
      setSuccessMsg("You unlocked my heart 💖");
      setTimeout(onSuccess, 1000);
    } else {
      setError("Wrong code... try again ❤️");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 to-rose-100">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-pink-600 mb-2">
            {typingHeading}
          </h1>
          <p className="text-pink-400 font-light">This world is reserved only for you.</p>
        </div>

        <div className="relative perspective-1000">
          <motion.div
            animate={{ rotateY: mode === 'otp' ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
            className="w-full preserve-3d"
          >
            {/* Front: Email Login */}
            <div className={`glass p-8 rounded-[2.5rem] shadow-2xl backface-hidden ${mode === 'otp' ? 'pointer-events-none opacity-0' : ''}`}>
              <form onSubmit={handleEmailLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-pink-500 mb-2 ml-1">Your Special Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3 rounded-2xl bg-white/50 border border-pink-100 focus:border-pink-300 focus:ring-4 focus:ring-pink-200 outline-none transition-all placeholder:text-pink-200"
                    placeholder="shreya@..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-pink-500 mb-2 ml-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-3 rounded-2xl bg-white/50 border border-pink-100 focus:border-pink-300 focus:ring-4 focus:ring-pink-200 outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-500 text-sm text-center font-medium"
                    >
                      {error}
                    </motion.p>
                  )}
                  {successMsg && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-pink-600 text-lg text-center font-playfair italic"
                    >
                      {successMsg}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg hover:bg-pink-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
                >
                  {isLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : 'Unlock My Heart ❤️'}
                </button>
              </form>
              <button 
                onClick={() => setMode('otp')}
                className="w-full mt-6 text-pink-400 text-sm hover:text-pink-600 transition-colors"
              >
                Login with Magic Code ✨
              </button>
            </div>

            {/* Back: OTP Login */}
            <div 
              className={`absolute inset-0 glass p-8 rounded-[2.5rem] shadow-2xl backface-hidden flex flex-col justify-center ${mode === 'email' ? 'pointer-events-none opacity-0' : ''}`}
              style={{ transform: 'rotateY(180deg)' }}
            >
              <h3 className="text-xl font-playfair text-pink-600 text-center mb-6">Enter the Magic Code</h3>
              <div className="flex justify-between gap-2 mb-8">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && i > 0) {
                        document.getElementById(`otp-${i - 1}`)?.focus();
                      }
                    }}
                    className="w-12 h-14 text-center text-xl font-bold bg-white/50 border border-pink-100 rounded-xl focus:border-pink-300 focus:ring-4 focus:ring-pink-200 outline-none"
                  />
                ))}
              </div>
              
              <AnimatePresence>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                {successMsg && <p className="text-pink-600 text-lg text-center font-playfair italic mb-4">{successMsg}</p>}
              </AnimatePresence>

              <button
                onClick={handleOtpLogin}
                disabled={isLoading}
                className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-lg hover:bg-pink-600 transition-all active:scale-95 flex justify-center items-center"
              >
                {isLoading ? 'Verifying...' : 'Validate Code ✨'}
              </button>
              <button 
                onClick={() => setMode('email')}
                className="w-full mt-6 text-pink-400 text-sm hover:text-pink-600 transition-colors"
              >
                Back to Password Login
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};
