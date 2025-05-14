"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MediaPlayer } from "./mediaPlayer";
import { searchMedia } from "../actions";
import { MediaSearchResult, SupportedMediaType } from "@/lib/models";
import { useState } from "react";

export function MediaSearcher() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<MediaSearchResult | null>(
    null
  );

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

        setSearchResult({
          data: blob,
          originUrl: searchUrl,
          type: result.data.type as SupportedMediaType,
        });
      } else {
        alert("Failed to fetch the media");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full">
      <MediaPlayer isLoading={isLoading} media={searchResult} />
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
