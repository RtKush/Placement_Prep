export interface CodingProfile {
  id: string;
  name: string;
  platform: string;
  url: string;
  icon?: string;
  createdAt: string;
}


export interface DSAWebSheet {
  id: string;
  name: string;
  url: string;
  createdAt: string;
}
 
export interface PDFResource {
  id: string;
  name: string;
  category: 'dsa' | 'notes' | 'resume' | 'company' | 'other';
  subject?: string;
  url: string; // base64 data URL or external URL
  createdAt: string;
}

export interface InterviewExperience {
  id: string;
  company: string;
  role: string;
  // date: string;
  rounds: string;
  experience: string;
  result: 'selected' | 'rejected' | 'pending';
  tips?: string;
  createdAt: string;
}

// export interface Project {
//   id: string;
//   name: string;
//   description: string;
//   techStack: string[];
//   githubUrl?: string;
//   liveUrl?: string;
//   createdAt: string;
// }

export interface Project {
  id: string;
  name: string;
  techStack: string[];

  overview: string;
  flow: string;
  features: string;

  githubUrl?: string;
  liveUrl?: string;
  youtubeUrl?: string;

  qa?: {
    id: string;
    question: string;
    answer: string;
    imageUrl?: string;
  }[];

  createdAt: string;
}


export interface HRQuestion {
  id: string;
  question: string;
  answer: string;
  category: 'hr' | 'technical';
  createdAt: string;
}

export interface CompanyPrep {
  id: string;
  company: string;
  notes: string;
  resources: string[];
  createdAt: string;
}
