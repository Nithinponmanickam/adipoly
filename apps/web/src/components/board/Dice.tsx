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
        scale: [1, 1.15, 1],
        transition: { duration: 0.8, delay, ease: 'easeInOut' }
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
    const dotClass = "bg-black rounded-full w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5";

    if (displayValue === 1 || displayValue === 3 || displayValue === 5) {
      dots.push(<div key="center" className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${dotClass}`} />);
    }
    if (displayValue !== 1) {
      dots.push(<div key="tl" className={`absolute top-1 left-1 sm:top-1.5 sm:left-1.5 ${dotClass}`} />);
      dots.push(<div key="br" className={`absolute bottom-1 right-1 sm:bottom-1.5 sm:right-1.5 ${dotClass}`} />);
    }
    if (displayValue >= 4) {
      dots.push(<div key="tr" className={`absolute top-1 right-1 sm:top-1.5 sm:right-1.5 ${dotClass}`} />);
      dots.push(<div key="bl" className={`absolute bottom-1 left-1 sm:bottom-1.5 sm:left-1.5 ${dotClass}`} />);
    }
    if (displayValue === 6) {
      dots.push(<div key="ml" className={`absolute top-1/2 left-1 sm:left-1.5 -translate-y-1/2 ${dotClass}`} />);
      dots.push(<div key="mr" className={`absolute top-1/2 right-1 sm:right-1.5 -translate-y-1/2 ${dotClass}`} />);
    }
    return dots;
  };

  return (
    <motion.div
      animate={controls}
      className="w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 bg-white border-2 sm:border-3 border-border shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] relative shrink-0"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {renderDots()}
    </motion.div>
  );
};

export const Dice: React.FC<DiceProps> = ({ rolling, values, onRollComplete }) => {
  useEffect(() => {
    if (rolling && onRollComplete) {
      const timer = setTimeout(onRollComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [rolling, onRollComplete]);

  return (
    <div className="flex gap-2 sm:gap-3 p-1.5 sm:p-2.5 bg-accent border-2 sm:border-4 border-border shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] transform rotate-1">
      <Die value={values[0]} rolling={rolling} delay={0} />
      <Die value={values[1]} rolling={rolling} delay={0.08} />
    </div>
  );
};
