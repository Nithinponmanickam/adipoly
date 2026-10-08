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
    const dotClass = "bg-black rounded-full w-2 h-2 md:w-3 md:h-3";
    
    // Just mapping the face logic
    if (displayValue === 1 || displayValue === 3 || displayValue === 5) {
      dots.push(<div key="center" className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${dotClass}`} />);
    }
    if (displayValue !== 1) {
      dots.push(<div key="tl" className={`absolute top-2 left-2 md:top-3 md:left-3 ${dotClass}`} />);
      dots.push(<div key="br" className={`absolute bottom-2 right-2 md:bottom-3 md:right-3 ${dotClass}`} />);
    }
    if (displayValue >= 4) {
      dots.push(<div key="tr" className={`absolute top-2 right-2 md:top-3 md:right-3 ${dotClass}`} />);
      dots.push(<div key="bl" className={`absolute bottom-2 left-2 md:bottom-3 md:left-3 ${dotClass}`} />);
    }
    if (displayValue === 6) {
      dots.push(<div key="ml" className={`absolute top-1/2 left-2 md:left-3 -translate-y-1/2 ${dotClass}`} />);
      dots.push(<div key="mr" className={`absolute top-1/2 right-2 md:right-3 -translate-y-1/2 ${dotClass}`} />);
    }
    return dots;
  };

  return (
    <motion.div
      animate={controls}
      className="w-12 h-12 md:w-16 md:h-16 bg-white border-4 border-border shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] relative"
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
    <div className="flex gap-4 md:gap-6 p-4 md:p-6 bg-accent border-4 border-border shadow-[8px_8px_0px_0px_rgba(17,24,39,1)] transform rotate-2">
      <Die value={values[0]} rolling={rolling} delay={0} />
      <Die value={values[1]} rolling={rolling} delay={0.1} />
    </div>
  );
};
