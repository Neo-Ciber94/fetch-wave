"use client";
import { MediaSearchResult, SupportedMediaType } from "./models";
import { shared } from "./shared";
import * as idb from "idb-keyval";

export const [globalMediaPreview, useMediaPreview] =
  shared<MediaSearchResult | null>(null);
export const [savedVideos, useSavedVideos] = shared<MediaSearchResult[] | null>(
  null
);
export const [savedAudios, useSavedAudios] = shared<MediaSearchResult[] | null>(
  null
);
export const [savedImages, useSavedImages] = shared<MediaSearchResult[] | null>(
  null
);

export async function saveMedia(media: MediaSearchResult) {
  switch (media.type) {
    case "video":
      const currentVideos = savedVideos.get() ?? [];
      savedVideos.set([...currentVideos, media]);
      await idb.set("myVideos", [...currentVideos, media]);
      break;
    case "audio":
      const currentAudios = savedAudios.get() ?? [];
      savedAudios.set([...currentAudios, media]);
      await idb.set("myAudios", [...currentAudios, media]);
      break;
    case "image":
      const currentImages = savedImages.get() ?? [];
      savedImages.set([...currentImages, media]);
      await idb.set("myImages", [...currentImages, media]);
      break;
  }
}

export async function loadSavedMedia(type: SupportedMediaType) {
  switch (type) {
    case "video":
      const videos = await idb.get<MediaSearchResult[]>("myVideos");
      savedVideos.set(videos || []);
      break;
    case "audio":
      const audios = await idb.get<MediaSearchResult[]>("myAudios");
      savedAudios.set(audios || []);
      break;
    case "image":
      const images = await idb.get<MediaSearchResult[]>("myImages");
      savedImages.set(images || []);
      break;
  }
}
