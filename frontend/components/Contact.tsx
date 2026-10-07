'use client';

import React, { useState } from 'react';
import { SchoolInfo } from '@/lib/types';
import { submitEnquiry } from '@/lib/api';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, Loader2, Sparkles } from 'lucide-react';

interface ContactProps {
  school: SchoolInfo;
}

export default function Contact({ school }: ContactProps) {
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
    studentGrade: 'Class 1',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitEnquiry(formData);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          parentName: '',
          phone: '',
          email: '',
          studentGrade: 'Class 1',
          message: '',
        });
      }, 5000);
    } catch (err) {
      console.error('Error submitting enquiry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#070b14] text-white relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-950/80 text-cyan-300 text-xs font-bold tracking-wide uppercase mb-3 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            Admissions & Enquiries
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Connect with Our{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-300">
              Admissions Desk
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Have questions regarding admissions, fee structure, or bus routes? Our counseling team is here to assist you.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0e1629]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-white/[0.08] pb-4">
                Campus Contact Information
              </h3>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campus Address</h4>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    {school.address || 'Knowledge City, Main Bypass Road, Civil Lines'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0 shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Numbers</h4>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    {school.phone || '+91 98765 43210'}
                  </p>
                  <span className="text-[11px] text-cyan-400/80">Available during school hours</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</h4>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    {school.email || 'admissions@gdpublicschool.edu.in'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0 shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">School Office Timings</h4>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    {school.timings || 'Mon - Sat: 08:00 AM - 02:00 PM'}
                  </p>
                  <span className="text-[11px] text-slate-400">Sunday Closed</span>
                </div>
              </div>
            </div>

            {/* Quick Map Preview Banner */}
            <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border border-cyan-500/30 text-white rounded-3xl p-6 sm:p-7 shadow-xl">
              <h4 className="font-bold text-base mb-1 text-white">Campus Visit Hours</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Parents are welcome for guided campus tours Monday through Saturday from 10:00 AM to 1:00 PM.
              </p>
              <div className="text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-xl inline-block text-cyan-300 border border-white/10">
                Prior appointment recommended
              </div>
            </div>
          </div>

          {/* Admission Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#0e1629]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-10 border border-white/[0.1] shadow-2xl">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Request Admission Information</h3>
              <p className="text-sm text-slate-300 mb-6">
                Fill out the quick form below and our counselor will call you within 24 hours.
              </p>

              {isSubmitted ? (
                <div className="p-8 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-3 animate-in fade-in">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-xl font-bold text-white">Enquiry Submitted Successfully!</h4>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Thank you for your interest in GD Public School. Our admissions coordinator will reach out to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Parent / Guardian Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.12] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Contact Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.12] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm transition"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="parent@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.12] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Grade Applying For *
                      </label>
                      <select
                        value={formData.studentGrade}
                        onChange={(e) => setFormData({ ...formData, studentGrade: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#0c1222] border border-white/[0.12] text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm transition"
                      >
                        <option value="Pre-Nursery">Pre-Nursery / Nursery</option>
                        <option value="KG / Prep">KG / Prep</option>
                        <option value="Class 1">Class 1st to 5th (Primary)</option>
                        <option value="Class 6">Class 6th to 8th (Middle)</option>
                        <option value="Class 9">Class 9th & 10th (Secondary)</option>
                        <option value="Class 11">Class 11th & 12th (Sr. Secondary)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Your Message or Specific Query
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please let us know if you require information about transportation, fees, or subjects..."
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.12] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_22px_rgba(6,182,212,0.45)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Admission Enquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
