'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MediaItem } from '@/lib/types';
import { 
  Images, 
  Video, 
  PlusCircle, 
  X, 
  Maximize2, 
  Sparkles,
  Camera
} from 'lucide-react';

interface MediaProps {
  mediaList: MediaItem[];
}

export default function Media({ mediaList }: MediaProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video'>('all');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Default demonstration campus photos if user hasn't uploaded photos yet
  const defaultShowcase = [
    {
      _id: 'sample-1',
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Main Academic Campus & Green Quadrangles',
      type: 'image' as const,
      order: 1,
    },
    {
      _id: 'sample-2',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      caption: 'Interactive Smart Classroom Session',
      type: 'image' as const,
      order: 2,
    },
    {
      _id: 'sample-3',
      url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
      caption: 'Modern STEAM & Composite Science Lab',
      type: 'image' as const,
      order: 3,
    },
    {
      _id: 'sample-4',
      url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
      caption: 'Campus Central Library & Resource Hub',
      type: 'image' as const,
      order: 4,
    },
    {
      _id: 'sample-5',
      url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      caption: 'Annual Sports Day & Athletics Championship',
      type: 'image' as const,
      order: 5,
    },
    {
      _id: 'sample-6',
      url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      caption: 'Cultural Fest & Performing Arts Stage',
      type: 'image' as const,
      order: 6,
    },
  ];

  const displayItems = mediaList && mediaList.length > 0 ? mediaList : defaultShowcase;

  const filteredItems = displayItems.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  return (
    <section id="gallery" className="py-20 md:py-28 bg-[#070b14] text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 text-xs font-bold tracking-wide uppercase mb-3 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            Moments & Campus Gallery
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Life at{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-300">
              GD Public School
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            A glimpse into the daily celebrations, sports meets, exhibitions, and vibrant student community.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <div className="flex items-center gap-1.5 bg-[#0e1629] p-1.5 rounded-full border border-white/[0.08] shadow-inner">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeFilter === 'all'
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              All Media ({displayItems.length})
            </button>
            <button
              onClick={() => setActiveFilter('image')}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeFilter === 'image'
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveFilter('video')}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeFilter === 'video'
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              Videos
            </button>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              onClick={() => setSelectedItem(item)}
              className="group relative rounded-3xl overflow-hidden bg-[#0e1629]/90 border border-white/[0.08] hover:border-cyan-400/50 shadow-xl hover:shadow-[0_20px_40px_rgba(6,182,212,0.18)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                {item.type === 'video' ? (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <Image
                    src={item.url}
                    alt={item.caption || 'Campus media'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                  <span className="text-white text-xs font-semibold flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                    Click to Enlarge
                  </span>
                </div>

                {/* Type badge */}
                <div className="absolute top-3 right-3">
                  {item.type === 'video' ? (
                    <span className="bg-rose-500/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Video className="w-3 h-3" /> Video
                    </span>
                  ) : (
                    <span className="bg-cyan-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Images className="w-3 h-3" /> Photo
                    </span>
                  )}
                </div>
              </div>

              {/* Caption */}
              <div className="p-4 bg-[#0e1629] flex-1 flex items-center justify-between border-t border-white/[0.05]">
                <p className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {item.caption || 'GD Public School Campus Moment'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center">
              <div className="relative w-full aspect-[16/10] max-h-[70vh] rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/[0.12]">
                {selectedItem.type === 'video' ? (
                  <video
                    src={selectedItem.url}
                    controls
                    autoPlay
                    className="max-h-full max-w-full"
                  />
                ) : (
                  <Image
                    src={selectedItem.url}
                    alt={selectedItem.caption || 'GDPS'}
                    fill
                    className="object-contain"
                  />
                )}
              </div>
              <p className="text-white text-center mt-4 text-sm sm:text-base font-semibold px-4">
                {selectedItem.caption || 'GD Public School Campus Life'}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
