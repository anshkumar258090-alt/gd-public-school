'use client';

import React from 'react';
import { 
  Monitor, 
  FlaskConical, 
  Cpu, 
  BookOpen, 
  Trophy, 
  Bus, 
  HeartPulse, 
  Palette,
  Sparkles 
} from 'lucide-react';

export default function Facilities() {
  const facilities = [
    {
      icon: Monitor,
      title: 'Smart Interactive Classrooms',
      description: 'Air-conditioned digital classrooms equipped with interactive smart panels, multimedia audio-visual aids, and ergonomic seating.',
      tag: 'Digital Learning',
    },
    {
      icon: FlaskConical,
      title: 'Composite Science Labs',
      description: 'Fully furnished, high-safety modern laboratories for Physics, Chemistry, and Biology facilitating hands-on experimentation.',
      tag: 'Practical STEAM',
    },
    {
      icon: Cpu,
      title: 'Next-Gen Computer & AI Lab',
      description: 'High-speed internet workstations with latest computing hardware teaching coding, robotics, logic, and artificial intelligence.',
      tag: 'Future Skills',
    },
    {
      icon: BookOpen,
      title: 'Rich Library & Reading Hall',
      description: 'Vast collection of over 8,000+ books, academic journals, national dailies, encyclopedia, and quiet reading zones.',
      tag: '8,000+ Books',
    },
    {
      icon: Trophy,
      title: 'Sports & Athletic Arena',
      description: 'Outdoor turf for Football and Cricket alongside indoor arenas for Badminton, Table Tennis, Yoga, and Martial Arts.',
      tag: 'Physical Health',
    },
    {
      icon: Bus,
      title: 'Safe Fleet of GPS Buses',
      description: 'Dedicated fleet of GPS-tracked school buses covering all major town routes with verified drivers and female attendants.',
      tag: 'Safety Verified',
    },
    {
      icon: HeartPulse,
      title: 'Medical Infirmary & First-Aid',
      description: 'On-campus health center with trained medical attendants, basic emergency care, and routine health check-up drives.',
      tag: 'Healthcare',
    },
    {
      icon: Palette,
      title: 'Performing Arts & Music Studio',
      description: 'Acoustically treated studio providing vocal, instrumental music training, classical dance, and fine art workshops.',
      tag: 'Creative Growth',
    },
  ];

  return (
    <section id="facilities" className="py-20 md:py-28 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle background ambient blobs */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 text-xs font-bold tracking-wide uppercase mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Infrastructure & Amenities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            World-Class Campus <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-300">Designed to Inspire</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Every inch of GD Public School is engineered to provide students with comfortable, inspiring, and technologically capable learning spaces.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <div
                key={idx}
                className="group p-6 rounded-3xl bg-[#0e1629]/80 hover:bg-[#121c33] border border-white/[0.08] hover:border-cyan-400/50 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 group-hover:bg-gradient-to-tr group-hover:from-cyan-400 group-hover:to-blue-600 text-cyan-400 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-cyan-500/20 group-hover:border-transparent">
                      <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/[0.06] text-cyan-300 border border-white/[0.08]">
                      {fac.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2.5">
                    {fac.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {fac.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
