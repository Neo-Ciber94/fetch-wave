"use server";
import mime from "mime";

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
