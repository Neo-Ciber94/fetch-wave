export type SupportedMediaType = "audio" | "video" | "image";

export interface MediaSearchResult {
  originUrl: string;
  type: SupportedMediaType;
  data: Blob;
}
