import type { SortItem, AlgorithmType } from '../types';

export const generateRandomArray = (size: number): SortItem[] => {
  const items: SortItem[] = [];

  // Create array with values 1 to size
  for (let i = 1; i <= size; i++) {
    items.push({ value: i, position: i - 1 });
  }

  // Shuffle the array
  for (let i = size - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
    items[i].position = i;
    items[j].position = j;
  }

  return items;
};

export const getAlgorithmName = (algorithm: AlgorithmType): string => {
  const names = {
    bubble: 'Bubble Sort',
    selection: 'Selection Sort',
    insertion: 'Insertion Sort',
    merge: 'Merge Sort',
    quick: 'Quick Sort',
  };
  return names[algorithm];
};

export const getAlgorithmDescription = (algorithm: AlgorithmType): string => {
  const descriptions = {
    bubble: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    selection: 'Finds the minimum element from the unsorted portion and moves it to the beginning.',
    insertion: 'Builds the final sorted array one item at a time by inserting each element into its correct position.',
    merge: 'Divides the array into two halves, sorts them separately, and then merges them back together.',
    quick: 'Picks a pivot element and partitions the array around the pivot, then recursively sorts the sub-arrays.',
  };
  return descriptions[algorithm];
};

export const getTimeComplexity = (algorithm: AlgorithmType): { best: string; average: string; worst: string } => {
  const complexities = {
    bubble: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    selection: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    insertion: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    merge: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    quick: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
  };
  return complexities[algorithm];
};

export const getSpaceComplexity = (algorithm: AlgorithmType): string => {
  const complexities = {
    bubble: 'O(1)',
    selection: 'O(1)',
    insertion: 'O(1)',
    merge: 'O(n)',
    quick: 'O(log n)',
  };
  return complexities[algorithm];
};


