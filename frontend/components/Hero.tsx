'use client';

import React from 'react';
import { SchoolInfo, SchoolStats } from '@/lib/types';
import { 
  GraduationCap, 
  Users, 
  Award, 
  Calendar, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  Clock,
  PhoneCall,
  ShieldCheck,
  Star
} from 'lucide-react';

interface HeroProps {
  school: SchoolInfo;
  stats: SchoolStats;
}

export default function Hero({ school, stats }: HeroProps) {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white pt-28 sm:pt-36 pb-20 md:pb-28">
      {/* Aurora Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px]"></div>
        <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]"></div>
        <div className="absolute -bottom-20 left-1/3 w-[450px] h-[450px] bg-sky-500/10 rounded-full blur-[100px]"></div>
        
        {/* Subtle geometric dot grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.07]" 
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Admissions Open for Session 2025–26</span>
              <span className="hidden sm:inline text-cyan-500/60">•</span>
              <span className="hidden sm:inline text-xs text-slate-300">CBSE Affiliated</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
              Empowering Minds to{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-300 block sm:inline">
                Lead Tomorrow
              </span>
            </h1>

            {/* School Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {school.heroDescription ||
                'GD Public School is committed to creating a vibrant and caring educational environment where students realize their full intellectual, emotional, and physical potential with modern labs, sports, and holistic guidance.'}
            </p>

            {/* Feature Bullets Pill Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs sm:text-sm font-medium text-slate-200">
              <div className="flex items-center gap-2 bg-white/[0.06] backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>{school.board || 'CBSE Board (K-12)'}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.06] backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>{school.type || 'English Medium'}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.06] backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Est. {school.established || '2008'}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.06] backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>100% Board Pass Rate</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 hover:from-cyan-300 hover:via-sky-400 hover:to-indigo-500 text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Apply for Admission</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#facilities"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/[0.07] hover:bg-white/[0.12] text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full border border-white/15 backdrop-blur-md shadow-sm transition-all hover:border-white/30"
              >
                <span>Explore Campus & Labs</span>
              </a>
            </div>

            {/* Quick school location and timing preview */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate max-w-xs">{school.address || 'Civil Lines, Near City Center'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{school.timings || 'Mon - Sat: 8:00 AM - 2:00 PM'}</span>
              </span>
            </div>
          </div>

          {/* Right Column: Hero Visual Card with Highlights */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Decorative Glow Ring */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 opacity-30 blur-xl"></div>

              {/* Main Card with Glassmorphism */}
              <div className="relative z-10 bg-[#0d1424]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/[0.12]">
                
                {/* Header of Card */}
                <div className="flex items-center justify-between pb-5 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                      <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-lg">GD Public School</h3>
                      <p className="text-xs text-cyan-400 font-medium">Holistic Academic Excellence</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Verified
                  </span>
                </div>

                {/* Grid 2x2 Feature Highlights */}
                <div className="grid grid-cols-2 gap-3.5 py-6">
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-white/[0.07] transition-all group">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="text-xl font-black text-white">100%</div>
                    <div className="text-xs text-slate-400 font-medium">Board Results</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-white/[0.07] transition-all group">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="text-xl font-black text-white">Smart Labs</div>
                    <div className="text-xs text-slate-400 font-medium">AI & Robotics</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-white/[0.07] transition-all group">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="text-xl font-black text-white">20:1</div>
                    <div className="text-xs text-slate-400 font-medium">Student Ratio</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-white/[0.07] transition-all group">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="text-xl font-black text-white">Sports & Arts</div>
                    <div className="text-xs text-slate-400 font-medium">Holistic Arena</div>
                  </div>
                </div>

                {/* Quick Admission Notice card inside */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border border-cyan-500/30 text-white flex items-center justify-between shadow-md">
                  <div>
                    <div className="text-xs text-cyan-300 font-medium">Admissions Helpline</div>
                    <div className="text-sm font-bold text-white">
                      {school.phone ? school.phone.split('/')[0].trim() : '+91 98765 43210'}
                    </div>
                  </div>
                  <a
                    href="#contact"
                    className="px-3.5 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  >
                    <span>Connect</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Stats Strip with Dark Glass Luxury Design */}
        <div className="mt-16 sm:mt-20">
          <div className="bg-[#0b1120]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/[0.1] grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08]">
            
            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {stats.students || '1,500+'}
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-400">Active Students</div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {stats.teachers || '75+'}
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-400">Qualified Educators</div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {stats.years || '16+'}
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-400">Years of Legacy</div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {stats.classes || 'Nur to 12th'}
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-400">Academic Grades</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
