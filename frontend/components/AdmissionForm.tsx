'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Send, 
  CheckCircle, 
  Sparkles, 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  School, 
  AlertCircle,
  FileCheck2,
  Clock,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { submitAdmissionApplication } from '@/lib/api';

const CLASS_OPTIONS = [
  'Nursery',
  'LKG',
  'UKG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11 (Science)',
  'Class 11 (Commerce)',
  'Class 11 (Arts)',
  'Class 12 (Science)',
  'Class 12 (Commerce)',
  'Class 12 (Arts)',
];

const REQUIRED_DOCUMENTS = [
  'Original Birth Certificate (for Nursery to Class 1)',
  'Transfer Certificate (TC) from previous recognised school',
  'Previous Academic Report Card / Marksheet',
  '4 Recent Passport Size Photographs of Student',
  '2 Photographs each of Mother & Father / Guardian',
  'Aadhar Card copies of Student and Parents',
];

export default function AdmissionForm() {
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: 'Male',
    grade: 'Class 1',
    phone: '',
    email: '',
    address: '',
    prevSchool: '',
    remarks: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.fatherName.trim() || !formData.phone.trim()) {
      setErrorMsg('Please fill in Student Name, Father Name, and Contact Number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await submitAdmissionApplication({
        studentName: formData.studentName,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        dob: formData.dob || '2018-01-01',
        gender: formData.gender,
        grade: formData.grade,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        prevSchool: formData.prevSchool,
        remarks: formData.remarks,
      });

      if (res.success && res.data) {
        setSubmittedAppId(res.data._id);
        // Reset form
        setFormData({
          studentName: '',
          fatherName: '',
          motherName: '',
          dob: '',
          gender: 'Male',
          grade: 'Class 1',
          phone: '',
          email: '',
          address: '',
          prevSchool: '',
          remarks: '',
        });
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Something went wrong while submitting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="admission" className="relative py-24 bg-[#070b14] border-t border-white/5 overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-4 h-4" />
            Session 2025–26
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Online Admission <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
              Registration Portal
            </span>
          </h2>
          <p className="mt-4 text-slate-400 text-base sm:text-lg">
            Take the first step toward a transformative educational journey. Complete the digital form below to reserve an entrance interaction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Guidelines & Documents Required */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <FileCheck2 className="w-5 h-5 text-cyan-400" />
                <span>Admission Process & Checklist</span>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Admissions for Nursery through Class 12 are granted on a first-come, first-served basis subject to seat availability and basic interaction.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-cyan-500/10 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="text-white text-sm font-semibold">Online Submission</h5>
                    <p className="text-slate-400 text-xs mt-0.5">Fill and submit this digital application form.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-cyan-500/10 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="text-white text-sm font-semibold">Verification & Interaction</h5>
                    <p className="text-slate-400 text-xs mt-0.5">Our admissions team contacts you within 24 hours with an interaction slot.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-cyan-500/10 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="text-white text-sm font-semibold">Seat Confirmation</h5>
                    <p className="text-slate-400 text-xs mt-0.5">Document submission and fee installment payment at the school office.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-white font-semibold text-sm mb-3">Documents Needed at Verification:</h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {REQUIRED_DOCUMENTS.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-3">
                <Clock className="w-5 h-5 shrink-0" />
                <span>Office Hours: Monday to Saturday, 8:00 AM – 2:00 PM</span>
              </div>
            </div>
          </div>

          {/* Right Column: Admission Application Form */}
          <div className="lg:col-span-7">
            {submittedAppId ? (
              <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-emerald-500/30 text-center space-y-6 animate-fade-in shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Application Submitted Successfully!
                </h3>
                <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
                  Thank you for applying to GD Public School. Your application has been logged into our school admissions registry.
                </p>
                <div className="inline-block px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-cyan-300 font-mono text-sm">
                  Application ID: <span className="font-bold text-white">{submittedAppId}</span>
                </div>
                <p className="text-xs text-slate-400">
                  Our admissions counseling counselor will call your registered contact number shortly. Please preserve this ID for correspondence.
                </p>
                <div className="pt-4 flex justify-center">
                  <button
                    onClick={() => setSubmittedAppId(null)}
                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-6 sm:p-10 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6"
              >
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">Student & Parent Details</h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">Please provide accurate information as per legal documents.</p>
                </div>

                {errorMsg && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Student Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Student Full Name <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Aarav Sharma"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Date of Birth <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Gender <span className="text-cyan-400">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/60 transition-all"
                    >
                      <option value="Male" className="bg-slate-900 text-white">Male</option>
                      <option value="Female" className="bg-slate-900 text-white">Female</option>
                      <option value="Other" className="bg-slate-900 text-white">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Applying for Class <span className="text-cyan-400">*</span>
                    </label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/60 transition-all"
                    >
                      {CLASS_OPTIONS.map((c) => (
                        <option key={c} value={c} className="bg-slate-900 text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Parent Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Father's Name <span className="text-cyan-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/60 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                      placeholder="e.g. Sunita Sharma"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/60 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Contact Phone / WhatsApp <span className="text-cyan-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/60 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="parent@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/60 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Previous School & City (If Any)
                    </label>
                    <div className="relative">
                      <School className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="prevSchool"
                        value={formData.prevSchool}
                        onChange={handleChange}
                        placeholder="e.g. St. Xavier Senior Secondary School"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/60 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Residential Address
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <textarea
                        name="address"
                        rows={2}
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House / Flat No., Landmark, Sector / Colony, City"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/60 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Any Special Note / Transportation Need
                    </label>
                    <textarea
                      name="remarks"
                      rows={2}
                      value={formData.remarks}
                      onChange={handleChange}
                      placeholder="e.g. Interested in school bus facility, sibling already studying in class 8th..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500/60 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting Registration...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Admission Application</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
