// Tipos para la terminal
export type TermType = "cmd" | "out" | "sys";

export interface TermLine { 
  id: string; 
  text: string; 
  type: TermType; 
}

export type ThemeName = "matrix" | "ubuntu" | "arch";

export interface Theme {
  bg: string;
  fg: string;
  muted: string;
  accent: string;
  cursor: string;
}

export interface Commands {
  [key: string]: string;
}
