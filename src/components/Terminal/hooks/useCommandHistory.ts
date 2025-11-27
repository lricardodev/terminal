import { useState } from 'react';

export const useCommandHistory = () => {
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const addToHistory = (cmd: string) => {
        setHistory(prev => [cmd, ...prev]);
        setHistoryIndex(-1);
    };

    const navigateHistory = (direction: 'up' | 'down') => {
        if (direction === 'up') {
            if (historyIndex < history.length - 1) {
                setHistoryIndex(prev => prev + 1);
                return history[historyIndex + 1];
            }
            return history[historyIndex]; // Stay at current if max
        } else {
            if (historyIndex > 0) {
                setHistoryIndex(prev => prev - 1);
                return history[historyIndex - 1];
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                return '';
            }
            return '';
        }
    };

    return {
        addToHistory,
        navigateHistory,
        historyIndex
    };
};
