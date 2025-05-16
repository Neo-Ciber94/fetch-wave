import { useSavedAudios, loadSavedMedia } from "@/lib/core";
import { delay } from "@/lib/utils";
import { useEffect } from "react";
import { MediaCard } from "./mediaCard";

export function AudiosCollection() {
  const [audios] = useSavedAudios();
  const isLoading = audios == null;

  useEffect(() => {
    async function load() {
      try {
        await delay(1000);
        await loadSavedMedia("audio");
      } catch (error) {
        console.error("Failed to load saved audios", error);
        alert("Failed to load saved audios");
      }
    }

    load();
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse text-2xl font-bold text-center p-4">
        Loading Audios
      </div>
    );
  }

  if (audios.length === 0) {
    return (
      <div className="text-2xl font-bold text-center p-4">No Audios Found</div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {audios.map((media, index) => (
        <MediaCard key={index} media={media} />
      ))}
    </div>
  );
}
