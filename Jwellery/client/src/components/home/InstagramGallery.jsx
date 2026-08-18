import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const INSTAGRAM_POSTS = [
  { 
    type: 'image', 
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    type: 'image', 
    url: 'https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    type: 'video', 
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    poster: 'https://images.unsplash.com/photo-1573408301185-9519f94815b6?auto=format&fit=crop&q=80&w=800'
  },
  { 
    type: 'image', 
    url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    type: 'image', 
    url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    type: 'image', 
    url: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80&w=800' 
  },
];

export default function InstagramGallery() {
  return (
    <section className="py-16 bg-[#FDFBF7] overflow-hidden">
      <div className="text-center mb-8">
        <p className="text-[#C7A56A] text-[10px] tracking-widest uppercase mb-2">Follow Our Journey</p>
        <h2 className="text-3xl text-[#5C1D24] font-normal" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          @tarinijewellers
        </h2>
      </div>

      <div className="relative w-full overflow-hidden flex group">
        {/* We use a w-max container with animate-marquee. We render the list twice to create a seamless infinite loop */}
        <div className="flex animate-marquee min-w-max">
          {[...INSTAGRAM_POSTS, ...INSTAGRAM_POSTS].map((post, idx) => (
            <div 
              key={idx} 
              className="relative w-64 md:w-80 aspect-[4/5] bg-[#FAF8F5] flex-shrink-0 mx-1 overflow-hidden"
            >
              {post.type === 'image' ? (
                <img
                  src={post.url}
                  alt="Instagram post"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <video
                    src={post.url}
                    poster={post.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 z-10 opacity-80 drop-shadow-md">
                    <Play size={20} fill="white" className="text-white" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
