import { 
  Code, FileText, BookOpen, MessageSquare, 
  Briefcase, FileUser, Building2, HelpCircle,
  Sparkles, Rocket
} from 'lucide-react';
import { CategoryCard } from '@/components/CategoryCard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CodingProfile, PDFResource, InterviewExperience, Project, HRQuestion, CompanyPrep } from '@/types/workspace';
import { Button } from '@/components/ui/button';
import {
  sampleCodingProfiles,
  samplePDFResources,
  sampleInterviewExperiences,
  sampleProjects,
  sampleHRQuestions,
  sampleCompanyPrep
} from '@/data/sampleData';

const categories = [
  {
    title: 'Coding Profiles',
    description: 'Store and access your LeetCode, GFG, CodeChef profiles',
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
    storageKey: 'pdfResources'
  },
  {
    title: 'Subject Notes',
    description: 'Subject-wise notes for technical interviews',
    icon: BookOpen,
    path: '/notes',
    gradient: 'gradient-lavender',
    storageKey: 'pdfResources'
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
    storageKey: 'pdfResources'
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

  const loadSampleData = () => {
    setCodingProfiles(sampleCodingProfiles);
    setPdfResources(samplePDFResources);
    setInterviews(sampleInterviewExperiences);
    setProjects(sampleProjects);
    setHrQuestions(sampleHRQuestions);
    setCompanyPrep(sampleCompanyPrep);
  };

  const getCounts = (key: string) => {
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
        
        {!hasData && (
          <Button 
            onClick={loadSampleData}
            className="mt-4 animate-slide-up gap-2"
            style={{ animationDelay: '150ms' }}
          >
            <Rocket className="w-4 h-4" />
            Load Sample Data
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
        {[
          { label: 'Profiles', value: codingProfiles.length, color: 'text-primary' },
          { label: 'PDFs', value: pdfResources.length, color: 'text-primary' },
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
