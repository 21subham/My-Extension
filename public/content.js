function extractMedia() {
  let mediaUrls = [];

  const instagramImages = document.querySelectorAll("article img");
  instagramImages.forEach((img) => {
    if (img instanceof HTMLImageElement && img.src) {
      mediaUrls.push({ url: img.src, type: "image" });
    }
  });

  const instagramVideos = document.querySelectorAll("video");
  instagramVideos.forEach((video) => {
    if (video instanceof HTMLVideoElement && video.src) {
      mediaUrls.push({ url: video.src, type: "video" });
    }
  });

  const youtubeVideos = document.querySelectorAll("video");
  youtubeVideos.forEach((video) => {
    if (video instanceof HTMLVideoElement && video.src) {
      mediaUrls.push({ url: video.src, type: "video" });
    }
  });

  const youtubeImages = document.querySelectorAll("img");
  youtubeImages.forEach((img) => {
    if (img instanceof HTMLImageElement && img.src) {
      mediaUrls.push({ url: img.src, type: "image" });
    }
  });

  return mediaUrls;
}

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.action === "getMedia") {
    const mediaUrls = extractMedia();
    sendResponse({ mediaUrls });
  }
});
