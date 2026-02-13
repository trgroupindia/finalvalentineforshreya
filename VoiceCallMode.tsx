
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Modality } from '@google/genai';

interface VoiceCallModeProps {
  onClose: () => void;
}

// Audio Utility Functions
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const Waveform = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ height: 4 }}
          animate={{ 
            height: isActive ? [4, Math.random() * 40 + 10, 4] : 4,
            backgroundColor: isActive ? '#fb7185' : '#fda4af'
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 0.5 + Math.random() * 0.5,
            ease: "easeInOut"
          }}
          className="w-1 rounded-full bg-pink-300"
        />
      ))}
    </div>
  );
};

export const VoiceCallMode: React.FC<VoiceCallModeProps> = ({ onClose }) => {
  const [status, setStatus] = useState<'listening' | 'speaking' | 'thinking'>('listening');
  const [transcript, setTranscript] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const recognitionRef = useRef<any>(null);
  const statusRef = useRef(status);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    startListening();
    return () => {
      stopListening();
    };
  }, []);

  const speakTextRealistic = async (text: string) => {
    if (isMuted) {
      setStatus('listening');
      startListening();
      return;
    }
    
    setStatus('speaking');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say this naturally and lovingly as Tushar on a phone call: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        
        const ctx = audioContextRef.current;
        const audioBytes = decodeBase64(base64Audio);
        const audioBuffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        
        source.onended = () => {
          setStatus('listening');
          startListening();
        };

        source.start();
      } else {
          setStatus('listening');
          startListening();
      }
    } catch (error) {
      console.error("Call TTS Error:", error);
      setStatus('listening');
      startListening();
    }
  };

  const getAIResponse = async (query: string) => {
    if (!query.trim()) {
      setStatus('listening');
      startListening();
      return;
    }
    
    setStatus('thinking');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-3-flash-preview';
      const prompt = `You are on a premium, private voice call with Shreya ❤️. 
        Identity: You are Tushar.
        Tone: Deeply loving, calm, romantic, and attentive.
        Language: Hinglish. Use "tum" and "tumhari".
        Constraint: Respond in exactly 1-2 very short, sweet sentences. 
        Context: Be extremely realistic and natural. No platforms like Instagram/Snapchat.
        User said: "${query}". Respond as her Tushar.`;
      
      const response = await ai.models.generateContent({
        model,
        contents: prompt
      });
      
      const text = response.text || "Main sun raha hoon, Shreya ❤️";
      await speakTextRealistic(text);
    } catch (err) {
      console.error(err);
      await speakTextRealistic("Awaaz thodi kat rahi hai Shreya, par main yahin hoon tumhare paas.");
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognitionRef.current = recognition;
    
    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      stopListening();
      getAIResponse(result);
    };

    recognition.onend = () => {
      if (statusRef.current === 'listening' && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {}
      }
    };

    try {
      recognition.start();
    } catch (e) {}
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#0A0506] flex flex-col items-center justify-between p-8 md:p-12 overflow-hidden"
    >
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,77,109,0.15)_0%,transparent_70%)]" />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-900/20 blur-[120px] rounded-full"
        />
      </div>

      {/* Top Header */}
      <div className="relative z-10 w-full flex justify-between items-center max-w-4xl mx-auto">
        <div className="flex flex-col">
          <span className="text-pink-500/60 text-[10px] tracking-[0.4em] uppercase font-bold mb-1">Encrypted Line</span>
          <h2 className="font-playfair text-white text-2xl tracking-wide">Tushar <span className="text-pink-500">AI</span></h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-white/40 text-[11px] uppercase tracking-widest font-medium">Ultra-HD Voice</span>
        </div>
      </div>

      {/* Center Visual */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        <div className="relative mb-12">
          <motion.div
            animate={{ 
              scale: status === 'speaking' ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-48 h-48 md:w-64 md:h-64 rounded-full relative flex items-center justify-center"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-pink-400 to-rose-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,77,109,0.3)] border border-white/20">
              <span className="text-5xl md:text-6xl">🤵</span>
            </div>
          </motion.div>
        </div>

        {/* Status */}
        <div className="text-center space-y-6 w-full">
          <div>
            <motion.p 
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-pink-400 font-medium tracking-[0.2em] uppercase text-[12px]"
            >
              {status === 'listening' ? 'Listening...' : status === 'speaking' ? 'Speaking...' : 'Thinking...'}
            </motion.p>
            <div className="mt-4">
               <Waveform isActive={status === 'speaking' || status === 'listening'} />
            </div>
          </div>

          <div className="min-h-[100px] flex items-center justify-center px-6">
            <p className="text-white/60 font-light italic text-lg leading-relaxed max-w-sm">
              {transcript ? `"${transcript}"` : "Tumhari awaaz sunne ke liye betaab hoon..."}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 w-full max-w-sm flex justify-around items-center mb-4">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-white/10 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          )}
        </button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-20 h-20 bg-rose-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(225,29,72,0.4)] transition-all hover:bg-rose-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      </div>

      <div className="relative z-10 text-white/20 text-[9px] tracking-[0.5em] uppercase pb-2">
        Protected by Heart Protocol v4.0
      </div>
    </motion.div>
  );
};
