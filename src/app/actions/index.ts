"use server";
import mime from "mime";

const DEFAULT_MAX_SIZE_MB = 100; // 100mb
const MAX_MEDIA_SIZE_MB = process.env.MAX_MEDIA_SIZE_MB;

export async function searchMedia(url: string) {
  const res = await fetch(url, {
    method: "HEAD",
  });

  if (!res.ok) {
    return {
      error: "Failed to fetch the media",
    };
  }

  let mediaType = getMediaType(res.headers);

  if (!mediaType) {
    mediaType = tryGuestContentTypeFromUrl(url);
  }

  if (!mediaType) {
    return {
      error: "Unsupported media type only audio, video and image are supported",
    };
  }

  const responseBodySizeInBytes = getResponseSizeInBytes(res.headers);

  if (MAX_MEDIA_SIZE_MB !== "ignore") {
    if (responseBodySizeInBytes == null) {
      return {
        error: "Failed to get the media size",
      };
    }

    if (!isMediaSizeValid(responseBodySizeInBytes)) {
      const maxSize = MAX_MEDIA_SIZE_MB || DEFAULT_MAX_SIZE_MB;
      return {
        error: `Media size is too large. Max size is ${maxSize}mb`,
      };
    }
  }

  const pendingData = fetchBlobData(url);

  return {
    success: true,
    data: {
      url,
      type: mediaType,
      pendingData,
    },
  };
}

async function fetchBlobData(url: string) {
  const res = await fetch(url, {
    method: "GET",
  });

  if (!res.ok) {
    return null;
  }

  const blob = await res.blob();
  if (!blob) {
    return null;
  }

  return blob;
}

function getMediaType(headers: Headers) {
  const contentType = headers.get("content-type");

  if (!contentType) {
    return null;
  }

  return getMediaTypeFromContentType(contentType);
}

function tryGuestContentTypeFromUrl(url: string) {
  const contentType = mime.getType(url);

  if (!contentType) {
    return null;
  }

  return getMediaTypeFromContentType(contentType);
}

function getMediaTypeFromContentType(contentType: string) {
  if (contentType.startsWith("audio/")) {
    return "audio";
  } else if (contentType.startsWith("video/")) {
    return "video";
  } else if (contentType.startsWith("image/")) {
    return "image";
  }

  return null;
}

function getResponseSizeInBytes(headers: Headers) {
  const contentLength = headers.get("content-length");

  if (!contentLength) {
    return null;
  }

  const sizeBytes = parseInt(contentLength, 10);

  if (isNaN(sizeBytes)) {
    return null;
  }

  return sizeBytes;
}

function isMediaSizeValid(sizeBytes: number) {
  const mediaMaxSizeMb = getMaxSizeMb();

  if (!mediaMaxSizeMb) {
    return true;
  }

  const maxSizeBytes = mediaMaxSizeMb * 1024 * 1024;
  return sizeBytes <= maxSizeBytes;
}

function getMaxSizeMb() {
  if (MAX_MEDIA_SIZE_MB === "ignore") {
    return null;
  }

  if (!MAX_MEDIA_SIZE_MB) {
    return DEFAULT_MAX_SIZE_MB;
  }

  const mediaMaxSizeMb = parseInt(MAX_MEDIA_SIZE_MB, 10);
  return mediaMaxSizeMb;
}
