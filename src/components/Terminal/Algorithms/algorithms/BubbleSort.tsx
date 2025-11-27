import { useState, useCallback } from "react";
import type { SortItem, SortStep } from "../types";

interface BubbleSortProps {
  items: SortItem[];
  onComplete: () => void;
}

const BubbleSort = ({ items, onComplete }: BubbleSortProps) => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [currentJ, setCurrentJ] = useState(16);
  const [isComplete, setIsComplete] = useState(false);

  const generateSteps = useCallback(() => {
    const steps: SortStep[] = [];
    let i = currentIndex;
    let j = currentJ;
    let phase = currentPhase;

    if (i === j) {
      if (j === 2) {
        // Sort is finished
        steps.push({
          type: "finish",
          items: [1],
          message: "The sort is finished.",
        });
        setIsComplete(true);
        onComplete();
        return steps;
      } else {
        // Move to next phase
        j = j - 1;
        i = 1;
        phase = phase + 1;
        setCurrentJ(j);
        setCurrentIndex(i);
        setCurrentPhase(phase);

        steps.push({
          type: "highlight",
          items: [],
          message: `Phase ${
            17 - j
          }: next largest item bubbles up to position ${j}`,
        });
      }
    } else {
      // Compare adjacent items
      const itemA = items[i - 1];
      const itemB = items[i];

      if (itemA.value > itemB.value) {
        steps.push({
          type: "compare",
          items: [i, i + 1],
          message: `Is item ${i} bigger than item ${i + 1}? Yes, so swap them.`,
        });

        steps.push({
          type: "swap",
          items: [i, i + 1],
          message: "",
        });
      } else {
        steps.push({
          type: "compare",
          items: [i, i + 1],
          message: `Is item ${i} bigger than item ${
            i + 1
          }? No, so don't swap them.`,
        });
      }

      i = i + 1;
      setCurrentIndex(i);

      if (i === j) {
        steps.push({
          type: "finish",
          items: [j],
          message: "",
        });
      }
    }

    return steps;
  }, [currentIndex, currentJ, currentPhase, items, onComplete]);

  const getCurrentStep = useCallback(() => {
    if (isComplete) return null;
    return generateSteps()[0];
  }, [isComplete, generateSteps]);

  const getInitialMessage = () => {
    return 'Phase 1: largest item "bubbles" up to position 16';
  };

  return {
    getCurrentStep,
    getInitialMessage,
    isComplete,
  };
};

export default BubbleSort;
