import { useSavedVideos, loadSavedMedia } from "@/lib/core";
import { delay } from "@/lib/utils";
import { useEffect } from "react";
import { MediaCard } from "./mediaCard";

export function VideosCollection() {
  const [videos] = useSavedVideos();
  const isLoading = videos == null;

  useEffect(() => {
    async function load() {
      try {
        await delay(1000);
        await loadSavedMedia("video");
      } catch (error) {
        console.error("Failed to load saved videos", error);
        alert("Failed to load saved videos");
      }
    }

    load();
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse text-2xl font-bold text-center p-4">
        Loading Videos
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-2xl font-bold text-center p-4">No Videos Found</div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {videos.map((media, index) => (
        <MediaCard key={index} media={media} />
      ))}
    </div>
  );
}
