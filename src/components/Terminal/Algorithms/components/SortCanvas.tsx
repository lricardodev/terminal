import React, { useRef, useEffect } from "react";
import type { SortItem } from "../types";

interface SortCanvasProps {
  items: SortItem[];
  width?: number;
  height?: number;
  onCanvasReady?: (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => void;
}

const SortCanvas: React.FC<SortCanvasProps> = ({
  items,
  width = 600,
  height = 400,
  onCanvasReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Canvas drawing constants - Modern color scheme
  const barGap = 12;
  const borderColor = "#3B82F6"; // Blue-500
  const barColor = "#64748B"; // Slate-500
  const finishedBarColor = "#10B981"; // Emerald-500
  const movingBarColor = "#F59E0B"; // Amber-500
  const movingBarOutlineColor = "#D97706"; // Amber-600

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctxRef.current = ctx;
    ctx.font = "bold 12pt Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (onCanvasReady) {
      onCanvasReady(canvas, ctx);
    }
  }, [onCanvasReady]);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#1E293B"); // slate-800
    gradient.addColorStop(1, "#0F172A"); // slate-900
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw border with rounded corners effect
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, width - 4, height - 4);

    // Calculate bar dimensions
    const textAscent = 15;
    const barWidth = (width - 20 + barGap) / 16 - barGap;
    const barHeight = (height - 40 - 2 * textAscent) / 2;
    const barIncrement = (barHeight - 3) / 17;
    const minBarHeight = barHeight - 17 * barIncrement;
    const leftOffset = (width - 16 * barWidth - 15 * barGap) / 2;
    const firstRowY = barHeight + 10;
    // const secondRowY = 2 * barHeight + 25 + textAscent;

    // Draw items
    items.forEach((item, index) => {
      if (item.value === -1) return;

      const x = leftOffset + index * (barWidth + barGap);
      const y = firstRowY;
      const itemHeight = item.isFinished
        ? (item.value - 100) * barIncrement + minBarHeight
        : item.value * barIncrement + minBarHeight;

      // Set color based on item state
      if (item.isFinished) {
        ctx.fillStyle = finishedBarColor;
      } else if (item.isMoving) {
        ctx.fillStyle = movingBarColor;
      } else {
        ctx.fillStyle = barColor;
      }

      // Draw bar with shadow effect
      if (item.isMoving) {
        // Shadow for moving bars
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(x + 2, y - itemHeight + 2, barWidth, itemHeight);
      }

      // Draw main bar
      ctx.fillRect(x, y - itemHeight, barWidth, itemHeight);

      // Draw bar outline
      ctx.strokeStyle = item.isMoving
        ? movingBarOutlineColor
        : finishedBarColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y - itemHeight, barWidth, itemHeight);

      // Draw value on top of bar
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 10pt Inter, system-ui, sans-serif";
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - itemHeight - 8);

      // Draw position number
      ctx.fillStyle = "#E2E8F0"; // slate-200
      ctx.font = "bold 11pt Inter, system-ui, sans-serif";
      ctx.fillText(
        (index + 1).toString(),
        x + barWidth / 2,
        y + 6 + textAscent
      );
    });
  };

  useEffect(() => {
    draw();
  }, [items, width, height]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-xl shadow-lg border border-white/20"
        style={{
          background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
        }}
      />
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-xs space-y-1">
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: barColor }}
          ></div>
          <span>Unsorted</span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: movingBarColor }}
          ></div>
          <span>Moving</span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: finishedBarColor }}
          ></div>
          <span>Sorted</span>
        </div>
      </div>
    </div>
  );
};

export default SortCanvas;
