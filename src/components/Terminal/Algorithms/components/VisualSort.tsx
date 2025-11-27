import React, { useState, useCallback, useRef } from "react";
import type { SortItem, AlgorithmType, TimedSortResult } from "../types";
import { generateRandomArray, getAlgorithmName } from "../utils/sortUtils";
import SortCanvas from "./SortCanvas";
import SortControls from "./SortControls";
import BubbleSort from "../algorithms/BubbleSort";
import SelectionSort from "../algorithms/SelectionSort";
import InsertionSort from "../algorithms/InsertionSort";
import MergeSort from "../algorithms/MergeSort";
import QuickSort from "../algorithms/QuickSort";

interface VisualSortProps {
  onLogResult: (result: TimedSortResult) => void;
}

const VisualSort: React.FC<VisualSortProps> = ({ onLogResult }) => {
  const [items, setItems] = useState<SortItem[]>(() => generateRandomArray(16));
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<AlgorithmType>("selection");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [fastMode, setFastMode] = useState(false);
  const [comparisons, setComparisons] = useState(0);
  const [copies, setCopies] = useState(0);
  const [, setCurrentStep] = useState("");
  const [message1, setMessage1] = useState(
    'Click "Run" or "Step" to begin sorting.'
  );
  const [message2, setMessage2] = useState("");

  const algorithmRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const handleCanvasReady = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      canvasRef.current = canvas;
      ctxRef.current = ctx;
    },
    []
  );

  const handleNewSort = useCallback(() => {
    const newItems = generateRandomArray(16);
    setItems(newItems);
    setIsRunning(false);
    setIsPaused(false);
    setIsFinished(false);
    setComparisons(0);
    setCopies(0);
    setCurrentStep("");
    setMessage1('Click "Run" or "Step" to begin sorting.');
    setMessage2("");

    // Reset algorithm state
    algorithmRef.current = null;
  }, []);

  const handleAlgorithmChange = useCallback(
    (algorithm: AlgorithmType) => {
      setSelectedAlgorithm(algorithm);
      handleNewSort();
    },
    [handleNewSort]
  );

  const getAlgorithmInstance = useCallback(() => {
    if (algorithmRef.current) return algorithmRef.current;

    const algorithmProps = {
      items,
      onStep: (step: any) => {
        setCurrentStep(step.message);
        setComparisons((prev) => prev + 1);
        // Handle step execution here
      },
      onComplete: () => {
        setIsFinished(true);
        setIsRunning(false);

        // Log result
        const result: TimedSortResult = {
          algorithm: getAlgorithmName(selectedAlgorithm),
          arrayCount: 1,
          arraySize: 16,
          comparisons,
          copies,
          elapsedTime: 0, // Would need to track actual time
        };
        onLogResult(result);
      },
    };

    switch (selectedAlgorithm) {
      case "bubble":
        algorithmRef.current = BubbleSort(algorithmProps);
        break;
      case "selection":
        algorithmRef.current = SelectionSort(algorithmProps);
        break;
      case "insertion":
        algorithmRef.current = InsertionSort(algorithmProps);
        break;
      case "merge":
        algorithmRef.current = MergeSort(algorithmProps);
        break;
      case "quick":
        algorithmRef.current = QuickSort(algorithmProps);
        break;
      default:
        algorithmRef.current = SelectionSort(algorithmProps);
    }

    return algorithmRef.current;
  }, [selectedAlgorithm, items, comparisons, copies, onLogResult]);

  const handleRun = useCallback(() => {
    if (isRunning || isFinished) return;

    setIsRunning(true);
    setIsPaused(false);

    const algorithm = getAlgorithmInstance();
    setMessage1(algorithm.getInitialMessage());
    setMessage2("");

    // Start animation loop
    const animate = () => {
      if (!isRunning || isPaused) return;

      const step = algorithm.getCurrentStep();
      if (step) {
        setMessage2(step.message);
        // Execute step actions here

        if (fastMode) {
          setTimeout(animate, 100);
        } else {
          setTimeout(animate, 1000);
        }
      } else {
        setIsRunning(false);
        setIsFinished(true);
      }
    };

    animate();
  }, [isRunning, isPaused, isFinished, fastMode, getAlgorithmInstance]);

  const handlePause = useCallback(() => {
    setIsRunning(false);
    setIsPaused(true);
  }, []);

  const handleStep = useCallback(() => {
    if (isRunning || isFinished) return;

    const algorithm = getAlgorithmInstance();
    const step = algorithm.getCurrentStep();

    if (step) {
      setMessage2(step.message);
      // Execute step actions here
    }
  }, [isRunning, isFinished, getAlgorithmInstance]);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
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
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Visual Sort</h2>
            <p className="text-blue-100 text-sm">
              Interactive algorithm visualization
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Canvas Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <SortCanvas items={items} onCanvasReady={handleCanvasReady} />
            </div>
          </div>

          {/* Controls Section */}
          <div className="lg:col-span-1">
            <SortControls
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmChange={handleAlgorithmChange}
              onNewSort={handleNewSort}
              onRun={handleRun}
              onPause={handlePause}
              onStep={handleStep}
              isRunning={isRunning}
              isPaused={isPaused}
              isFinished={isFinished}
              fastMode={fastMode}
              onFastModeChange={setFastMode}
              comparisons={comparisons}
              copies={copies}
            />
          </div>
        </div>

        {/* Status Messages */}
        <div className="mt-8 space-y-3">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-white/90 text-sm leading-relaxed">
                {message1}
              </p>
            </div>
          </div>
          {message2 && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-white/90 text-sm leading-relaxed">
                  {message2}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisualSort;
