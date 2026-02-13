
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimatedValue = ({ value, isString = false }: { value: any, isString?: boolean }) => {
  const [displayValue, setDisplayValue] = useState<any>(isString ? "" : 0);

  useEffect(() => {
    if (isString) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayValue(value.slice(0, i));
        i++;
        if (i > value.length) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    } else {
      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [value, isString]);

  return <span>{displayValue}</span>;
};

export const Counter: React.FC = () => {
  // Calculate dynamic days based on start date: January 25, 2026
  const startDate = new Date('2026-01-25');
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const daysCount = Math.max(20, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  const stats = [
    { label: "Days Together", value: daysCount, isString: false, suffix: "+" },
    { label: "Hours Talked", value: "Infinity", isString: true, suffix: "" },
    { label: "Messages Shared", value: "Uncountable", isString: true, suffix: "" },
  ];

  return (
    <section className="py-24 bg-pink-50/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="text-center space-y-2 p-8 glass rounded-3xl border border-white/40 shadow-xl shadow-pink-100/10"
            >
              <h3 className={`font-bold text-pink-500 ${stat.isString ? 'text-3xl md:text-4xl' : 'text-5xl md:text-6xl'}`}>
                <AnimatedValue value={stat.value} isString={stat.isString} />{stat.suffix}
              </h3>
              <p className="text-pink-300 font-medium uppercase tracking-[0.2em] text-[10px] md:text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
