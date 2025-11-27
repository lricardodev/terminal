// Types for sorting algorithms visualization

export interface SortItem {
  value: number;
  position: number;
  isFinished?: boolean;
  isMoving?: boolean;
  isHighlighted?: boolean;
}

export interface SortState {
  items: SortItem[];
  comparisons: number;
  copies: number;
  currentStep: string;
  isRunning: boolean;
  isPaused: boolean;
  isFinished: boolean;
}

export interface SortConfig {
  arraySize: number;
  speed: 'slow' | 'fast';
  algorithm: AlgorithmType;
}

export type AlgorithmType = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';

export interface SortStep {
  type: 'compare' | 'swap' | 'move' | 'highlight' | 'finish';
  items: number[];
  message: string;
  delay?: number;
}

export interface AnimationAction {
  action: 'copy' | 'startmove' | 'move' | 'donemove' | 'finishItem' | 'maxoff';
  from?: number;
  to?: number;
  x?: number;
  y?: number;
  itemNum?: number;
  delay: number;
}

export interface TimedSortResult {
  algorithm: string;
  arrayCount: number;
  arraySize: number;
  comparisons: number;
  copies: number;
  elapsedTime: number;
}
