'use client';

import React from 'react';
import { SchoolInfo } from '@/lib/types';
import { 
  Target, 
  Eye, 
  Heart, 
  ShieldCheck, 
  Compass, 
  Award, 
  Check, 
  BookOpen,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AboutProps {
  school: SchoolInfo;
}

export default function About({ school }: AboutProps) {
  const highlights = [
    'Comprehensive CBSE Curriculum from Kindergarten to Grade 12',
    'Stress-free experiential learning and STEAM integration',
    'High standard of discipline, ethics, and moral character',
    'Modern digital classrooms with interactive flat panels',
    'Dedicated sports complexes for Football, Cricket, Badminton & Table Tennis',
    'Safe campus with 100% CCTV coverage and GPS-enabled school transport',
  ];

  return (
    <section id="about" className="py-20 md:py-28 bg-[#070b14] text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 text-xs font-bold tracking-wide uppercase mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            About GD Public School
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Nurturing Young Minds with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-300">
              Values & Excellence
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Established in {school.established || '2008'}, GD Public School is recognized for its commitment to academic distinction, creative exploration, and ethical character building.
          </p>
        </div>

        {/* 3 Pillars: Vision, Mission, Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Vision */}
          <div className="bg-[#0e1629]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/[0.08] hover:border-cyan-400/50 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">Our Vision</h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              To be a premier institution that inspires lifelong curiosity, fosters creative critical thinking, and prepares global citizens equipped with intellectual strength and compassion.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-gradient-to-br from-cyan-600 via-sky-600 to-indigo-700 text-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(6,182,212,0.25)] hover:scale-[1.02] transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Our Mission</h3>
            <p className="text-sky-100 leading-relaxed text-sm">
              To provide a safe, inclusive, and technologically advanced learning environment where each child discovers their unique talents and develops skills to thrive in an interconnected world.
            </p>
          </div>

          {/* Core Values */}
          <div className="bg-[#0e1629]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/[0.08] hover:border-cyan-400/50 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">Core Values</h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              Integrity, respect, perseverance, empathy, and service to society. We guide every student to act with honor and make a positive impact in the global community.
            </p>
          </div>
        </div>

        {/* Detailed School Info Grid */}
        <div className="bg-[#0c1324]/90 backdrop-blur-xl text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/[0.1] overflow-hidden relative">
          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Why Choose GDPS</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-2 mb-6 text-white">
                A Holistic Campus Designed for Complete Development
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                At GD Public School, education transcends textbooks. Through sports, cultural festivals, scientific symposiums, and leadership clubs, students acquire confidence and life skills that last a lifetime.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="mt-1 w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-cyan-400" />
                    </div>
                    <span className="text-xs sm:text-sm text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* School Profile Summary Card */}
            <div className="bg-white/[0.04] backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/[0.08] space-y-4">
              <h4 className="text-lg font-bold text-white border-b border-white/[0.08] pb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-400" />
                Institutional Affiliation & Profile
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-white/[0.05]">
                  <span className="text-slate-400">Board Affiliation:</span>
                  <span className="font-semibold text-white">{school.board || 'CBSE (New Delhi)'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.05]">
                  <span className="text-slate-400">School Level:</span>
                  <span className="font-semibold text-white">{school.type || 'K-12 English Medium'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.05]">
                  <span className="text-slate-400">Year Established:</span>
                  <span className="font-semibold text-white">{school.established || '2008'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/[0.05]">
                  <span className="text-slate-400">Campus Hours:</span>
                  <span className="font-semibold text-white">{school.timings || '08:00 AM - 02:00 PM'}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Student Medium:</span>
                  <span className="font-semibold text-white">English (Co-Educational)</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#contact"
                  className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] transition"
                >
                  <span>Schedule a Campus Visit</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
