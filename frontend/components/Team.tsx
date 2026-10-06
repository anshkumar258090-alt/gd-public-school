'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TeamMember } from '@/lib/types';
import { 
  UserCheck, 
  Sparkles, 
  Shield, 
  Camera, 
  Edit3, 
  GraduationCap, 
  Award, 
  Quote, 
  X, 
  Mail,
  ChevronRight
} from 'lucide-react';

interface TeamProps {
  team: TeamMember[];
}

export default function Team({ team }: TeamProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Sort team members by order
  const sortedTeam = [...team].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="leadership" className="py-20 md:py-28 bg-[#0a0f1d] text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 text-xs font-bold tracking-wide uppercase mb-3 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            School Leadership & Administration
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Guiding with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-300">
              Vision & Integrity
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Meet our esteemed leaders and educators who shape the strategic direction, moral foundation, and academic excellence of GD Public School.
          </p>
        </div>

        {/* Team Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedTeam.map((member) => (
            <div
              key={member._id}
              className="bg-[#0e1629]/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/[0.08] hover:border-cyan-400/50 shadow-xl hover:shadow-[0_20px_40px_rgba(6,182,212,0.18)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
            >
              {/* Photo Area */}
              <div className="relative aspect-[4/4.5] w-full bg-gradient-to-b from-slate-800 to-[#0c1222] flex items-center justify-center overflow-hidden border-b border-white/[0.08]">
                {member.photoUrl ? (
                  <Image
                    src={member.photoUrl}
                    alt={member.name || member.role}
                    fill
                    unoptimized
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  /* Blank Placeholder for Admin to upload photo */
                  <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 group-hover:text-cyan-400 transition-colors">
                    <div className="w-20 h-20 rounded-full bg-white/[0.06] border-2 border-dashed border-cyan-500/30 flex items-center justify-center shadow-sm mb-3">
                      <Camera className="w-8 h-8 text-cyan-400 animate-pulse" />
                    </div>
                    <span className="text-xs font-bold text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
                      Photo Blank
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1.5 font-medium">
                      Upload via Admin Panel
                    </span>
                  </div>
                )}

                {/* Role Pill on Photo */}
                <div className="absolute top-3 right-3 bg-[#070b16]/90 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-400/40 shadow-md text-xs font-bold text-cyan-300">
                  {member.role}
                </div>
              </div>

              {/* Details Area */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  {/* Name */}
                  <h3 className="text-lg font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors">
                    {member.name ? (
                      member.name
                    ) : (
                      <span className="text-slate-400 italic font-medium">
                        Name not set (Admin)
                      </span>
                    )}
                  </h3>

                  {/* Qualification Badge */}
                  <div className="flex items-start gap-1.5 text-xs text-slate-200 bg-white/[0.05] border border-white/[0.08] rounded-xl px-2.5 py-1.5">
                    <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="font-semibold line-clamp-1">
                      {member.qualification || 'Qualification to be updated'}
                    </span>
                  </div>

                  {/* Experience Badge (if provided) */}
                  {member.experience && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/15 border border-amber-500/30 rounded-xl px-2.5 py-1">
                      <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-medium text-[11px]">{member.experience}</span>
                    </div>
                  )}

                  {/* Bio / Message snippet */}
                  {member.bio ? (
                    <p className="text-xs text-slate-300 line-clamp-2 italic leading-relaxed pt-1">
                      &ldquo;{member.bio}&rdquo;
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic line-clamp-2 pt-1">
                      Brief bio, desk message & background can be added in Admin Panel.
                    </p>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
                  {member.bio ? (
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-0.5 text-xs transition"
                    >
                      <span>Read Bio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">
                      GDPS Board
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Member Bio Modal */}
        {selectedMember && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0e1629] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-white/[0.12] text-white animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {selectedMember.role} • Profile Details
                </span>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-slate-400 hover:text-white text-lg font-bold p-1 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl bg-slate-800 border border-white/[0.1] overflow-hidden flex items-center justify-center shrink-0">
                    {selectedMember.photoUrl ? (
                      <Image
                        src={selectedMember.photoUrl}
                        alt={selectedMember.name || selectedMember.role}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <Camera className="w-6 h-6 text-cyan-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {selectedMember.name || selectedMember.role}
                    </h3>
                    <p className="text-xs font-semibold text-cyan-400">
                      {selectedMember.role}
                    </p>
                    {selectedMember.qualification && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        {selectedMember.qualification}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-white/[0.04] p-4 rounded-2xl border border-white/[0.08]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase mb-2">
                    <Quote className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Message to Students & Parents</span>
                  </div>
                  <p className="text-sm text-slate-200 italic leading-relaxed">
                    &ldquo;{selectedMember.bio || 'Our focus is to cultivate future-ready citizens equipped with ethical groundedness, academic brilliance, and innovative thinking.'}&rdquo;
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex justify-end">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white font-semibold text-xs transition"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
