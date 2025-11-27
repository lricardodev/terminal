import React, { useState } from "react";
import type { TimedSortResult } from "./types";
import VisualSort from "./components/VisualSort";
import { TimedSort } from "./components/TimedSort";
import { SortLog } from "./components/SortLog";

const SortLabApp: React.FC = () => {
  const [logResults, setLogResults] = useState<TimedSortResult[]>([]);

  const handleLogResult = (result: TimedSortResult) => {
    setLogResults((prev) => [...prev, result]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            xSortLab
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Interactive Algorithm Visualization & Performance Testing
          </p>
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <svg
              className="w-5 h-5 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
            >
              Click here for info and instructions
            </a>
          </div>
        </div>

        <noscript>
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8">
            <p className="text-red-200 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Sorry, this program requires JavaScript to run.
            </p>
          </div>
        </noscript>

        {/* Main Content Grid */}
        <div className="space-y-8">
          <VisualSort onLogResult={handleLogResult} />
          <TimedSort />
          <SortLog results={logResults} />
        </div>
      </div>
    </div>
  );
};

export default SortLabApp;
