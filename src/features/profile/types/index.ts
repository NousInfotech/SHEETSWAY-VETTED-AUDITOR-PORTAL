// Types extracted from profile page
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  specialization: string;
  joinDate: string;
}

export interface License {
  id: number;
  name: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  status: string;
  file: string;
}

export interface NewMember {
  name: string;
  role: string;
  email: string;
  phone: string;
  specialization: string;
}

export interface NewLicense {
  name: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  file: string | File | null;
} 