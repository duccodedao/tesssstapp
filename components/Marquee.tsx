
import React from 'react';

const images = [
  "https://images.unsplash.com/photo-1511285560982-1356c11d4606?w=600&q=80",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
  "https://images.unsplash.com/photo-1520390138845-fd2d229dd552?w=600&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
];

const Marquee: React.FC = () => {
  return (
    <div className="overflow-hidden whitespace-nowrap w-full border-y border-neutral-100 py-12 bg-white">
      <div className="animate-marquee inline-block">
        {[...images, ...images].map((img, idx) => (
          <img 
            key={idx} 
            src={img} 
            alt="Gallery" 
            className="inline-block h-64 w-auto object-cover mr-4 rounded-sm grayscale hover:grayscale-0 transition-all duration-700 cursor-crosshair" 
          />
        ))}
      </div>
    </div>
  );
};

export default Marquee;
