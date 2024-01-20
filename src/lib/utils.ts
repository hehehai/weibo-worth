import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { env } from "../../env.mjs"

export const ENV = env

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLinkFileName(url: string) {
  return url.split("/").pop()
}

// 下载图片
export function downloadFile(filename: string, dataUrl: string) {
  const element = document.createElement("a");
  element.setAttribute("href", dataUrl);
  element.setAttribute("download", filename);
  element.click();
  element.remove();
}
