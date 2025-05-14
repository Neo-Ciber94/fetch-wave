"use client";

import {
  globalMediaPreview,
  loadSavedMedia,
  useSavedAudios,
  useSavedImages,
  useSavedVideos,
} from "@/lib/core";
import { MediaSearchResult } from "@/lib/models";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useEffect } from "react";
import { delay } from "@/lib/utils";

export function MediaCollection() {
  return (
    <div className="space-y-4">
      <h3 className="text-3xl font-bold mx-auto w-full">Collection</h3>

      <Tabs defaultValue="audios" className="w-full h-full">
        <TabsList className="w-full">
          <TabsTrigger value="audios">Audios</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="audios">
          <AudiosCollection />
        </TabsContent>

        <TabsContent value="videos">
          <VideosCollection />
        </TabsContent>

        <TabsContent value="images">
          <ImagesCollection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AudiosCollection() {
  const [audios] = useSavedAudios();
  const isLoading = audios == null;

  useEffect(() => {
    async function load() {
      try {
        await loadSavedMedia("audio");
        await delay(2000);
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

function VideosCollection() {
  const [videos] = useSavedVideos();
  const isLoading = videos == null;

  useEffect(() => {
    async function load() {
      try {
        await loadSavedMedia("video");
        await delay(2000);
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

function ImagesCollection() {
  const [images] = useSavedImages();
  const isLoading = images == null;

  useEffect(() => {
    async function load() {
      try {
        await loadSavedMedia("image");
        await delay(2000);
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

function MediaCard({ media }: { media: MediaSearchResult }) {
  return (
    <button
      className="flex flex-row gap-2 items-center bg-neutral-900 shadow p-2 border cursor-pointer hover:bg-neutral-700 hover:scale-105 transition-all"
      onClick={() => {
        globalMediaPreview.set(media);
      }}
    >
      <div className="size-20 text-pink-400">
        {media.type === "audio" ? (
          <AudioIcon />
        ) : media.type === "video" ? (
          <VideoIcon />
        ) : (
          <ImageIcon />
        )}
      </div>
      <div className="flex flex-col items-start gap-1  overflow-hidden">
        <h4 className="font-bold font-mono">
          {media.type.charAt(0).toUpperCase() + media.type.slice(1)}
        </h4>
        <p className="text-pink-300 font-mono text-ellipsis overflow-hidden whitespace-nowrap max-w-[600px]">
          {media.originUrl}
        </p>
      </div>
    </button>
  );
}

function AudioIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-20"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="m19.41 7.41l-4.83-4.83c-.37-.37-.88-.58-1.41-.58H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8.83c0-.53-.21-1.04-.59-1.42M15 13h-2v3.61c0 1.28-1 2.41-2.28 2.39a2.26 2.26 0 0 1-2.13-2.91c.21-.72.8-1.31 1.53-1.51c.7-.19 1.36-.05 1.88.29V12c0-.55.45-1 1-1h2c.55 0 1 .45 1 1s-.45 1-1 1m-1-4c-.55 0-1-.45-1-1V3.5L18.5 9z"
      ></path>
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-20"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M6.616 21q-.691 0-1.153-.462T5 19.385V4.615q0-.69.463-1.152T6.616 3h7.213q.323 0 .628.13t.522.349L18.52 7.02q.217.218.348.522t.131.628v11.214q0 .69-.463 1.153T17.385 21zM14 7.192q0 .349.23.578t.578.23H18l-4-4zM9.116 17.616h4q.251 0 .433-.182t.182-.434v-1.461l1.256.655q.211.106.4-.015t.19-.338V14.16q0-.218-.19-.339q-.189-.121-.4-.015l-1.256.656V13q0-.252-.182-.434t-.433-.182h-4q-.252 0-.434.182T8.5 13v4q0 .252.182.434t.433.181"
      ></path>
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-20"
      viewBox="0 0 36 36"
    >
      <path
        fill="currentColor"
        d="M32 4H4a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2M8.92 8a3 3 0 1 1-3 3a3 3 0 0 1 3-3M6 27v-4.1l6-6.08a1 1 0 0 1 1.41 0L16 19.35L8.32 27Zm24 0H11.15l6.23-6.23l5.4-5.4a1 1 0 0 1 1.41 0L30 21.18Z"
        className="clr-i-solid clr-i-solid-path-1"
      ></path>
      <path fill="none" d="M0 0h36v36H0z"></path>
    </svg>
  );
}
