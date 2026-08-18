// Centralized Media Configuration for Tarini Jewellers

export const jewelleryMedia = {
  hero: {
    // Premium lifestyle jewellery video for hero section
    videoDesktop: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // Replace with actual licensed URL
    videoMobile: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",  // Replace with cropped mobile version
    poster: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=80",
  },
  lifestyle: {
    // "The Art of Everyday Luxury" section video
    video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", // Replace with actual licensed URL
    poster: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80",
  },
  reels: [
    // Vertical videos for the "Follow Our Style" section
    {
      id: "reel-1",
      videoUrl: "/279397_large.mp4",
      poster: "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "reel-2",
      videoUrl: "/obkpo6sffg.mp4",
      poster: "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "reel-3",
      videoUrl: "/pinterest_video_2.mp4",
      poster: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "reel-4",
      videoUrl: "/pinterest_video.mp4",
      poster: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
    }
  ],
  collectionBanners: {
    // Optional videos for Collection pages
    "new-arrivals": {
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      poster: "https://images.unsplash.com/photo-1603974372039-adc49044b6bd?auto=format&fit=crop&w=1600&q=80"
    }
  }
};
