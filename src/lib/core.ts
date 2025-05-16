"use client";
import { MediaSearchResult, SupportedMediaType } from "./models";
import { shared } from "./shared";
import * as idb from "idb-keyval";

export const [globalMediaPreview, useMediaPreview] =
  shared<MediaSearchResult | null>(null);

export const [mediaCollectionTab, useMediaCollectionTab] =
  shared<SupportedMediaType>("audio");

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

export async function deleteSavedMedia(media: MediaSearchResult) {
  switch (media.type) {
    case "video":
      const currentVideos = savedVideos.get() ?? [];
      const newVideos = currentVideos.filter(
        (v) => v.originUrl !== media.originUrl
      );
      savedVideos.set(newVideos);
      await idb.set("myVideos", newVideos);
      break;
    case "audio":
      const currentAudios = savedAudios.get() ?? [];
      const newAudios = currentAudios.filter(
        (a) => a.originUrl !== media.originUrl
      );
      savedAudios.set(newAudios);
      await idb.set("myAudios", newAudios);
      break;
    case "image":
      const currentImages = savedImages.get() ?? [];
      const newImages = currentImages.filter(
        (i) => i.originUrl !== media.originUrl
      );
      savedImages.set(newImages);
      await idb.set("myImages", newImages);
      break;
  }
}
