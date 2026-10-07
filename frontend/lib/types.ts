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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
