import { CodingProfile, PDFResource, InterviewExperience, Project, HRQuestion, CompanyPrep } from '@/types/workspace';

export const sampleCodingProfiles: CodingProfile[] = [
  {
    id: '1',
    name: 'LeetCode Profile',
    platform: 'LeetCode',
    url: 'https://leetcode.com/u/RtLavKush7/',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'GeeksforGeeks Profile',
    platform: 'GeeksforGeeks',
    url: 'https://www.geeksforgeeks.org/profile/rtkush?tab=activity',
    createdAt: new Date().toISOString()
  },
  // {
  //   id: '3',
  //   name: 'CodeChef Profile',
  //   platform: 'CodeChef',
  //   url: 'https://www.codechef.com/users/username',
  //   createdAt: new Date().toISOString()
  // }
];

export const samplePDFResources: PDFResource[] = [
  {
    id: '1',
    name: 'Striver SDE Sheet',
    category: 'dsa',
    url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'DBMS Notes',
    category: 'notes',
    subject: 'Database Management',
    url: 'https://drive.google.com/file/d/171K_LbrOrUyGmduHEh3YM-JUdiOtw_Nk/view?usp=drive_link',
    createdAt: new Date().toISOString()
  },
 
  {
    id: '3',
    name: 'OS Concepts',
    category: 'notes',
    subject: 'Operating Systems',
    url: 'https://drive.google.com/file/d/1olCSvkTzRq56b6r5lZgBnGpH48z1PClW/view?usp=drive_link',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'My Resume',
    category: 'resume',
    url: 'https://drive.google.com/file/d/1LF4L09dTM1fH5u431BuFsNVGuNb7fu5p/view?usp=sharing',
    createdAt: new Date().toISOString()
  }
];

export const sampleInterviewExperiences: InterviewExperience[] = [
  {
    id: '1',
    company: 'Google',
    role: 'Software Engineer',
    date: '2024-01-15',
    rounds: '5 rounds - Phone Screen, 2 Technical, System Design, Behavioral',
    experience: 'Started with a phone screen focusing on basic DSA. The technical rounds covered graphs, dynamic programming, and tree problems. System design was about designing a URL shortener.',
    result: 'selected',
    tips: 'Practice system design, focus on communication',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    company: 'Microsoft',
    role: 'SDE Intern',
    date: '2024-02-20',
    rounds: '3 rounds - Online Assessment, Technical, HR',
    experience: 'Online assessment had 3 coding questions. Technical round covered arrays and strings. HR focused on behavioral questions.',
    result: 'pending',
    tips: 'Be clear with your approach before coding',
    createdAt: new Date().toISOString()
  }
];

export const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with user authentication, product management, and payment integration.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    githubUrl: 'https://github.com/username/ecommerce',
    liveUrl: 'https://myecommerce.com',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Task Management App',
    description: 'A collaborative task management application with real-time updates and team features.',
    techStack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    githubUrl: 'https://github.com/username/taskapp',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'ML Image Classifier',
    description: 'A machine learning project that classifies images using TensorFlow and deploys via Flask API.',
    techStack: ['Python', 'TensorFlow', 'Flask', 'Docker'],
    githubUrl: 'https://github.com/username/ml-classifier',
    createdAt: new Date().toISOString()
  }
];

export const sampleHRQuestions: HRQuestion[] = [
  {
    id: '1',
    question: 'Tell me about yourself',
    answer: 'I am a computer science student passionate about building scalable applications. I have experience in full-stack development and have worked on several projects including an e-commerce platform and a task management app.',
    category: 'hr',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    question: 'What is your greatest strength?',
    answer: 'My greatest strength is problem-solving. I enjoy breaking down complex problems into manageable parts and finding efficient solutions.',
    category: 'hr',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    question: 'Explain the difference between REST and GraphQL',
    answer: 'REST uses multiple endpoints for different resources with fixed data structures, while GraphQL uses a single endpoint where clients can request exactly the data they need, reducing over-fetching and under-fetching.',
    category: 'technical',
    createdAt: new Date().toISOString()
  }
];

export const sampleCompanyPrep: CompanyPrep[] = [
  {
    id: '1',
    company: 'Google',
    notes: 'Focus on algorithmic thinking, system design, and behavioral questions. Practice on LeetCode medium-hard problems.',
    resources: ['LeetCode Google tag', 'Grokking System Design', 'STAR method for behavioral'],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    company: 'Amazon',
    notes: 'Leadership principles are crucial. Prepare STAR stories for each principle. Focus on scalability in system design.',
    resources: ['Amazon Leadership Principles', 'LeetCode Amazon tag', 'System Design Primer'],
    createdAt: new Date().toISOString()
  }
];
