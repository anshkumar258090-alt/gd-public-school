'use client';

import React, { useState } from 'react';
import { StudentItem } from '@/lib/types';
import { 
  GraduationCap, 
  Trophy, 
  Search, 
  Star, 
  Award, 
  Medal, 
  Users, 
  BookOpen, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface StudentsSectionProps {
  students?: StudentItem[];
}

export default function StudentsSection({ students = [] }: StudentsSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');

  // Grades available for filtering
  const grades = ['All', ...Array.from(new Set(students.map((s) => s.grade)))];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.achievements && student.achievements.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesGrade = selectedGrade === 'All' || student.grade === selectedGrade;

    return matchesSearch && matchesGrade;
  });

  return (
    <section id="students" className="relative py-24 bg-[#0a0f1d] border-t border-white/5 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Trophy className="w-4 h-4 text-amber-400" />
            Student Excellence & Directory
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Our Proud Achievers & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-cyan-400">
              Student Community
            </span>
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Empowering every student to discover their true brilliance across academics, leadership, sports, and creative arts.
          </p>
        </div>

        {/* Highlights Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-400">100%</span>
            <p className="text-slate-300 text-sm font-semibold mt-1">CBSE Board Pass Rate</p>
            <p className="text-slate-500 text-xs mt-0.5">Consecutive 5 Years</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-cyan-400">45+</span>
            <p className="text-slate-300 text-sm font-semibold mt-1">State & National Medals</p>
            <p className="text-slate-500 text-xs mt-0.5">Olympiads & Sports</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400">95%+</span>
            <p className="text-slate-300 text-sm font-semibold mt-1">Distinction Scorers</p>
            <p className="text-slate-500 text-xs mt-0.5">Board Examination</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-purple-400">1,500+</span>
            <p className="text-slate-300 text-sm font-semibold mt-1">Enrolled Scholars</p>
            <p className="text-slate-500 text-xs mt-0.5">Pre-Nursery to 12th</p>
          </div>
        </div>

        {/* Search & Student Directory Container */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-cyan-400" />
                <span>Student Spotlight & Verification Directory</span>
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Lookup enrolled students, toppers, house representatives, and academic honors.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, roll no..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500/60 transition-all"
              />
            </div>
          </div>

          {/* Grade Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-6 pb-6">
            <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Grade:
            </span>
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedGrade === grade
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>

          {/* Student Cards Grid */}
          {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredStudents.map((student) => (
                <div
                  key={student._id}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-all group flex flex-col justify-between"
                >
                  <div>
                    {/* Header with Avatar and Roll */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-300 text-base group-hover:scale-105 transition-transform">
                        {student.name.charAt(0)}
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300">
                        {student.rollNo}
                      </span>
                    </div>

                    <h4 className="text-white font-bold text-base group-hover:text-cyan-300 transition-colors">
                      {student.name}
                    </h4>

                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <span>{student.grade}</span>
                      <span>•</span>
                      <span>Sec {student.section}</span>
                    </div>

                    {student.performance && (
                      <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
                        <Award className="w-3.5 h-3.5" />
                        <span>{student.performance}</span>
                      </div>
                    )}

                    {student.achievements && (
                      <p className="mt-2 text-xs text-slate-400 leading-relaxed line-clamp-2">
                        🌟 {student.achievements}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Parent: {student.fatherName}</span>
                    <span className="text-emerald-400 font-medium">Verified Active</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              <p>No student records match your query.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGrade('All');
                }}
                className="mt-3 text-cyan-400 hover:underline text-xs"
              >
                Clear search filters
              </button>
            </div>
          )}

          {/* School Houses System Card */}
          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-blue-900/20 via-slate-900/40 to-cyan-900/20 border border-white/10">
            <h4 className="text-white font-bold text-base mb-2 flex items-center gap-2">
              <Medal className="w-5 h-5 text-amber-400" />
              <span>Inter-House Student Development System</span>
            </h4>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
              Students at GD Public School are sorted into four dynamic houses fostering team spirit, healthy competition, debate, and athletic championship.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
                🔴 Ganga House (Valor)
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300">
                🔵 Yamuna House (Wisdom)
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                🟢 Kaveri House (Harmony)
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                🟡 Narmada House (Integrity)
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
