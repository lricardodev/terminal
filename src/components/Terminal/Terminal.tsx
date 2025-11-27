"use client";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ThemeName } from "./types";
import { THEMES, nextTheme } from "./commands";
import { runEratosthenes } from "./Algorithms/eratosthenesLogic";
import { useFileSystem } from "./hooks/useFileSystem";
import { useCommandHistory } from "./hooks/useCommandHistory";

export default function TerminalPage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<ThemeName>(
    () =>
      (typeof window !== "undefined" &&
        (localStorage.getItem("terminal_theme") as ThemeName)) ||
      "matrix"
  );
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [commandInput, setCommandInput] = useState("");
  const consoleRef = useRef<HTMLDivElement>(null);

  const { currentPath, ls, cd, cat, mkdir, touch } = useFileSystem();
  const { addToHistory, navigateHistory } = useCommandHistory();

  // Helper to get string path
  const pathStr = "~/" + currentPath.slice(2).join("/");

  const handleCommand = (cmd: string) => {
    if (!cmd.trim()) return;

    // Add to history
    addToHistory(cmd);

    // Echo the command
    setConsoleOutput((prev) => [...prev, `${pathStr} $ ${cmd}`]);

    const parts = cmd.trim().split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case "clear":
        setConsoleOutput([]);
        break;
      case "help":
        setConsoleOutput((prev) => [
          ...prev,
          "Available commands:",
          "  ls            List directory contents",
          "  cd [dir]      Change directory",
          "  cat [file]    Print file content",
          "  mkdir [dir]   Create directory",
          "  touch [file]  Create empty file",
          "  clear         Clear terminal",
          "  theme [name]  Change theme",
          "  date          Show current date",
          "  eratosthenes  Run Sieve of Eratosthenes algorithm",
          "  exit          Return to main menu",
        ]);
        break;
      case "ls": {
        const files = ls();
        setConsoleOutput((prev) => [...prev, files.join("  ")]);
        break;
      }
      case "cd": {
        const cdErr = cd(args[0] || "~");
        if (cdErr) setConsoleOutput((prev) => [...prev, cdErr]);
        break;
      }
      case "cat": {
        if (!args[0]) {
          setConsoleOutput((prev) => [...prev, "usage: cat [file]"]);
        } else {
          const content = cat(args[0]);
          setConsoleOutput((prev) => [...prev, content]);
        }
        break;
      }
      case "mkdir": {
        if (!args[0]) {
          setConsoleOutput((prev) => [...prev, "usage: mkdir [directory]"]);
        } else {
          const err = mkdir(args[0]);
          if (err) setConsoleOutput((prev) => [...prev, err]);
        }
        break;
      }
      case "touch": {
        if (!args[0]) {
          setConsoleOutput((prev) => [...prev, "usage: touch [file]"]);
        } else {
          const err = touch(args[0]);
          if (err) setConsoleOutput((prev) => [...prev, err]);
        }
        break;
      }
      case "theme": {
        const newTheme = args[0] as ThemeName;
        if (Object.keys(THEMES).includes(newTheme)) {
          setTheme(newTheme);
          setConsoleOutput((prev) => [...prev, `Theme changed to ${newTheme}`]);
        } else {
          setConsoleOutput((prev) => [
            ...prev,
            `Unknown theme: ${newTheme}. Available: ${Object.keys(THEMES).join(
              ", "
            )}`,
          ]);
        }
        break;
      }
      case "date":
        setConsoleOutput((prev) => [...prev, new Date().toString()]);
        break;
      case "eratosthenes":
        setConsoleOutput((prev) => [
          ...prev,
          "Running Sieve of Eratosthenes...",
        ]);
        // The console.log inside runEratosthenes will be caught by our interceptor
        runEratosthenes(100);
        break;
      case "exit":
        navigate("/");
        break;
      default:
        setConsoleOutput((prev) => [...prev, `Command not found: ${command}`]);
    }
  };

  useEffect(() => {
    localStorage.setItem("terminal_theme", theme);
  }, [theme]);

  useEffect(() => {
    // Intercept console.log, console.error, console.warn, etc.
    const originalLog = console.log;
    const originalError = console.error;

    const addToOutput = (_type: string, ...args: unknown[]) => {
      // Skip our own echo logs if we were to add them here, but we handle command echo separately
      // We mainly want to catch algorithm outputs
      const message = args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
        )
        .join(" ");

      setConsoleOutput((prev) => [
        ...prev,
        message, // Just print the message cleanly for algorithm output
      ]);
    };

    console.log = (...args) => {
      originalLog.apply(console, args);
      addToOutput("log", ...args);
    };

    console.error = (...args) => {
      originalError.apply(console, args);
      addToOutput("error", ...args);
    };

    // Clean up when unmounting
    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(commandInput);
      setCommandInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevCmd = navigateHistory("up");
      if (prevCmd !== undefined) setCommandInput(prevCmd);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextCmd = navigateHistory("down");
      setCommandInput(nextCmd || "");
    }
  };

  const themeVars = THEMES[theme];

  return (
    <div
      className="w-screen h-screen overflow-hidden bg-[var(--bg)] font-mono text-[var(--fg)] p-4 box-border"
      style={
        {
          "--bg": themeVars.bg,
          "--fg": themeVars.fg,
          "--muted": themeVars.muted,
          "--accent": themeVars.accent,
          "--cursor": themeVars.cursor,
          background: `radial-gradient(1200px 800px at 20% -10%, rgba(255,255,255,0.06), transparent),
                    radial-gradient(900px 600px at 120% 10%, rgba(255,255,255,0.05), transparent),
                    var(--bg)`,
        } as React.CSSProperties
      }
    >
      <div className="flex gap-6 w-full h-full max-xl:flex-col">
        <div className="w-[350px] bg-black/30 rounded-[14px] p-5 border border-white/10 backdrop-blur-sm flex flex-col gap-5 max-xl:w-full max-xl:order-2 max-sm:p-[15px]">
          <h3 className="m-0 text-[var(--accent)] text-base text-center border-b border-white/10 pb-2.5">
            System Control
          </h3>
          <div className="flex flex-col gap-3 m-0 max-xl:flex-row max-xl:flex-wrap max-xl:justify-center">
            <button
              onClick={() => setCommandInput("eratosthenes")}
              className="bg-[var(--accent)] text-[var(--bg)] border-none px-4 py-3 rounded-lg text-[13px] font-semibold cursor-pointer transition-all duration-200 font-inherit text-left w-full hover:bg-[var(--fg)] hover:text-[var(--bg)] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 max-xl:w-auto max-xl:min-w-[140px]"
            >
              Run Eratosthenes
            </button>
            <button
              onClick={() => setCommandInput("help")}
              className="bg-[var(--accent)] text-[var(--bg)] border-none px-4 py-3 rounded-lg text-[13px] font-semibold cursor-pointer transition-all duration-200 font-inherit text-left w-full hover:bg-[var(--fg)] hover:text-[var(--bg)] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 max-xl:w-auto max-xl:min-w-[140px]"
            >
              Help Command
            </button>
            <button
              onClick={() => setCommandInput("ls")}
              className="bg-[var(--accent)] text-[var(--bg)] border-none px-4 py-3 rounded-lg text-[13px] font-semibold cursor-pointer transition-all duration-200 font-inherit text-left w-full hover:bg-[var(--fg)] hover:text-[var(--bg)] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 max-xl:w-auto max-xl:min-w-[140px]"
            >
              List Files
            </button>
          </div>
          <div className="mt-auto text-center pt-5 border-t border-white/10">
            <p className="my-2.5 text-xs text-[var(--muted)]">
              Current theme: {theme}
            </p>
            <button
              className="text-xs px-2.5 py-1.5 bg-transparent text-[var(--fg)] border border-white/15 rounded-lg cursor-pointer hover:border-[var(--accent)] transition-colors"
              onClick={() => setTheme(nextTheme(theme))}
            >
              Change theme
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col rounded-[14px] shadow-[0_15px_60px_rgba(0,0,0,0.35)] overflow-hidden border border-white/6 bg-gradient-to-b from-white/4 to-white/1 backdrop-blur-sm">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 p-[10px_12px] border-b border-white/6 bg-black/35 max-[520px]:grid-cols-[1fr_auto] shrink-0">
            <div className="flex gap-2 max-[520px]:hidden">
              <span className="w-3 h-3 rounded-full inline-block opacity-90 bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full inline-block opacity-90 bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full inline-block opacity-90 bg-[#27c93f]" />
            </div>
            <div className="opacity-80 text-[13px] tracking-[0.3px]">
              {pathStr}
            </div>
            <div className="flex gap-2">
              <button
                className="text-xs px-2.5 py-1.5 bg-transparent text-[var(--fg)] border border-white/15 rounded-lg cursor-pointer hover:border-[var(--accent)] transition-colors"
                onClick={() => navigate("/")}
              >
                ← Back
              </button>
              <button
                className="text-xs px-2.5 py-1.5 bg-transparent text-[var(--fg)] border border-white/15 rounded-lg cursor-pointer hover:border-[var(--accent)] transition-colors"
                onClick={() => setConsoleOutput([])}
              >
                Clear
              </button>
            </div>
          </div>
          <div
            className="flex-1 overflow-auto p-[18px] bg-black/80 text-[var(--fg)] text-sm leading-[1.4]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, rgba(255,255,255,0.02) 0 28px, transparent 28px 56px)",
            }}
            ref={consoleRef}
            onClick={() => document.getElementById("terminal-input")?.focus()}
          >
            {consoleOutput.length === 0 && (
              <div className="text-center py-10 px-5 text-lg leading-6 opacity-50">
                <p>Welcome to Terminal v2.0</p>
                <p>Type 'help' to see available commands.</p>
              </div>
            )}
            {consoleOutput.map((output, index) => (
              <div
                key={index}
                className="py-0.5 border-b border-white/10 last:border-none"
              >
                <pre className="m-0 whitespace-pre-wrap break-words text-inherit font-mono">
                  {output}
                </pre>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
              <span className="text-[var(--accent)] font-bold">
                {pathStr} $
              </span>
              <input
                id="terminal-input"
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-[var(--fg)] font-mono text-sm"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
