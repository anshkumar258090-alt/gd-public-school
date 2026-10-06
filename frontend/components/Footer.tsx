'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SchoolInfo } from '@/lib/types';
import { GraduationCap, ShieldCheck, MapPin, Phone, Mail, Heart } from 'lucide-react';

interface FooterProps {
  school: SchoolInfo;
}

export default function Footer({ school }: FooterProps) {
  return (
    <footer className="bg-[#050811] text-slate-300 pt-16 pb-10 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: School Identity */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/30 overflow-hidden">
                {school.logoUrl ? (
                  <Image
                    src={school.logoUrl}
                    alt="GD Public School"
                    fill
                    className="object-contain p-1"
                  />
                ) : (
                  <GraduationCap className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight">
                  GD <span className="text-sky-400">PUBLIC SCHOOL</span>
                </span>
                <p className="text-xs text-sky-400/90 font-medium">
                  {school.board || 'CBSE Affiliated'} • Co-Educational
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Committed to fostering an encouraging educational community where young minds acquire academic prowess, leadership values, and lifelong integrity.
            </p>

            <div className="pt-2 text-xs text-slate-500">
              <span>Affiliated to CBSE, New Delhi</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#hero" className="hover:text-sky-400 transition">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-sky-400 transition">About School</a>
              </li>
              <li>
                <a href="#leadership" className="hover:text-sky-400 transition">Leadership & Management</a>
              </li>
              <li>
                <a href="#facilities" className="hover:text-sky-400 transition">Campus Facilities</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-sky-400 transition">Media & Gallery</a>
              </li>
              <li>
                <a href="#notices" className="hover:text-sky-400 transition">Circulars & Notices</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-sky-400 transition">Admissions & Contact</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Summary */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">Campus Details</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{school.address || 'Main Campus, Sector 4, Civil Lines'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{school.phone || '+91 98765 43210'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{school.email || 'info@gdpublicschool.edu.in'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} GD Public School. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Designed for GD Public School</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
