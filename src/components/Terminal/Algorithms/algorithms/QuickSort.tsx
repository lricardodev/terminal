import { useState, useCallback } from "react";
import type { SortItem, SortStep } from "../types";

interface QuickSortProps {
  items: SortItem[];
  onComplete: () => void;
}

const QuickSort = ({ items, onComplete }: QuickSortProps) => {
  const [stack, setStack] = useState<number[]>([]);
  const [stackCount, setStackCount] = useState(0);
  const [currentHi, setCurrentHi] = useState(16);
  const [currentLo, setCurrentLo] = useState(1);
  const [currentK, setCurrentK] = useState(0);
  const [currentI, setCurrentI] = useState(1);
  const [currentJ, setCurrentJ] = useState(16);
  const [isComplete, setIsComplete] = useState(false);
  const [tempValue, setTempValue] = useState<number | null>(null);

  const generateSteps = useCallback(() => {
    const steps: SortStep[] = [];
    let k = currentK;
    let hi = currentHi;
    let lo = currentLo;
    let i = currentI;
    let j = currentJ;
    let stackCt = stackCount;
    const currentStack = [...stack];

    if (k === 0) {
      if (hi === lo) {
        // Only one item in range
        steps.push({
          type: "finish",
          items: [hi],
          message:
            "There is only one item in the range; it is already in its final position.",
        });
        k = 1;
        setCurrentK(k);
      } else {
        // Copy pivot to temp
        steps.push({
          type: "move",
          items: [lo, 0],
          message: `Copy item ${lo} to Temp`,
        });
        setTempValue(items[lo - 1].value);
        k = -1;
        setCurrentK(k);
      }
    } else if (k === 1) {
      if (stackCt === 0) {
        // Sort is finished
        steps.push({
          type: "finish",
          items: [],
          message: "The sort is finished.",
        });
        setIsComplete(true);
        onComplete();
        return steps;
      } else {
        // Pop from stack
        hi = currentStack[stackCt - 1];
        lo = currentStack[stackCt - 2];
        j = hi;
        i = lo;
        stackCt = stackCt - 2;

        setCurrentHi(hi);
        setCurrentLo(lo);
        setCurrentJ(j);
        setCurrentI(i);
        setStackCount(stackCt);
        setStack(currentStack.slice(0, stackCt));

        steps.push({
          type: "highlight",
          items: Array.from({ length: hi - lo + 1 }, (_, idx) => lo + idx),
          message: `Apply "QuickSortStep" to items ${lo} through ${hi}. The range of possible final positions for item ${lo} is boxed`,
        });
        k = 0;
        setCurrentK(k);
      }
    } else if (k === 2) {
      // Partition complete
      steps.push({
        type: "finish",
        items: [hi],
        message: `Item ${hi} is in final position; smaller items below and bigger items above`,
      });

      // Push subarrays to stack if they have more than one element
      if (hi < j) {
        currentStack[stackCt] = hi + 1;
        currentStack[stackCt + 1] = j;
        stackCt = stackCt + 2;
      }
      if (hi > i) {
        currentStack[stackCt] = i;
        currentStack[stackCt + 1] = hi - 1;
        stackCt = stackCt + 2;
      }

      setStackCount(stackCt);
      setStack(currentStack);
      k = 1;
      setCurrentK(k);
    } else if (hi === lo) {
      // Only one position left
      steps.push({
        type: "move",
        items: [0, hi],
        message: `Only one possible position left for Temp; copy Temp to position ${hi}`,
      });
      setTempValue(null);
      k = 2;
      setCurrentK(k);
    } else if (items[lo - 1].value === -1) {
      // Compare with high end
      const temp = tempValue || 0;
      const highItem = items[hi - 1];

      if (temp > highItem.value) {
        steps.push({
          type: "move",
          items: [hi, lo],
          message: `Item ${hi} is smaller than Temp, so move it; Temp will end up above it`,
        });
        lo = lo + 1;
        setCurrentLo(lo);
      } else {
        steps.push({
          type: "compare",
          items: [0, hi],
          message: `Item ${hi} is bigger than Temp, so Temp will end up below it`,
        });
        hi = hi - 1;
        setCurrentHi(hi);
      }
    } else if (items[hi - 1].value === -1) {
      // Compare with low end
      const temp = tempValue || 0;
      const lowItem = items[lo - 1];

      if (lowItem.value > temp) {
        steps.push({
          type: "move",
          items: [lo, hi],
          message: `Item ${lo} is bigger than Temp, so move it; Temp will end up below it`,
        });
        hi = hi - 1;
        setCurrentHi(hi);
      } else {
        steps.push({
          type: "compare",
          items: [lo, 0],
          message: `Item ${lo} is smaller than Temp, so Temp will end up above it`,
        });
        lo = lo + 1;
        setCurrentLo(lo);
      }
    }

    return steps;
  }, [
    currentK,
    currentHi,
    currentLo,
    currentI,
    currentJ,
    stackCount,
    stack,
    items,
    tempValue,
    onComplete,
  ]);

  const getCurrentStep = useCallback(() => {
    if (isComplete) return null;
    return generateSteps()[0];
  }, [isComplete, generateSteps]);

  const getInitialMessage = () => {
    return 'Apply "QuickSortStep" to items 1 through 16. The range of possible final positions for item 1 is boxed.';
  };

  return {
    getCurrentStep,
    getInitialMessage,
    isComplete,
    tempValue,
  };
};

export default QuickSort;
