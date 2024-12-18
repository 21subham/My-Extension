import React, { useState, useEffect } from "react";

// Define types for the media URLs
interface Media {
  url: string;
  type: "image" | "video";
  poster: string | undefined; // Make poster optional (string or undefined)
}

const App: React.FC = () => {
  const [mediaUrls, setMediaUrls] = useState<Media[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchMedia = () => {
      // Check if the chrome API is available (i.e., running in a Chrome/Brave extension)
      if (typeof chrome !== "undefined" && chrome.tabs && chrome.scripting) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          if (activeTab && activeTab.id) {
            chrome.scripting.executeScript(
              {
                target: { tabId: activeTab.id },
                func: getCurrentlyPlayingVideo,
              },
              (results) => {
                if (results && results[0].result) {
                  const mediaLinks = results[0].result as Media[];
                  if (mediaLinks.length > 0) {
                    setMediaUrls(mediaLinks);
                    setError("");
                  } else {
                    setError("No media found on this page.");
                  }
                } else {
                  setError("Error extracting media.");
                }
                setLoading(false);
              }
            );
          } else {
            setError("No active tab found.");
            setLoading(false);
          }
        });
      } else {
        // If chrome API is not available, inform the user that it's only available for Chrome/Brave extensions
        setError("This feature is only available in a Chrome/Brave extension.");
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const getCurrentlyPlayingVideo = (): Media[] => {
    let mediaUrls: Media[] = [];
    const pageUrl = window.location.href;

    if (pageUrl.includes("instagram.com") || pageUrl.includes("youtube.com")) {
      const videos = document.querySelectorAll("video");

      videos.forEach((video) => {
        if (video instanceof HTMLVideoElement && video.src && !video.paused) {
          const poster = video.poster || undefined;

          mediaUrls.push({ url: video.src, type: "video", poster });
        }
      });
    }

    return mediaUrls;
  };

  const downloadMedia = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch the media.");
      }

      const blob = await response.blob();

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;

      const filename = url.split("/").pop() || "media";
      const mp4Filename = filename.replace(/\.[^/.]+$/, "") + ".mp4"; // Ensure it ends with .mp4

      link.download = mp4Filename;
      link.click();

      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading media:", error);
      setError("Error downloading media.");
    }
  };

  return (
    <div className="p-4 w-72">
      <h2 className="text-xl text-center font-semibold mb-4">
        Media Downloader (Instagram & YouTube)
      </h2>
      {loading ? (
        <p className="text-center">Loading media...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div>
          {mediaUrls.length === 0 ? (
            <p className="text-center">No media found or playing video.</p>
          ) : (
            mediaUrls.map((media, index) => (
              <div key={index} className="media-item mb-4 text-center">
                {media.type === "video" && (
                  <div>
                    {media.poster && (
                      <div className="mb-2">
                        <img
                          src={media.poster}
                          alt={`Preview ${index}`}
                          className="w-full cursor-pointer"
                          onClick={() => {
                            const videoElement =
                              document.createElement("video");
                            videoElement.src = media.url;
                            videoElement.controls = true;
                            videoElement.autoplay = true;
                            document.body.appendChild(videoElement);
                          }}
                        />
                      </div>
                    )}
                    <video controls className="w-full mb-2">
                      <source src={media.url} type="video/mp4" />
                    </video>
                    <button
                      onClick={() => downloadMedia(media.url)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                      Download
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default App;
