import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import './gallery.scss';

interface PhotoItem {
  id: number;
  url: string;
  title: string;
  credit: string;
}

export const PhotoGallery: React.FC = () => {
  const images: PhotoItem[] = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
      title: 'Midnight Street Circuits',
      credit: 'Apex Archives',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80',
      title: 'Aerodynamic Optimization Matrix',
      credit: 'Telemetry Lab',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1534349735944-2b3a6f7a2b24?auto=format&fit=crop&w=800&q=80',
      title: 'Podium Celebrations',
      credit: 'Championship Logs',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="f1-gallery rounded-xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur shadow-xl space-y-4 max-w-xl mx-auto">
      <div className="flex items-center gap-2">
        <Camera size={20} className="text-red-500" />
        <h2 className="text-lg font-bold text-slate-100">Live Track Snapshots</h2>
      </div>

      <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 group shadow-inner">
        <img
          src={images[currentIndex].url}
          alt={images[currentIndex].title}
          className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 p-4">
          <h3 className="text-sm font-bold text-slate-100">{images[currentIndex].title}</h3>
          <span className="text-xxs text-slate-400 font-medium tracking-wide uppercase">{images[currentIndex].credit}</span>
        </div>

        {/* Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-slate-950/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-slate-950/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 pt-1">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? 'w-4 bg-red-500' : 'w-1.5 bg-slate-700'}`}
          />
        ))}
      </div>
    </div>
  );
};
