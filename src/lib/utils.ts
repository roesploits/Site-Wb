import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripMarkdown(text: string): string {
  if (!text) return "";
  return text
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // Bold
    .replace(/(\*|_)(.*?)\1/g, "$2") // Italic
    .replace(/~{2}(.*?)~{2}/g, "$1") // Strikethrough
    .replace(/`{3}[\s\S]*?`{3}/g, "") // Code blocks
    .replace(/`(.+?)`/g, "$1") // Inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
    .replace(/^#+\s+/gm, "") // Headings
    .replace(/^\s*[-*+]\s+/gm, "") // List items
    .replace(/^\s*>\s+/gm, "") // Blockquotes
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // Images
    .trim();
}
