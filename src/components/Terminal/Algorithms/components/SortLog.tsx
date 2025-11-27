import type { TimedSortResult } from "../types";

interface SortLogProps {
  results: TimedSortResult[];
}

export const SortLog = ({ results }: SortLogProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Sort Log</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-white/5 text-xs uppercase text-gray-400">
            <tr>
              <th className="px-6 py-3">Algorithm</th>
              <th className="px-6 py-3">Array Size</th>
              <th className="px-6 py-3">Comparisons</th>
              <th className="px-6 py-3">Copies</th>
              <th className="px-6 py-3">Time (ms)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {results.map((result, index) => (
              <tr key={index} className="hover:bg-white/5">
                <td className="px-6 py-4 font-medium text-white">
                  {result.algorithm}
                </td>
                <td className="px-6 py-4">{result.arraySize}</td>
                <td className="px-6 py-4">{result.comparisons}</td>
                <td className="px-6 py-4">{result.copies}</td>
                <td className="px-6 py-4">{result.elapsedTime}</td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No results yet. Run a sort to see stats.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
