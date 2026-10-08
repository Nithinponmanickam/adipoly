import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface DiceProps {
  rolling: boolean;
  values: [number, number];
  onRollComplete?: () => void;
}

const Die: React.FC<{ value: number; rolling: boolean; delay: number }> = ({ value, rolling, delay }) => {
  const controls = useAnimation();
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (rolling) {
      controls.start({
        rotateX: [0, 360, 720, 1080],
        rotateY: [0, 360, 720, 1080],
        scale: [1, 1.2, 1],
        transition: { duration: 1, delay, ease: 'easeInOut' }
      });
      interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 100);
    } else {
      controls.stop();
      setDisplayValue(value);
      controls.start({ rotateX: 0, rotateY: 0, scale: 1 });
    }
    return () => clearInterval(interval);
  }, [rolling, value, controls, delay]);

  const renderDots = () => {
    const dots = [];
    // Just mapping the face logic
    if (displayValue === 1 || displayValue === 3 || displayValue === 5) {
      dots.push(<div key="center" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rounded-full" />);
    }
    if (displayValue !== 1) {
      dots.push(<div key="tl" className="absolute top-2 left-2 w-2 h-2 bg-slate-900 rounded-full" />);
      dots.push(<div key="br" className="absolute bottom-2 right-2 w-2 h-2 bg-slate-900 rounded-full" />);
    }
    if (displayValue >= 4) {
      dots.push(<div key="tr" className="absolute top-2 right-2 w-2 h-2 bg-slate-900 rounded-full" />);
      dots.push(<div key="bl" className="absolute bottom-2 left-2 w-2 h-2 bg-slate-900 rounded-full" />);
    }
    if (displayValue === 6) {
      dots.push(<div key="ml" className="absolute top-1/2 left-2 -translate-y-1/2 w-2 h-2 bg-slate-900 rounded-full" />);
      dots.push(<div key="mr" className="absolute top-1/2 right-2 -translate-y-1/2 w-2 h-2 bg-slate-900 rounded-full" />);
    }
    return dots;
  };

  return (
    <motion.div
      animate={controls}
      className="w-12 h-12 bg-white rounded-xl shadow-lg relative border-b-4 border-slate-300"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {renderDots()}
    </motion.div>
  );
};

export const Dice: React.FC<DiceProps> = ({ rolling, values, onRollComplete }) => {
  useEffect(() => {
    if (rolling && onRollComplete) {
      const timer = setTimeout(onRollComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [rolling, onRollComplete]);

  return (
    <div className="flex gap-4 p-6 bg-slate-800/80 rounded-2xl border border-slate-700/50 backdrop-blur-sm shadow-xl">
      <Die value={values[0]} rolling={rolling} delay={0} />
      <Die value={values[1]} rolling={rolling} delay={0.1} />
    </div>
  );
};
