import { useSavedImages, loadSavedMedia } from "@/lib/core";
import { delay } from "@/lib/utils";
import { useEffect } from "react";
import { MediaCard } from "./mediaCard";

export function ImagesCollection() {
  const [images] = useSavedImages();
  const isLoading = images == null;

  useEffect(() => {
    async function load() {
      try {
        await delay(1000);
        await loadSavedMedia("image");
      } catch (error) {
        console.error("Failed to load saved images", error);
        alert("Failed to load saved images");
      }
    }

    load();
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse text-2xl font-bold text-center p-4">
        Loading Images
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-2xl font-bold text-center p-4">No Images Found</div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {images.map((media, index) => (
        <MediaCard key={index} media={media} />
      ))}
    </div>
  );
}
