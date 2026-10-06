'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SchoolNotice } from '@/lib/types';
import { Bell, Calendar, ChevronRight, FileText, Sparkles, ExternalLink, X } from 'lucide-react';

interface NoticesProps {
  notices: SchoolNotice[];
}

export default function Notices({ notices }: NoticesProps) {
  const [selectedNotice, setSelectedNotice] = useState<SchoolNotice | null>(null);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="notices" className="py-20 md:py-28 bg-[#0a0f1d] text-white relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 text-xs font-bold tracking-wide uppercase mb-3 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Bell className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
              Official Circulars & Updates
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              School{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-300">
                Notice Board
              </span>
            </h2>
            <p className="mt-2 text-base text-slate-300">
              Stay informed with recent school notifications, examination dates, and event schedules.
            </p>
          </div>
        </div>

        {/* Notices Cards List */}
        <div className="grid md:grid-cols-3 gap-6">
          {notices.map((notice, idx) => (
            <div
              key={notice._id || idx}
              onClick={() => setSelectedNotice(notice)}
              className="group p-6 rounded-3xl bg-[#0e1629]/80 backdrop-blur-xl hover:bg-[#121c33] border border-white/[0.08] hover:border-cyan-400/50 hover:shadow-[0_20px_40px_rgba(6,182,212,0.18)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    {formatDate(notice.date)}
                  </span>
                  {idx === 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                      Latest Circular
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-3">
                  {notice.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                  {notice.content}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                <span>Read Full Circular</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Notice Reader Modal */}
        {selectedNotice && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0e1629] text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/[0.12] animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  Official Circular • {formatDate(selectedNotice.date)}
                </span>
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  {selectedNotice.title}
                </h3>
                <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto pr-2">
                  {selectedNotice.content}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex justify-end">
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  Close Circular
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
