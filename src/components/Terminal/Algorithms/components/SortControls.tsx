import React from "react";
import type { AlgorithmType } from "../types";

interface SortControlsProps {
  selectedAlgorithm: AlgorithmType;
  onAlgorithmChange: (algorithm: AlgorithmType) => void;
  onNewSort: () => void;
  onRun: () => void;
  onPause: () => void;
  onStep: () => void;
  isRunning: boolean;
  isPaused: boolean;
  isFinished: boolean;
  fastMode: boolean;
  onFastModeChange: (fast: boolean) => void;
  comparisons: number;
  copies: number;
}

const SortControls: React.FC<SortControlsProps> = ({
  selectedAlgorithm,
  onAlgorithmChange,
  onNewSort,
  onRun,
  onPause,
  onStep,
  isRunning,
  isPaused,
  isFinished,
  fastMode,
  onFastModeChange,
  comparisons,
  copies,
}) => {
  const algorithmOptions = [
    { value: "bubble", label: "Bubble Sort" },
    { value: "selection", label: "Selection Sort" },
    { value: "insertion", label: "Insertion Sort" },
    { value: "merge", label: "Merge Sort" },
    { value: "quick", label: "Quick Sort" },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Algorithm Selection */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <label className="block text-white/90 text-sm font-medium mb-3">
          Algorithm
        </label>
        <select
          value={selectedAlgorithm}
          onChange={(e) => onAlgorithmChange(e.target.value as AlgorithmType)}
          disabled={isRunning || isPaused}
          className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {algorithmOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-slate-800 text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Control Buttons */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
        <h3 className="text-white/90 text-sm font-medium mb-3">Controls</h3>

        <button
          onClick={onNewSort}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>New Sort</span>
          </div>
        </button>

        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
          <label
            htmlFor="fastMode"
            className="text-white/90 text-sm font-medium"
          >
            Fast Mode
          </label>
          <input
            type="checkbox"
            id="fastMode"
            checked={fastMode}
            onChange={(e) => onFastModeChange(e.target.checked)}
            className="w-5 h-5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={onRun}
            disabled={isRunning || isFinished}
            className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
                />
              </svg>
              <span>Run</span>
            </div>
          </button>

          <button
            onClick={onPause}
            disabled={!isRunning}
            className="px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Pause</span>
            </div>
          </button>

          <button
            onClick={onStep}
            disabled={isRunning || isFinished}
            className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Step</span>
            </div>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <h3 className="text-white/90 text-sm font-medium mb-3">Statistics</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-white/90 text-sm font-medium">
                Comparisons
              </span>
            </div>
            <span className="text-blue-400 font-bold text-lg">
              {comparisons.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-white/90 text-sm font-medium">Copies</span>
            </div>
            <span className="text-green-400 font-bold text-lg">
              {copies.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortControls;
