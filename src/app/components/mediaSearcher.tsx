"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MediaPlayer } from "./mediaPlayer";
import { searchMedia } from "../actions";
import { SupportedMediaType } from "@/lib/models";
import { useState } from "react";
import { mediaCollectionTab, saveMedia, useMediaPreview } from "@/lib/core";

export function MediaSearcher() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mediaPreview, setMediaPreview] = useMediaPreview();

  async function handleSearch(searchUrl: string) {
    setIsLoading(true);

    try {
      const result = await searchMedia(searchUrl);

      if (result.error) {
        alert(result.error);
        return;
      }

      if (result.success) {
        const blob = await result.data.pendingData;
        if (!blob) {
          alert("Failed to fetch the media");
          return;
        }

        const media = {
          data: blob,
          originUrl: searchUrl,
          type: result.data.type as SupportedMediaType,
        };

        saveMedia(media);
        setMediaPreview(media);
        mediaCollectionTab.set(media.type);
      } else {
        alert("Failed to fetch the media");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full">
      <h3 className="text-3xl font-bold mx-auto w-full">Search</h3>

      <MediaPlayer isLoading={isLoading} media={mediaPreview} />
      <div className="flex flex-row gap-4 w-full">
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
          placeholder="Write the URL of the audio, image or video"
        />
        <Button disabled={isLoading} onClick={() => handleSearch(url)}>
          Get it
        </Button>
      </div>
    </div>
  );
}
