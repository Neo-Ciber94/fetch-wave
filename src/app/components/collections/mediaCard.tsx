import { Button } from "@/components/ui/button";
import { deleteSavedMedia, globalMediaPreview } from "@/lib/core";
import { MediaSearchResult } from "@/lib/models";
import {
  cn,
  getAudioDurationSeconds,
  getImageDimensions,
  getVideoDurationSeconds,
} from "@/lib/utils";
import { useEffect, useState } from "react";

export function MediaCard({ media }: { media: MediaSearchResult }) {
  return (
    <button className="flex flex-row gap-2 items-center bg-neutral-900 shadow p-2 border hover:border-pink-300 rounded-sm hover:bg-neutral-700 transition-all">
      <div
        className="flex flex-row items-center w-full cursor-pointer gap-3"
        onClick={() => {
          globalMediaPreview.set(media);
        }}
      >
        <div className="size-20 text-pink-400">
          <PreviewThumbnail media={media} />
        </div>
        <div className="flex flex-col items-start gap-1 w-full overflow-hidden">
          <h4 className="font-mono space-x-1">
            <span className="font-bold">
              {media.type.charAt(0).toUpperCase() + media.type.slice(1)}
            </span>
            <MediaMetadata media={media} />
          </h4>

          <p className="text-pink-300 font-mono text-ellipsis overflow-hidden whitespace-nowrap max-w-[600px]">
            {media.originUrl}
          </p>
        </div>
      </div>

      <Button
        variant={"destructive"}
        className="flex-end cursor-pointer hover:bg-red-400"
        onClick={() => {
          const canDelete = confirm(
            "Are you sure you want to delete this media? This action cannot be undone."
          );

          if (canDelete) {
            deleteSavedMedia(media);
          }
        }}
      >
        {"Delete"}
      </Button>
    </button>
  );
}

function MediaMetadata({ media }: { media: MediaSearchResult }) {
  const [isLoading, setIsLoading] = useState(true);
  const [metadataText, setMetadataText] = useState("");

  useEffect(() => {
    async function loadMetadata() {
      switch (media.type) {
        case "audio":
          const audioDurationSeconds = await getAudioDurationSeconds(
            media.data
          );

          const durationText = secondsToMMSS(audioDurationSeconds);
          setMetadataText(durationText);
          break;
        case "video":
          const videoDurationSeconds = await getVideoDurationSeconds(
            media.data
          );
          const videoDurationText = secondsToMMSS(videoDurationSeconds);
          setMetadataText(videoDurationText);
          break;
        case "image":
          const imageDimensions = await getImageDimensions(media.data);
          const imageWidth = imageDimensions.width;
          const imageHeight = imageDimensions.height;
          setMetadataText(`${imageWidth} x ${imageHeight}`);
          break;
        default:
          break;
      }
    }

    loadMetadata().finally(() => setIsLoading(false));
  }, [media.data, media.type]);

  return (
    <span
      className={cn(
        "text-pink-300 opacity-100 transition-opacity duration-300",
        isLoading && "opacity-0"
      )}
    >{`(${metadataText})`}</span>
  );
}

function secondsToMMSS(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

function PreviewThumbnail({ media }: { media: MediaSearchResult }) {
  switch (media.type) {
    case "audio":
      return <AudioIcon />;
    case "video":
      return <VideoIcon />;
    case "image":
    default:
      return <ImagePreview media={media} />;
  }
}

function ImagePreview({ media }: { media: MediaSearchResult }) {
  const [hasImage, setHasImage] = useState(true);

  if (!hasImage) {
    return <ImageIcon />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={media.originUrl}
      onError={() => {
        setHasImage(false);
      }}
      alt="Preview"
      className="rounded-sm w-20 h-20 object-cover border border-pink-200"
    />
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
