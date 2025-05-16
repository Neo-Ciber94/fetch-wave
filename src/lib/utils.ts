import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getAudioDurationSeconds(blob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(URL.createObjectURL(blob));
    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
    });
    audio.addEventListener("error", (e) => {
      reject(e);
    });
  });
}

export function getVideoDurationSeconds(blob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(blob);
    video.addEventListener("loadedmetadata", () => {
      resolve(video.duration);
    });
    video.addEventListener("error", (e) => {
      reject(e);
    });
  });
}

export function getImageDimensions(
  blob: Blob
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = (e) => {
      reject(e);
    };
  });
}
