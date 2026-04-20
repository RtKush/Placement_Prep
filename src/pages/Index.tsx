import { 
  Code, FileText, BookOpen, MessageSquare, 
  Briefcase, FileUser, Building2, HelpCircle,
  Sparkles
} from 'lucide-react';
import { CategoryCard } from '@/components/CategoryCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CodingProfile, PDFResource, InterviewExperience, Project, HRQuestion, CompanyPrep } from '@/types/workspace';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import {
  sampleCodingProfiles,
  samplePDFResources,
  sampleInterviewExperiences,
  sampleProjects,
  sampleHRQuestions,
  sampleTechnicalQnA,
  sampleCompanyPrep
} from '@/data/sampleData';

const categories = [
  {
    title: 'Coding Profiles',
    description: 'Add your coding profile and access your LeetCode, GFG, CodeChef profiles',
    icon: Code,
    path: '/coding-profiles',
    gradient: 'gradient-sage',
    storageKey: 'codingProfiles'
  },
  {
    title: 'DSA PDFs',
    description: 'Your collection of DSA sheets and problem sets',
    icon: FileText,
    path: '/dsa-pdfs',
    gradient: 'gradient-peach',
    storageKey: 'pdfResources:dsa'
  },
  {
    title: 'Subject Notes',
    description: 'Subject-wise notes for technical interviews',
    icon: BookOpen,
    path: '/notes',
    gradient: 'gradient-lavender',
    storageKey: 'pdfResources:notes'
  },
  {
    title: 'Interview Experiences',
    description: 'Document and learn from interview experiences',
    icon: MessageSquare,
    path: '/interviews',
    gradient: 'gradient-sky',
    storageKey: 'interviewExperiences'
  },
  {
    title: 'Projects',
    description: 'Showcase your best projects and tech stack',
    icon: Briefcase,
    path: '/projects',
    gradient: 'gradient-mint',
    storageKey: 'projects'
  },
  {
    title: 'Resume',
    description: 'Keep your latest resume ready and accessible',
    icon: FileUser,
    path: '/resume',
    gradient: 'gradient-amber',
    storageKey: 'pdfResources:resume'
  },
  {
    title: 'Company Prep',
    description: 'Company-specific preparation and resources',
    icon: Building2,
    path: '/company-prep',
    gradient: 'gradient-coral',
    storageKey: 'companyPrep'
  },
  {
    title: 'HR & Technical QnA',
    description: 'Common questions and best answers',
    icon: HelpCircle,
    path: '/hr-qna',
    gradient: 'gradient-rose',
    storageKey: 'hrQuestions'
  },
];

export default function Dashboard() {
  const [codingProfiles, setCodingProfiles] = useLocalStorage<CodingProfile[]>('codingProfiles', []);
  const [pdfResources, setPdfResources] = useLocalStorage<PDFResource[]>('pdfResources', []);
  const [interviews, setInterviews] = useLocalStorage<InterviewExperience[]>('interviewExperiences', []);
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
  const [hrQuestions, setHrQuestions] = useLocalStorage<HRQuestion[]>('hrQuestions', []);
  const [companyPrep, setCompanyPrep] = useLocalStorage<CompanyPrep[]>('companyPrep', []);

  const hasData = codingProfiles.length > 0 || pdfResources.length > 0 || interviews.length > 0 || 
                  projects.length > 0 || hrQuestions.length > 0 || companyPrep.length > 0;

  // DSA sheets are tracked under localStorage key 'dsa-sheets-progress'
  let dsaCount = 0;
  try {
    const raw = window.localStorage.getItem('dsa-sheets-progress');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) dsaCount = parsed.length;
    } else {
      // fallback to 3 (initial built-in sheets)
      dsaCount = 3;
    }
  } catch (e) {
    dsaCount = 3;
  }

  const loadSampleData = () => {
    const mergeById = <T extends { id?: string }>(existing: T[], incoming: T[]) => {
      const map = new Map<string, T>();
      (existing || []).forEach((it: T) => { if (it && (it as any).id) map.set((it as any).id, it); });
      (incoming || []).forEach((it: T) => {
        if (it && (it as any).id) {
          if (!map.has((it as any).id)) map.set((it as any).id, it);
        }
      });
      return Array.from(map.values());
    };

    setCodingProfiles(prev => mergeById(prev || [], sampleCodingProfiles));
    setPdfResources(prev => mergeById(prev || [], samplePDFResources));
    setInterviews(prev => mergeById(prev || [], sampleInterviewExperiences));
    setProjects(prev => mergeById(prev || [], sampleProjects));

    // merge HR and technical QnA into the hrQuestions storage (preserve user questions)
    const techItems = sampleTechnicalQnA.flatMap((section: any) => (
      (section.questions || []).map((q: any) => ({
        id: q.id || `tech-${Math.random().toString(36).slice(2, 9)}`,
        question: q.question,
        answer: q.answer,
        category: 'technical',
        createdAt: new Date().toISOString(),
      }))
    ));
    const sampleQuestionsCombined = [...sampleHRQuestions, ...techItems];
    setHrQuestions(prev => mergeById(prev || [], sampleQuestionsCombined));

    setCompanyPrep(prev => mergeById(prev || [], sampleCompanyPrep));

    try { window.localStorage.setItem('sampleDataLoaded', '1'); } catch (e) { /* ignore */ }
  };

  // Auto-load sample data on first mount if no user data exists
  useEffect(() => {
    let loaded = false;
    try {
      loaded = window.localStorage.getItem('sampleDataLoaded') === '1';
    } catch (e) {
      loaded = false;
    }
    if (loaded) return;
    if (!hasData) {
      loadSampleData();
    }
  }, []);

  const getCounts = (key: string) => {
    // support filtered pdf counts using 'pdfResources:<category>'
    if (key.startsWith('pdfResources:')) {
      const [, cat] = key.split(':');
      if (cat === 'dsa') {
        // DSA sheets are stored separately in localStorage under 'dsa-sheets-progress'
        try {
          const raw = window.localStorage.getItem('dsa-sheets-progress');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed.length;
          }
        } catch (e) {
          // ignore
        }
        return 3; // fallback to built-in sheets
      }
      return pdfResources.filter(p => p.category === cat).length;
    }

    switch (key) {
      case 'codingProfiles':
        return codingProfiles.length;
      case 'interviewExperiences':
        return interviews.length;
      case 'projects':
        return projects.length;
      case 'hrQuestions':
        return hrQuestions.length;
      case 'companyPrep':
        return companyPrep.length;
      case 'pdfResources':
        return pdfResources.length;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in">
          <Sparkles className="w-4 h-4" />
          Your Personal Placement Hub
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold animate-slide-up">
          My Placement Workspace
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
          Everything you need for your placement journey, organized in one beautiful space.
          Add resources, track progress, and ace your interviews.
        </p>
        
        {/* sample data loads automatically on first run; no manual load button */}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
        {[
          { label: 'Profiles', value: codingProfiles.length, color: 'text-primary' },
          { label: 'PDFs', value: pdfResources.length, color: 'text-primary' },
          { label: 'DSA Sheets', value: dsaCount, color: 'text-primary' },
          { label: 'Interviews', value: interviews.length, color: 'text-primary' },
          { label: 'Projects', value: projects.length, color: 'text-primary' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-4 border border-border text-center shadow-card">
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Category Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.path}
            {...category}
            count={getCounts(category.storageKey)}
            delay={index * 50}
          />
        ))}
      </div>
    </div>
  );
}
