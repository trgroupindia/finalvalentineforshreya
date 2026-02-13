
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Modality } from '@google/genai';
import { VoiceCallMode } from './VoiceCallMode';

interface Message {
  role: 'user' | 'model';
  content: string;
  image?: string;
  timestamp: Date;
}

interface TusharAIChatProps {
  onToggleLetter?: () => void;
}

// Audio Utility Functions for Gemini TTS PCM Decoding
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

export const TusharAIChat: React.FC<TusharAIChatProps> = ({ onToggleLetter }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      content: "Hey Shreya ❤️\n\nMain hoon yahan, tumhare liye meri cutie pie. Kuch bhi baat karna ho, I'm all yours. How's your day going?", 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [showCallMode, setShowCallMode] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isVoiceGenerating, setIsVoiceGenerating] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const speakTextRealistic = async (text: string) => {
    if (!isVoiceEnabled) return;

    try {
      setIsVoiceGenerating(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say this naturally and lovingly as Tushar: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Kore' provides a warm, realistic male tone
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
        source.start();
      }
    } catch (error) {
      console.error("Realistic TTS Error:", error);
    } finally {
      setIsVoiceGenerating(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() && !attachedImage) return;

    const userMessage: Message = { 
      role: 'user', 
      content: input, 
      image: attachedImage || undefined,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachedImage(null);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const history = messages.slice(-10).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const model = 'gemini-3-flash-preview';
      const systemInstruction = `You are Tushar AI, a private, caring digital version of Tushar for Shreya.
        Tone: Soft, mature, slightly playful, deeply caring.
        Language: Hinglish (Hindi + English). Use 'tum' (respectful/loving) instead of 'tu'.
        Identity: Address her as 'Shreya ❤️' or 'cutie pie'.
        Constraint: Do NOT mention any other platforms like Snapchat, Instagram, WhatsApp, etc. Everything happens here.
        Constraint: Keep responses natural and conversational. Brief and meaningful.`;

      let parts: any[] = [{ text: input || "Check this out ❤️" }];
      if (attachedImage) {
        parts.unshift({
          inlineData: {
            mimeType: 'image/jpeg',
            data: attachedImage.split(',')[1]
          }
        });
      }

      const stream = await ai.models.generateContentStream({
        model,
        contents: [
          { role: 'user', parts: [{ text: `Instruction: ${systemInstruction}` }] },
          ...history,
          { role: 'user', parts }
        ]
      });

      let fullText = "";
      setMessages(prev => [...prev, { role: 'model', content: '', timestamp: new Date() }]);
      
      for await (const chunk of stream) {
        fullText += chunk.text;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, content: fullText }];
        });
      }

      setIsTyping(false);
      await speakTextRealistic(fullText);

    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: "Sorry Shreya ❤️, something went wrong. Par main tumhare liye hamesha yahin hoon.", 
        timestamp: new Date() 
      }]);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => setInput(event.results[0][0].transcript);
    recognition.start();
  };

  return (
    <div className="flex flex-col h-full bg-[#FFFBFB] relative overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between bg-white/60 backdrop-blur-md z-20 border-b border-pink-50/50">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FF4D6D] flex items-center justify-center text-white text-lg md:text-xl font-semibold shadow-sm">
            T
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[#333] text-base md:text-lg leading-tight">Tushar AI</h3>
              {isVoiceGenerating && <span className="text-[8px] bg-pink-100 text-pink-500 px-1.5 py-0.5 rounded-full animate-pulse uppercase">Vocalizing...</span>}
            </div>
            <span className="text-gray-400 text-[11px] md:text-sm">For Shreya ❤️</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-5">
          <button onClick={() => setIsVoiceEnabled(!isVoiceEnabled)} className="text-gray-500 hover:text-pink-500 transition-colors p-1">
            {isVoiceEnabled ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </button>
          <button onClick={() => setShowCallMode(true)} className="text-gray-500 hover:text-pink-500 transition-colors p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4 md:space-y-6 custom-scrollbar bg-white/10">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[90%] md:max-w-[85%] rounded-[1.8rem] md:rounded-[2rem] p-4 md:p-5 ${
              m.role === 'user' 
                ? 'bg-[#F3E8FF] text-[#4A1D96] rounded-br-none' 
                : 'bg-[#FFEBEE] text-[#333] rounded-bl-none border border-pink-50'
            } shadow-sm`}>
              {m.image && (
                <div className="mb-3 rounded-xl overflow-hidden max-w-sm">
                  <img src={m.image} alt="Upload" className="w-full h-auto object-cover" />
                </div>
              )}
              <p className="whitespace-pre-wrap leading-relaxed text-[15px] md:text-[16px]">{m.content}</p>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#FFEBEE] p-3 md:p-4 rounded-2xl flex gap-1">
              <span className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Footer */}
      <div className="p-3 md:p-6 pb-2 space-y-3 md:space-y-4 bg-white/80 backdrop-blur-md border-t border-pink-50/30">
        <div className="max-w-4xl mx-auto bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-lg shadow-pink-100/20 border border-pink-50 flex items-center px-3 md:px-4 py-1.5 md:py-2 gap-1 md:gap-2">
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-pink-500 transition-colors active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Kuch bhi bol do..."
            className="flex-1 bg-transparent border-none outline-none resize-none py-2.5 md:py-3 text-[14px] md:text-base text-gray-600 placeholder:text-gray-300 custom-scrollbar"
            rows={1}
          />
          
          <button 
            type="button" 
            onClick={startVoiceInput}
            className="p-2 text-gray-400 hover:text-pink-500 active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          
          <button 
            onClick={() => handleSendMessage()}
            disabled={(!input.trim() && !attachedImage) || isTyping}
            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#FFB5C5] text-white flex items-center justify-center shadow-md hover:bg-pink-400 transition-all active:scale-90 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>

        <div className="flex justify-center pb-2 md:pb-4">
          <button 
            onClick={onToggleLetter}
            className="flex items-center gap-2 text-gray-400 text-[13px] md:text-sm font-medium hover:text-pink-500 transition-colors p-2 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            Read Tushar's Letter 💌
          </button>
        </div>
      </div>

      <input type="file" ref={fileInputRef} onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => setAttachedImage(ev.target?.result as string);
          reader.readAsDataURL(file);
        }
      }} className="hidden" accept="image/*" />

      <AnimatePresence>
        {showCallMode && (
          <VoiceCallMode onClose={() => setShowCallMode(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};
