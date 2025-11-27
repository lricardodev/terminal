import { useState, useCallback } from "react";
import type { SortItem, SortStep } from "../types";

interface SelectionSortProps {
  items: SortItem[];
  onComplete: () => void;
}

const SelectionSort = ({ items, onComplete }: SelectionSortProps) => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(2);
  const [currentJ, setCurrentJ] = useState(16);
  const [maxLocation, setMaxLocation] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  const generateSteps = useCallback(() => {
    const steps: SortStep[] = [];
    let i = currentIndex;
    let j = currentJ;
    let phase = currentPhase;
    let maxLoc = maxLocation;

    if (j === 1) {
      // Sort is finished
      steps.push({
        type: "finish",
        items: [1],
        message: "The sort is finished.",
      });
      setIsComplete(true);
      onComplete();
      return steps;
    } else if (i === -1) {
      // Start new phase
      phase = phase + 1;
      i = 2;
      maxLoc = 1;
      setCurrentPhase(phase);
      setCurrentIndex(i);
      setMaxLocation(maxLoc);

      steps.push({
        type: "highlight",
        items: [1],
        message: `Phase ${
          17 - j
        }: Find the next largest item and move it to position ${j}. Item 1 is the largest item seen so far during this phase`,
      });
    } else if (i > j) {
      // End of phase - swap max with position j
      steps.push({
        type: "highlight",
        items: [],
        message: "",
      });

      if (maxLoc === j) {
        steps.push({
          type: "compare",
          items: [j],
          message: `Item ${j} is already in its correct location.`,
        });
      } else {
        const message =
          j === 2
            ? "Swap item 2 with item 1"
            : `Swap item ${j} with maximum among items 1 through ${j - 1}`;

        steps.push({
          type: "swap",
          items: [maxLoc, j],
          message,
        });
      }

      steps.push({
        type: "finish",
        items: [j],
        message: "",
      });

      j = j - 1;
      i = -1;
      setCurrentJ(j);
      setCurrentIndex(i);
    } else {
      // Compare current item with max
      const currentItem = items[i - 1];
      const maxItem = items[maxLoc - 1];

      if (currentItem.value > maxItem.value) {
        maxLoc = i;
        setMaxLocation(maxLoc);
        steps.push({
          type: "compare",
          items: [i, maxLoc],
          message: `Item ${i} is bigger than item ${maxLoc}, so item ${i} is now the max seen.`,
        });
      } else {
        steps.push({
          type: "compare",
          items: [i, maxLoc],
          message: `Item ${i} is smaller than item ${maxLoc}, so item ${maxLoc} is still the max seen.`,
        });
      }

      i = i + 1;
      setCurrentIndex(i);
    }

    return steps;
  }, [currentIndex, currentJ, currentPhase, maxLocation, items, onComplete]);

  const getCurrentStep = useCallback(() => {
    if (isComplete) return null;
    return generateSteps()[0];
  }, [isComplete, generateSteps]);

  const getInitialMessage = () => {
    return "Phase 1: Find the largest item and swap it with item 16. Item 1 is the largest item seen so far during this phase";
  };

  return {
    getCurrentStep,
    getInitialMessage,
    isComplete,
    maxLocation,
  };
};

export default SelectionSort;
