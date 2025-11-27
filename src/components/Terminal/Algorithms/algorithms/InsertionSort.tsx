import { useState, useCallback } from "react";
import type { SortItem, SortStep } from "../types";

interface InsertionSortProps {
  items: SortItem[];
  onComplete: () => void;
}

const InsertionSort = ({ items, onComplete }: InsertionSortProps) => {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [currentJ, setCurrentJ] = useState(0);
  const [currentI, setCurrentI] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [tempValue, setTempValue] = useState<number | null>(null);

  const generateSteps = useCallback(() => {
    const steps: SortStep[] = [];
    let j = currentJ;
    let i = currentI;
    let phase = currentPhase;

    if (j === 0) {
      // Start phase 1: Insert item 2
      phase = 1;
      j = 2;
      i = 1;
      setCurrentJ(j);
      setCurrentI(i);
      setCurrentPhase(phase);

      steps.push({
        type: "move",
        items: [2, 0], // Copy item 2 to temp
        message:
          "Phase 1: Insert item 2 into its correct position in the sorted list. Copy item 2 to Temp.",
      });
      setTempValue(items[1].value);
    } else if (j === 17) {
      // Sort is finished
      steps.push({
        type: "finish",
        items: Array.from({ length: 16 }, (_, idx) => idx + 1),
        message: "The sort is finished.",
      });
      setIsComplete(true);
      onComplete();
      return steps;
    } else if (i === 0) {
      // Temp is smaller than all items
      steps.push({
        type: "move",
        items: [0, 1], // Copy temp to position 1
        message:
          "Temp is smaller than all items in the sorted list; copy it to position 1.",
      });
      i = -1;
      setCurrentI(i);
    } else if (i === -1) {
      // End of current phase
      steps.push({
        type: "highlight",
        items: Array.from({ length: j }, (_, idx) => idx + 1),
        message: `Items 1 through ${j} now form a sorted list.`,
      });
      j = j + 1;
      i = -2;
      setCurrentJ(j);
      setCurrentI(i);
    } else if (i === -2) {
      // Start new phase
      phase = j - 1;
      i = j - 1;
      setCurrentPhase(phase);
      setCurrentI(i);

      steps.push({
        type: "move",
        items: [j, 0], // Copy item j to temp
        message: `Phase ${
          j - 1
        }: Insert item ${j} into its correct position in the sorted list. Copy item ${j} to Temp.`,
      });
      setTempValue(items[j - 1].value);
    } else {
      // Compare temp with current item
      const currentItem = items[i - 1];

      if (currentItem.value > (tempValue || 0)) {
        steps.push({
          type: "move",
          items: [i, i + 1], // Move item i to position i+1
          message: `Is item ${i} bigger than Temp? Yes, so move it up to position ${
            i + 1
          }`,
        });
        i = i - 1;
        setCurrentI(i);
      } else {
        steps.push({
          type: "move",
          items: [0, i + 1], // Copy temp to position i+1
          message: `Is item ${i} bigger than Temp? No, so Temp belongs in position ${
            i + 1
          }`,
        });
        i = -1;
        setCurrentI(i);
        setTempValue(null);
      }
    }

    return steps;
  }, [currentJ, currentI, currentPhase, items, tempValue, onComplete]);

  const getCurrentStep = useCallback(() => {
    if (isComplete) return null;
    return generateSteps()[0];
  }, [isComplete, generateSteps]);

  const getInitialMessage = () => {
    return "The sublist in the box -- just item 1 for now -- is correctly sorted";
  };

  return {
    getCurrentStep,
    getInitialMessage,
    isComplete,
    tempValue,
  };
};

export default InsertionSort;
