'use client';

import React, { useState } from 'react';
import { FeeItem } from '@/lib/types';
import { 
  CreditCard, 
  CheckCircle2, 
  HelpCircle, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  BadgePercent, 
  ArrowRight,
  Calculator,
  CalendarDays
} from 'lucide-react';

interface FeeStructureProps {
  fees?: FeeItem[];
}

export default function FeeStructure({ fees = [] }: FeeStructureProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>(fees[0]?._id || '');

  const activeFee = fees.find((f) => f._id === selectedClassId) || fees[0];

  return (
    <section id="fees" className="relative py-24 bg-[#0a0f1d] border-t border-white/5 overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <CreditCard className="w-4 h-4" />
            Transparent Fee Structure
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Affordable Excellence, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
              No Hidden Charges
            </span>
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            We believe world-class education should be accessible. Explore our comprehensive, transparent fee breakdown for the academic session 2025–26.
          </p>
        </div>

        {/* Benefits & Value Proposition Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-3">
              <CalendarDays className="w-5 h-5" />
            </div>
            <h4 className="text-white font-semibold text-base">Quarterly Installments</h4>
            <p className="text-slate-400 text-sm mt-1">Convenient 4-installment plan across the academic calendar.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3">
              <BadgePercent className="w-5 h-5" />
            </div>
            <h4 className="text-white font-semibold text-base">15% Sibling Concession</h4>
            <p className="text-slate-400 text-sm mt-1">Tuition fee discount applied automatically for younger siblings.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-white font-semibold text-base">Merit Scholarships</h4>
            <p className="text-slate-400 text-sm mt-1">Up to 100% tuition waiver for outstanding sports & academic achievers.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-white font-semibold text-base">Zero Hidden Fees</h4>
            <p className="text-slate-400 text-sm mt-1">Includes digital classroom access, library, sports & basic lab amenities.</p>
          </div>
        </div>

        {/* Interactive Desktop Table & Mobile Cards */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>Class-Wise Fee Schedule (2025–26)</span>
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Select your student's grade band below for quick comparison.
              </p>
            </div>
            <a
              href="#admission"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Apply for Admission</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Class Filter Tabs */}
          {fees.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-6 pb-6">
              {fees.map((fee) => (
                <button
                  key={fee._id}
                  onClick={() => setSelectedClassId(fee._id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    (selectedClassId === fee._id || (!selectedClassId && fee._id === fees[0]._id))
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                      : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {fee.className}
                </button>
              ))}
            </div>
          )}

          {/* Desktop Full Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-4 font-semibold">Grade / Class</th>
                  <th className="py-4 px-4 font-semibold">One-time Admission</th>
                  <th className="py-4 px-4 font-semibold">Tuition (Monthly)</th>
                  <th className="py-4 px-4 font-semibold">Examination</th>
                  <th className="py-4 px-4 font-semibold">Activities / Lab</th>
                  <th className="py-4 px-4 font-semibold text-cyan-400">Total Approx / Year</th>
                  <th className="py-4 px-4 font-semibold text-right">Payment Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {fees.map((item) => {
                  const isSelected = selectedClassId === item._id;
                  return (
                    <tr
                      key={item._id}
                      onClick={() => setSelectedClassId(item._id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-cyan-500/10 font-medium' : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <td className="py-4 px-4 text-white font-bold flex items-center gap-2">
                        {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                        {item.className}
                      </td>
                      <td className="py-4 px-4 text-slate-300">{item.admissionFee || '₹5,000'}</td>
                      <td className="py-4 px-4 text-emerald-400 font-semibold">{item.tuitionFee || '₹2,000/mo'}</td>
                      <td className="py-4 px-4 text-slate-300">{item.examFee || '₹1,000/term'}</td>
                      <td className="py-4 px-4 text-slate-300">{item.otherFee || '₹1,500/yr'}</td>
                      <td className="py-4 px-4 text-cyan-300 font-bold">{item.totalFee || '₹30,000/yr'}</td>
                      <td className="py-4 px-4 text-right">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
                          {item.installment || 'Quarterly'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {fees.map((item) => (
              <div
                key={item._id}
                className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-bold text-lg">{item.className}</h4>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20">
                    {item.installment || 'Quarterly'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-white/5">
                  <div>
                    <span className="text-slate-400 text-xs block">Tuition Fee</span>
                    <span className="text-emerald-400 font-bold">{item.tuitionFee}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">Admission Fee</span>
                    <span className="text-slate-200">{item.admissionFee}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">Exam & Activity</span>
                    <span className="text-slate-300">{item.examFee} / {item.otherFee}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-xs block">Total Year Approx</span>
                    <span className="text-cyan-400 font-bold">{item.totalFee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Transport fee is optional and calculated based on route distance (0–15 km).</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#contact" className="hover:text-cyan-400 transition-colors">Fee Counseling Office: +91 98765 43210</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
