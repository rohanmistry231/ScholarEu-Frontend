export interface University {
  _id: string; // Added by Mongoose automatically
  name: string;
  logo: string;
  location: string;
  country: string;
  accreditation: string;
  rating: number;
  tuitionFees: {
    undergraduate?: string; // Optional as per schema
    postgraduate?: string; // Optional as per schema
  };
  programs: string[];
  admissionRequirements: string[];
  scholarships: string[];
  description: string;
  campusLife: string;
  studentCount: number;
  establishedYear: number;
  facilities: string[];
  website: string;
  contactEmail: string;
  featured: boolean;
  createdAt: string; // Added by timestamps: true
  updatedAt: string; // Added by timestamps: true
  __v?: number; // Version key added by Mongoose (optional in frontend)
}

export interface Review {
  id: string;
  universityId: string;
  studentName: string;
  program: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
  profileImage: string;
}

export interface StudentAmbassador {
  _id: string;
  name: string;
  universityId: string;
  program: string;
  year: number;
  profileImage: string;
  about: string;
  contactInfo: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}