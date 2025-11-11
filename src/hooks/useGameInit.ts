import { useState, useCallback, useMemo } from 'react';
import { levels, LevelConfig } from '../contants/levels';
import { calculateFeedback } from '../utils/calculateFeedback';

type AttemptRecord = {
  attempt: Array<string>;
  feedback: { correctPositions: number; correctColors: number };
};

export function useGameInit() {
  const [level, setLevel] = useState<number>(1);
  const currentLevel: LevelConfig = levels[level];
  const [currentAttempt, setCurrentAttempt] = useState<Array<string | null>>(
    Array(currentLevel.length).fill(null)
  );
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number>(0);
  const [attempts, setAttempts] = useState<AttemptRecord[]>([]);
  const [success, setSuccess] = useState(false);
  const [over, setOver] = useState(false);

  const resetForLevel = useCallback(
    (lvl = level) => {
      const lv = levels[lvl];
      setCurrentAttempt(Array(lv.length).fill(null));
      setCurrentSlotIndex(0);
      setAttempts([]);
      setSuccess(false);
      setOver(false);
    },
    [
      setCurrentAttempt,
      setCurrentSlotIndex,
      setAttempts,
      setSuccess,
      setOver,
      level,
    ]
  );

  const setLevelAndReset = (n: number) => {
    setLevel(n);
    resetForLevel(n);
  };

  const state = useMemo(
    () => ({
      level,
      currentAttempt,
      currentSlotIndex,
      attempts,
      maxAttempts: currentLevel.maxAttempts,
      success,
      over,
    }),
    [
      level,
      currentAttempt,
      currentSlotIndex,
      attempts,
      currentLevel.maxAttempts,
      success,
      over,
    ]
  );

  const submitAttempt = useCallback(
    (attemptArr: Array<string | null>) => {
      const attempt = attemptArr.map(c => (c ? c : ''));
      const feedback = calculateFeedback(attemptArr, currentLevel.password);
      setAttempts(prev => [
        ...prev,
        { attempt: attempt as string[], feedback },
      ]);

      if (feedback.correctPositions === currentLevel.length) {
        setSuccess(true);
      } else if (attempts.length + 1 >= currentLevel.maxAttempts) {
        setOver(true);
      } else {
        setCurrentAttempt(Array(currentLevel.length).fill(null));
        setCurrentSlotIndex(0);
      }
    },
    [currentLevel, attempts.length]
  );

  const pickColor = useCallback(
    (key: keyof typeof currentLevel.colorMap, hex: string) => {
      if (success || over) return;
      // 不允许重复颜色
      if (currentAttempt.includes(key as string)) return;

      const slot = currentSlotIndex;
      if (slot >= currentAttempt.length) return;

      const next = [...currentAttempt];
      next[slot] = key as string;
      setCurrentAttempt(next);
      // advance slot
      if (slot + 1 >= currentLevel.length) {
        // 提交
        submitAttempt(next);
        setCurrentSlotIndex(0);
      } else {
        setCurrentSlotIndex(slot + 1);
      }
    },
    [
      currentAttempt,
      currentSlotIndex,
      currentLevel.length,
      submitAttempt,
      success,
      over,
    ]
  );

  const reset = useCallback(() => {
    resetForLevel(level);
  }, [resetForLevel, level]);

  const nextLevel = useCallback(() => {
    const next = level + 1;
    if (levels[next]) {
      setLevelAndReset(next);
    }
  }, [level]);

  return {
    state,
    currentLevel,
    pickColor,
    reset,
    nextLevel,
  };
}
