'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SchoolInfo } from '@/lib/types';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Lock
} from 'lucide-react';

interface NavbarProps {
  school: SchoolInfo;
}

export default function Navbar({ school }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [showAnnounce, setShowAnnounce] = useState(true);

  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Leadership', href: '#leadership', id: 'leadership' },
    { label: 'Facilities', href: '#facilities', id: 'facilities' },
    { label: 'Gallery', href: '#gallery', id: 'gallery' },
    { label: 'Notices', href: '#notices', id: 'notices' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  // Detect scroll position and current active section for dynamic pill highlight
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sectionIds = ['hero', 'about', 'leadership', 'facilities', 'gallery', 'notices', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAnnounceActive = showAnnounce && school.showAnnouncement !== false;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-300">
      {/* 1. TOP SCROLLING ANNOUNCEMENT STRIP (Fully Visible, Never Covered) */}
      {isAnnounceActive && (
        <div className="pointer-events-auto w-full bg-[#050811]/95 backdrop-blur-md text-slate-300 text-xs py-1.5 px-3 border-b border-white/[0.08] relative z-50 shadow-sm overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Live Status Badge */}
            <div className="shrink-0 flex items-center gap-1.5 bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-cyan-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <Sparkles className="w-3 h-3 text-cyan-300" />
              <span className="uppercase tracking-wider">{school.announcementBadge || 'Admissions 2025–26'}</span>
            </div>

            {/* Continuous Marquee Ticker */}
            <div className="overflow-hidden whitespace-nowrap flex-1 relative hidden sm:block">
              <div className="animate-marquee flex items-center gap-8 text-[11px] text-slate-300">
                <span className="font-semibold text-white">
                  {school.announcementText || '🎉 Admissions Open for Session 2025–26 (Nursery to Class 12th)'}
                </span>
                <span className="text-slate-500">•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                  {school.board || 'CBSE Affiliated'} • {school.type || 'English Medium (K-12)'}
                </span>
                <span className="text-slate-500">•</span>
                {school.phone && (
                  <a href={`tel:${school.phone.split('/')[0].trim()}`} className="flex items-center gap-1 text-cyan-300 hover:text-white transition">
                    <Phone className="w-3 h-3" />
                    <span>Helpline: {school.phone}</span>
                  </a>
                )}
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">
                  Campus: {school.address || 'Civil Lines, Near City Center'}
                </span>

                {/* Duplicate for seamless infinite loop */}
                <span className="font-semibold text-white">
                  {school.announcementText || '🎉 Admissions Open for Session 2025–26 (Nursery to Class 12th)'}
                </span>
                <span className="text-slate-500">•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                  {school.board || 'CBSE Affiliated'} • {school.type || 'English Medium (K-12)'}
                </span>
              </div>
            </div>

            {/* Mobile simplified ticker */}
            <div className="sm:hidden flex-1 text-center truncate text-[11px] text-slate-300 font-medium">
              <span>{school.announcementText || school.announcementBadge || 'Admissions Open'}</span>
            </div>

            {/* Close Announcement */}
            <button 
              onClick={() => setShowAnnounce(false)}
              className="shrink-0 text-slate-400 hover:text-white text-xs p-1 rounded-full transition"
              title="Close announcement"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 2. FLOATING PILL NAVBAR (Floats below the announcement strip with clean spacing) */}
      <div className={`w-full flex justify-center px-3 sm:px-6 transition-all duration-300 ${isAnnounceActive ? 'pt-2.5 sm:pt-3' : 'pt-3 sm:pt-4'}`}>
        <div 
          className={`pointer-events-auto w-full max-w-6xl rounded-full transition-all duration-300 flex items-center justify-between px-3.5 sm:px-5 py-2 sm:py-2.5 shadow-2xl ${
            isScrolled
              ? 'bg-[#070b16]/95 backdrop-blur-2xl border border-white/[0.14] shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_25px_rgba(6,182,212,0.15)] py-2'
              : 'bg-[#090e1d]/85 backdrop-blur-xl border border-white/[0.10] shadow-[0_15px_40px_rgba(0,0,0,0.45),0_0_20px_rgba(56,189,248,0.1)]'
          }`}
        >
          {/* LEFT: Brand / Logo */}
          <Link href="#hero" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-600 p-[1.5px] shadow-[0_0_15px_rgba(56,189,248,0.4)] group-hover:shadow-[0_0_22px_rgba(6,182,212,0.7)] transition-all">
              <div className="w-full h-full rounded-full bg-[#090e1d] flex items-center justify-center overflow-hidden">
                {school.logoUrl ? (
                  <Image
                    src={school.logoUrl}
                    alt="GD Public School"
                    width={36}
                    height={36}
                    className="object-contain p-0.5"
                  />
                ) : (
                  <GraduationCap className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                GD <span className="text-cyan-400">PUBLIC SCHOOL</span>
              </span>
              <span className="text-[9px] font-semibold tracking-widest uppercase text-slate-400 group-hover:text-cyan-300/80 -mt-0.5 transition-colors hidden sm:block">
                Excellence in Education
              </span>
            </div>
          </Link>

          {/* CENTER: Navigation Capsule with Active Pill Indicator (Matches reference image) */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.04] border border-white/[0.09] rounded-full p-1 shadow-inner backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setActiveSection(link.id)}
                  className={`px-3.5 xl:px-4 py-1.5 text-xs xl:text-sm font-medium rounded-full transition-all duration-200 select-none ${
                    isActive
                      ? 'bg-white/[0.14] text-white border border-white/[0.22] shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_2px_8px_rgba(0,0,0,0.3)] font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* RIGHT: Glowing Neon CTA Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Glowing Gradient Pill CTA: Apply / Enquire */}
            <a
              href="#contact"
              className="relative group overflow-hidden px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:shadow-[0_0_32px_rgba(6,182,212,0.85)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <span>Enquire Now</span>
                <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-sky-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/[0.08] transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE FLOATING FROSTED DRAWER */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto px-3 sm:px-6 pt-2 lg:hidden">
          <div className="max-w-6xl mx-auto rounded-3xl bg-[#090e1d]/95 backdrop-blur-2xl border border-white/[0.12] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)] space-y-2 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => {
                      setActiveSection(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-between ${
                      isActive
                        ? 'bg-white/[0.12] text-white border border-white/[0.15]'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-cyan-400"></span>}
                  </a>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/[0.1] flex flex-col gap-2">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-full text-sm font-bold text-white bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 shadow-[0_0_20px_rgba(6,182,212,0.5)] transition"
              >
                Apply for Admission 2025–26
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
