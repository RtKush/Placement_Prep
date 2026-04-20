
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Project } from '@/types/workspace';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Github, Youtube, ExternalLink, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function Projects() {
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', [
    {
      id: '1',
      name: 'Task Management App',
      techStack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
      overview:
        'This is a collaborative task management application built for teams. Users can create tasks, assign them to team members, track progress, and collaborate efficiently in real time.',
      flow:
        'Users sign in and create teams. Tasks are created and stored in PostgreSQL using Prisma ORM. Role-based access ensures only authorized users can modify tasks.',
      features:
        'Team collaboration, task assignment, role-based access control, real-time updates, clean UI.',
      githubUrl: 'https://github.com/username/taskapp',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [techStack, setTechStack] = useState('');
  const [overview, setOverview] = useState('');
  const [flow, setFlow] = useState('');
  const [features, setFeatures] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [qaItems, setQaItems] = useState<{
    id: string;
    question: string;
    answer: string;
    imageUrl?: string;
  }[]>([]);
  const [qaConfirmTarget, setQaConfirmTarget] = useState<{ id: string; label: string } | null>(null);
  

  function resetForm() {
    setName('');
    setTechStack('');
    setOverview('');
    setFlow('');
    setFeatures('');
    setGithubUrl('');
    setLiveUrl('');
    setYoutubeUrl('');
    setQaItems([]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newProject: Project = {
      id: String(Date.now()),
      name: name || 'Untitled Project',
      techStack: techStack
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      overview,
      flow,
      features,
      githubUrl: githubUrl || undefined,
      liveUrl: liveUrl || undefined,
      youtubeUrl: youtubeUrl || undefined,
      qa: qaItems.length ? qaItems.map((q) => ({
        id: q.id,
        question: q.question,
        answer: q.answer,
        imageUrl: q.imageUrl || undefined,
      })) : undefined,
      createdAt: new Date().toISOString(),
    };

    setProjects((prev) => [newProject, ...(prev || [])]);
    resetForm();
    setOpen(false);
  }

  function addQa() {
    setQaItems((prev) => [
      { id: String(Date.now()), question: '', answer: '', imageUrl: '' },
      ...prev,
    ]);
  }

  function removeQa(id: string) {
    const item = qaItems.find(p => p.id === id);
    const label = item?.question || 'this Q&A item';
    if (!confirm(`Remove "${label}" from this project?`)) return;
    setQaItems(prev => prev.filter(p => p.id !== id));
  }

  function moveUp(index: number) {
    if (index <= 0) return;
    setQaItems((prev) => {
      const next = [...prev];
      const tmp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = tmp;
      return next;
    });
  }

  function moveDown(index: number) {
    setQaItems((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      const tmp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = tmp;
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Projects</h1>
 
      <div className="flex items-center justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="default">Add Project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>Fill project details below.</DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              <div className="max-h-[70vh] overflow-auto pr-2">
                <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Project Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div>
                <label className="text-sm font-medium">Tech Stack (comma separated)</label>
                <Input value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="React, Node.js, MongoDB" />
              </div>

              <div>
                <label className="text-sm font-medium">Overview</label>
                <Textarea value={overview} onChange={(e) => setOverview(e.target.value)} />
              </div>

              <div>
                <label className="text-sm font-medium">Internal Flow</label>
                <Textarea value={flow} onChange={(e) => setFlow(e.target.value)} />
              </div>

              <div>
                <label className="text-sm font-medium">Key Features</label>
                <Textarea value={features} onChange={(e) => setFeatures(e.target.value)} />
              </div>

              <div>
                <label className="text-sm font-medium">GitHub URL</label>
                <Input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/username/repo" />
              </div>

              <div>
                <label className="text-sm font-medium">Live URL</label>
                <Input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://app.example.com" />
              </div>

              <div>
                <label className="text-sm font-medium">YouTube / Demo URL</label>
                <Input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://youtu.be/..." />
              </div>

              {/* ===== DYNAMIC Q&A ===== */}
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Q&A (optional)</label>
                  <div>
                    <Button type="button" size="sm" variant="secondary" onClick={addQa}>
                      <Plus size={14} /> Add Q&A
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 mt-3">
                  {qaItems.map((qa, idx) => (
                    <div key={qa.id} className="p-3 border rounded-lg bg-background/50">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <label className="text-xs font-medium">Question</label>
                          <Input value={qa.question} onChange={(e) => setQaItems((prev) => prev.map(p => p.id === qa.id ? { ...p, question: e.target.value } : p))} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="ghost" onClick={() => moveUp(idx)} title="Move up"><ArrowUp size={14} /></Button>
                          <Button size="sm" variant="ghost" onClick={() => moveDown(idx)} title="Move down"><ArrowDown size={14} /></Button>
                          <Button size="sm" variant="destructive" onClick={() => removeQa(qa.id)} title="Remove"><Trash2 size={14} /></Button>
                        </div>
                      </div>

                      <div className="mt-2">
                        <label className="text-xs font-medium">Answer</label>
                        <Textarea value={qa.answer} onChange={(e) => setQaItems((prev) => prev.map(p => p.id === qa.id ? { ...p, answer: e.target.value } : p))} />
                      </div>

                      <div className="mt-2">
                        <label className="text-xs font-medium">Image URL (optional)</label>
                        <Input value={qa.imageUrl} onChange={(e) => setQaItems((prev) => prev.map(p => p.id === qa.id ? { ...p, imageUrl: e.target.value } : p))} placeholder="https://.../image.png" />
                        {qa.imageUrl && (
                          <img src={qa.imageUrl} alt="qa" className="mt-2 max-h-48 rounded-md object-contain" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit">Add Project</Button>
                </div>
              </DialogFooter>
                </form>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* ===== PROJECT LEVEL ACCORDION ===== */}
      <Accordion type="single" collapsible className="space-y-4">
        {projects.map((project) => (
          <AccordionItem
            key={project.id}
            value={project.id}
            className="border rounded-xl px-4"
          >
            {/* PROJECT TITLE */}
            <AccordionTrigger className="py-4">
              <div className="w-full flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span className="text-lg font-semibold">{project.name}</span>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="text-xs px-2 py-1 rounded-full bg-muted">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                  <div className="flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!confirm(`Delete project "${project.name}"? This cannot be undone.`)) return;
                      setProjects((prev) => (prev || []).filter((p) => p.id !== project.id));
                    }}
                    className="inline-flex items-center gap-2 rounded-md px-3 py-1 text-sm font-medium bg-destructive text-destructive-foreground hover:opacity-90"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pb-4 space-y-4">
              {/* ===== Q&A ACCORDION ===== */}
              <Accordion type="multiple" className="space-y-2">

                {/* OVERVIEW */}
                <AccordionItem value="overview">
                  <AccordionTrigger className="text-sm font-medium">
                    What is this project about?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {project.overview}
                  </AccordionContent>
                </AccordionItem>

                {/* FLOW */}
                <AccordionItem value="flow">
                  <AccordionTrigger className="text-sm font-medium">
                    How does the application work internally?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {project.flow}
                  </AccordionContent>
                </AccordionItem>

                {/* FEATURES */}
                <AccordionItem value="features">
                  <AccordionTrigger className="text-sm font-medium">
                    What are the key features?
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {project.features}
                  </AccordionContent>
                </AccordionItem>

                {/* CUSTOM Q&A ITEMS */}
                {project.qa && project.qa.map((q) => (
                  <AccordionItem key={q.id} value={`qa-${q.id}`}>
                    <AccordionTrigger className="text-sm font-medium">{q.question || 'Q&A'}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      <div className="space-y-2">
                        <div>{q.answer}</div>
                        {q.imageUrl && (
                          // eslint-disable-next-line jsx-a11y/img-redundant-alt
                          <img src={q.imageUrl} alt="qa image" className="max-w-full rounded-md" />
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}

              </Accordion>

              {/* LINKS */}
              <div className="flex gap-4 pt-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    className="flex items-center gap-2 text-sm font-medium hover:underline"
                  >
                    <Github size={16} /> GitHub
                  </a>
                )}

                {project.youtubeUrl && (
                  <a
                    href={project.youtubeUrl}
                    target="_blank"
                    className="flex items-center gap-2 text-sm font-medium hover:underline"
                  >
                    <Youtube size={16} /> Demo
                  </a>
                )}

                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    className="flex items-center gap-2 text-sm font-medium hover:underline"
                  >
                    <ExternalLink size={16} /> Live
                  </a>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
        {/* Confirm dialogs for QA item removal and project deletion */}
        {/* native confirm used for deletions */}
    </div>
  );
}
