export interface SchoolInfo {
  _id?: string;
  address: string;
  phone: string;
  email: string;
  board: string;
  type: string;
  established: string;
  timings: string;
  logoUrl: string;
  logoPublicId?: string;
  heroDescription: string;
  announcementBadge?: string;
  announcementText?: string;
  showAnnouncement?: boolean;
}

export interface SchoolStats {
  _id?: string;
  students: string;
  teachers: string;
  years: string;
  classes: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  qualification: string;
  experience?: string;
  bio?: string;
  email?: string;
  photoUrl: string;
  photoPublicId?: string;
  order: number;
  isActive: boolean;
}

export interface MediaItem {
  _id: string;
  url: string;
  publicId?: string;
  caption: string;
  type: 'image' | 'video';
  order: number;
  createdAt?: string;
}

export interface SchoolNotice {
  _id: string;
  title: string;
  content: string;
  date: string;
  isActive: boolean;
}

export interface AdmissionEnquiry {
  _id: string;
  parentName: string;
  phone: string;
  email?: string;
  studentGrade: string;
  message?: string;
  status: 'new' | 'contacted';
  createdAt: string;
}

export interface FeeItem {
  _id: string;
  className: string;
  tuitionFee: string;
  admissionFee: string;
  examFee: string;
  otherFee: string;
  totalFee: string;
  installment?: string;
}

export interface AdmissionApplication {
  _id: string;
  studentName: string;
  fatherName: string;
  motherName?: string;
  dob: string;
  gender: string;
  grade: string;
  phone: string;
  email?: string;
  address: string;
  prevSchool?: string;
  status: 'pending' | 'approved' | 'rejected' | 'contacted';
  submittedAt: string;
  remarks?: string;
}

export interface StudentItem {
  _id: string;
  name: string;
  rollNo: string;
  grade: string;
  section: string;
  gender: string;
  fatherName: string;
  phone: string;
  dob?: string;
  bloodGroup?: string;
  performance?: string;
  achievements?: string;
}

export interface AdmissionConfig {
  sessionYear: string;
  isOpen: boolean;
  badgeText: string;
  headline: string;
  subheadline: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  requiredDocuments: string[];
  officeTimings: string;
  helplinePhone: string;
}

export interface FeeConfig {
  sessionYear: string;
  headline: string;
  subheadline: string;
  quarterlyDesc: string;
  siblingConcession: string;
  siblingDesc: string;
  scholarshipInfo: string;
  scholarshipDesc: string;
  zeroHiddenDesc: string;
}

export interface StudentConfig {
  headline?: string;
  subheadline?: string;
  boardPassRate: string;
  boardPassSub?: string;
  boardPassLabel?: string;
  medalsCount?: string;
  medalsWon?: string;
  medalsSub?: string;
  medalsLabel?: string;
  distinctionRate: string;
  distinctionSub?: string;
  distinctionLabel?: string;
  enrolledCount?: string;
  enrolledStudents?: string;
  enrolledSub?: string;
  enrolledLabel?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

