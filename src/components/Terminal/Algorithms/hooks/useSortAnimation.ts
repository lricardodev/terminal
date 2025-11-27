import { useState, useRef, useCallback, useEffect } from 'react';
import type { SortState, SortItem, AnimationAction } from '../types';

export const useSortAnimation = (initialItems: SortItem[]) => {
  const [state, setState] = useState<SortState>({
    items: initialItems,
    comparisons: 0,
    copies: 0,
    currentStep: '',
    isRunning: false,
    isPaused: false,
    isFinished: false,
  });

  const actionQueue = useRef<AnimationAction[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const processActionQueueRef = useRef<() => void>(() => { });

  const updateState = useCallback((updates: Partial<SortState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const addToActionQueue = useCallback((action: AnimationAction) => {
    actionQueue.current.push(action);
  }, []);

  const processActionQueue = useCallback(() => {
    if (actionQueue.current.length === 0) return;

    const action = actionQueue.current.shift();
    if (!action) return;

    // Process the action
    switch (action.action) {
      case 'copy':
        if (action.from !== undefined && action.to !== undefined) {
          setState(prev => {
            const newItems = [...prev.items];
            newItems[action.to!] = { ...newItems[action.from!] };
            newItems[action.from!] = { value: -1, position: action.from! };
            return {
              ...prev,
              items: newItems,
              copies: prev.copies + 1,
            };
          });
        }
        break;
      case 'finishItem':
        if (action.itemNum !== undefined) {
          setState(prev => {
            const newItems = [...prev.items];
            newItems[action.itemNum!] = {
              ...newItems[action.itemNum!],
              isFinished: true,
            };
            return { ...prev, items: newItems };
          });
        }
        break;
      // Add other action types as needed
    }

    // Schedule next action
    if (actionQueue.current.length > 0) {
      timeoutRef.current = setTimeout(() => processActionQueueRef.current(), action.delay);
    }
  }, []);

  useEffect(() => {
    processActionQueueRef.current = processActionQueue;
  }, [processActionQueue]);

  const startAnimation = useCallback(() => {
    updateState({ isRunning: true, isPaused: false });
    processActionQueue();
  }, [updateState, processActionQueue]);

  const pauseAnimation = useCallback(() => {
    updateState({ isRunning: false, isPaused: true });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [updateState]);

  const stopAnimation = useCallback(() => {
    updateState({ isRunning: false, isPaused: false, isFinished: true });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    actionQueue.current = [];
  }, [updateState]);

  const resetAnimation = useCallback((newItems: SortItem[]) => {
    updateState({
      items: newItems,
      comparisons: 0,
      copies: 0,
      currentStep: '',
      isRunning: false,
      isPaused: false,
      isFinished: false,
    });
    actionQueue.current = [];
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [updateState]);

  return {
    state,
    updateState,
    addToActionQueue,
    startAnimation,
    pauseAnimation,
    stopAnimation,
    resetAnimation,
  };
};


