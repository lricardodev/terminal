import { useState, useCallback } from "react";
import type { SortItem, SortStep } from "../types";

interface MergeSortProps {
  items: SortItem[];
  onComplete: () => void;
}

const MergeSort = ({ items, onComplete }: MergeSortProps) => {
  const [sortLength, setSortLength] = useState(1);
  const [currentI, setCurrentI] = useState(1);
  const [currentJ, setCurrentJ] = useState(2);
  const [currentK, setCurrentK] = useState(17);
  const [endI, setEndI] = useState(1);
  const [endJ, setEndJ] = useState(2);
  const [lo, setLo] = useState(0);
  const [hi, setHi] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  const generateSteps = useCallback(() => {
    const steps: SortStep[] = [];
    let i = currentI;
    let j = currentJ;
    let k = currentK;
    let ei = endI;
    let ej = endJ;
    let length = sortLength;
    let currentLo = lo;
    let currentHi = hi;

    if (currentLo === 1 && length === 8) {
      // Sort is finished
      steps.push({
        type: "finish",
        items: Array.from({ length: 16 }, (_, idx) => idx + 1),
        message: "The sort is finished.",
      });
      setIsComplete(true);
      onComplete();
      return steps;
    } else if (currentLo === 1) {
      // Move to next phase
      currentHi = currentHi + 1;
      length = length * 2;
      k = 17;
      i = 1;
      j = length + 1;
      ei = i + length - 1;
      ej = j + length - 1;
      currentLo = 0;

      setSortLength(length);
      setCurrentI(i);
      setCurrentJ(j);
      setCurrentK(k);
      setEndI(ei);
      setEndJ(ej);
      setLo(currentLo);
      setHi(currentHi);

      steps.push({
        type: "highlight",
        items: Array.from({ length: length * 2 }, (_, idx) => i + idx),
        message: `Phase ${currentHi}: Merge lists of length ${length} into lists of length ${
          length * 2
        }. First, merge items ${i} through ${ei} with items ${j} through ${ej}.`,
      });
    } else if (ei < i && ej < j) {
      // Both lists are empty
      if (k === 33) {
        // Copy merged items back
        steps.push({
          type: "move",
          items: Array.from({ length: 16 }, (_, idx) => idx + 1),
          message: "Copy merged items back to original list.",
        });
        currentLo = 1;
        setLo(currentLo);
      } else {
        // Move to next merge
        ei = ei + 2 * length;
        ej = ej + 2 * length;
        j = ei + 1;
        i = j - length;

        setEndI(ei);
        setEndJ(ej);
        setCurrentI(i);
        setCurrentJ(j);

        const message =
          length === 1
            ? `Next, merge item ${i} with item ${j}`
            : `Next, merge items ${i} through ${ei} with items ${j} through ${ej}`;

        steps.push({
          type: "highlight",
          items: Array.from({ length: length * 2 }, (_, idx) => i + idx),
          message,
        });
      }
    } else if (ei < i) {
      // List 1 is empty
      steps.push({
        type: "move",
        items: [j, k],
        message: `List 1 is empty; move item ${j} to the merged list.`,
      });
      j = j + 1;
      k = k + 1;
      setCurrentJ(j);
      setCurrentK(k);
    } else if (ej < j) {
      // List 2 is empty
      steps.push({
        type: "move",
        items: [i, k],
        message: `List 2 is empty; move item ${i} to the merged list.`,
      });
      i = i + 1;
      k = k + 1;
      setCurrentI(i);
      setCurrentK(k);
    } else {
      // Compare items from both lists
      const itemI = items[i - 1];
      const itemJ = items[j - 1];

      if (itemI.value > itemJ.value) {
        steps.push({
          type: "compare",
          items: [i, j],
          message: `Is item ${j} smaller than item ${i}? Yes, so move item ${j} to merged list`,
        });
        steps.push({
          type: "move",
          items: [j, k],
          message: "",
        });
        j = j + 1;
        k = k + 1;
        setCurrentJ(j);
        setCurrentK(k);
      } else {
        steps.push({
          type: "compare",
          items: [i, j],
          message: `Is item ${j} smaller than item ${i}? No, so move item ${i} to merged list`,
        });
        steps.push({
          type: "move",
          items: [i, k],
          message: "",
        });
        i = i + 1;
        k = k + 1;
        setCurrentI(i);
        setCurrentK(k);
      }
    }

    return steps;
  }, [
    currentI,
    currentJ,
    currentK,
    endI,
    endJ,
    sortLength,
    lo,
    hi,
    items,
    onComplete,
  ]);

  const getCurrentStep = useCallback(() => {
    if (isComplete) return null;
    return generateSteps()[0];
  }, [isComplete, generateSteps]);

  const getInitialMessage = () => {
    return "Phase 1: Merge lists of length 1 into lists of length 2. First, merge item 1 with item 2.";
  };

  return {
    getCurrentStep,
    getInitialMessage,
    isComplete,
  };
};

export default MergeSort;
