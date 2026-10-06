export const motionEase = [0.22, 1, 0.36, 1] as const;

export const motionDurations = {
  fast: 0.2,
  base: 0.45,
  slow: 0.7,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const reducedMotionTransition = {
  duration: 0.01,
};
