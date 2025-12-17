import { useState, useEffect } from 'react';

export const useSlideAnimation = (direction = 'left') => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const triggerAnimation = () => {
    setIsAnimating(true);
  };

  return {
    isAnimating,
    triggerAnimation,
    animationClass: isAnimating ? `slide-${direction}` : ''
  };
};

export const useBounceAnimation = () => {
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    if (isBouncing) {
      const timer = setTimeout(() => setIsBouncing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isBouncing]);

  const triggerBounce = () => {
    setIsBouncing(true);
  };

  return {
    isBouncing,
    triggerBounce,
    bounceClass: isBouncing ? 'bounce' : ''
  };
};

export const usePulseAnimation = () => {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (isPulsing) {
      const timer = setTimeout(() => setIsPulsing(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isPulsing]);

  const triggerPulse = () => {
    setIsPulsing(true);
  };

  return {
    isPulsing,
    triggerPulse,
    pulseClass: isPulsing ? 'pulse' : ''
  };
};