import { useState } from 'react';
import { MessageSquare, Plus, Edit2, Trash2, CheckCircle, XCircle, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EmptyState } from '@/components/EmptyState';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { InterviewExperience } from '@/types/workspace';
import { cn } from '@/lib/utils';

const resultConfig = {
  selected: { icon: CheckCircle, label: 'Selected', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
  rejected: { icon: XCircle, label: 'Rejected', color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
  pending: { icon: Clock, label: 'Pending', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' }
};

const initialFormData: {
  company: string;
  role: string;
  // date: string;
  rounds: string;
  experience: string;
  result: 'selected' | 'rejected' | 'pending';
  tips: string;
} = {
  company: '',
  role: '',
  // date: '',
  rounds: '',
  experience: '',
  result: 'pending',
  tips: ''
};

export default function InterviewExperiences() {
  const [experiences, setExperiences] = useLocalStorage<InterviewExperience[]>('interviewExperiences', []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<InterviewExperience | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingExp) {
      setExperiences(prev => prev.map(exp => 
        exp.id === editingExp.id 
          ? { ...exp, ...formData }
          : exp
      ));
    } else {
      const newExp: InterviewExperience = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      setExperiences(prev => [newExp, ...prev]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingExp(null);
    setDialogOpen(false);
  };

  const handleEdit = (exp: InterviewExperience) => {
    setEditingExp(exp);
    setFormData({
      company: exp.company,
      role: exp.role,
      // date: exp.date,
      rounds: exp.rounds,
      experience: exp.experience,
      result: exp.result,
      tips: exp.tips || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const exp = experiences.find(e => e.id === id);
    const name = exp ? `${exp.company} — ${exp.role}` : 'this experience';
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setExperiences(prev => prev.filter(exp => exp.id !== id));
  };

  

  function formatDateShort(d?: string) {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) { return d; }
  }

  function buildShareMessage(exp: InterviewExperience) {
    const resultLabel = resultConfig[exp.result]?.label || exp.result;
    const lines: string[] = [];
    lines.push(`${exp.company} — ${exp.role}`);
    lines.push(`Result: ${resultLabel}`);
    // if (exp.date) lines.push(`Date: ${formatDateShort(exp.date)}`);
    if (exp.rounds) lines.push(`Rounds: ${exp.rounds}`);
    lines.push('');
    lines.push('Experience:');
    lines.push(exp.experience || '');
    if (exp.tips) {
      lines.push('');
      lines.push('Tips:');
      lines.push(exp.tips || '');
    }
    return lines.join('\n');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Interview Experiences</h1>
          <p className="text-muted-foreground mt-1">
            Document and learn from your interview journey
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => resetForm()}>
              <Plus className="w-4 h-4" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingExp ? 'Edit Experience' : 'Add Interview Experience'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="e.g., Google, Microsoft"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    placeholder="e.g., SDE Intern, SWE"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {/* <div className="space-y-2">
                  <Label htmlFor="date">Interview Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div> */}
                <div className="space-y-2">
                  <Label htmlFor="rounds">Rounds Attended</Label>
                  <Input
                    id="rounds"
                    placeholder="e.g., OA + 2 Tech + HR"
                    value={formData.rounds}
                    onChange={(e) => setFormData(prev => ({ ...prev, rounds: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="result">Result</Label>
                <Select
                  value={formData.result}
                  onValueChange={(value: 'selected' | 'rejected' | 'pending') => 
                    setFormData(prev => ({ ...prev, result: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="selected">✅ Selected</SelectItem>
                    <SelectItem value="rejected">❌ Rejected</SelectItem>
                    <SelectItem value="pending">⏳ Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Interview Experience</Label>
                <Textarea
                  id="experience"
                  placeholder="Describe your interview experience in detail..."
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  className="min-h-[150px]"
                  required
                />

                {/* Formalize feature removed as requested */}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tips">Tips for Others (Optional)</Label>
                <Textarea
                  id="tips"
                  placeholder="Any tips you'd give to someone preparing for this..."
                  value={formData.tips}
                  onChange={(e) => setFormData(prev => ({ ...prev, tips: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingExp ? 'Save Changes' : 'Add Experience'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Experiences List */}
      {experiences.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No interview experiences yet"
          description="Document your interview experiences to track your progress and help yourself review"
          actionLabel="Add Your First Experience"
          onAction={() => setDialogOpen(true)}
          gradient="gradient-lavender"
        />
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, index) => {
            const result = resultConfig[exp.result];
            const ResultIcon = result.icon;
            const isExpanded = expandedId === exp.id;
            
            return (
              <div
                key={exp.id}
                className={cn(
                  "group rounded-2xl bg-card border border-border overflow-hidden",
                  "card-hover shadow-card animate-fade-in"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Header */}
                <div 
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{exp.company}</h3>
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
                          result.bg, result.color
                        )}>
                          <ResultIcon className="w-3.5 h-3.5" />
                          {result.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span>{exp.role}</span>
                        
                        {/* <span>{new Date(exp.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}</span> */}
                        <span>•</span>
                        <span>{exp.rounds}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation();
                        const msg = buildShareMessage(exp);
                        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
                        window.open(url, '_blank');
                      }} title="Share on WhatsApp">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 text-emerald-400">
                          <path fill="currentColor" d="M20.52 3.48A11.9 11.9 0 0 0 12 0C5.37 0 .01 5.36.01 12c0 2.11.55 4.18 1.6 6.02L0 24l6.18-1.59A11.94 11.94 0 0 0 12 24c6.63 0 12-5.36 12-12 0-3.2-1.25-6.2-3.48-8.52zM12 21.5c-1.57 0-3.09-.39-4.44-1.13l-.32-.18-3.67.94.98-3.58-.21-.36A9.45 9.45 0 0 1 2.5 12C2.5 7 6.5 3 11.5 3c2.56 0 4.96.99 6.77 2.8A9.53 9.53 0 0 1 21.5 12c0 5-4 9.5-9.5 9.5z" />
                          <path fill="currentColor" d="M17.5 14.5c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.95 1.18-.17.2-.34.22-.63.07-.28-.15-1.18-.43-2.25-1.39-.83-.74-1.39-1.66-1.55-1.94-.17-.28-.02-.43.12-.58.12-.12.28-.31.42-.46.14-.15.18-.25.28-.42.09-.17.04-.33-.02-.46-.07-.12-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.19 0-.5.07-.76.33-.26.26-1 1-1 2.44s1.03 2.84 1.17 3.04c.15.2 2.03 3.1 4.92 4.35 1.16.5 2.06.8 2.77 1.02 1.16.36 2.22.31 3.06.19.93-.14 2.86-1.17 3.26-2.29.4-1.12.4-2.09.28-2.29-.12-.2-.43-.31-.73-.46z" />
                        </svg>
                      </Button>

                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation();
                        const subject = `Interview Experience - ${exp.company || ''} (${exp.role || ''})`;
                        const body = buildShareMessage(exp);
                        const mail = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                        window.location.href = mail;
                      }} title="Share via Email">
                        <Mail className="w-4 h-4" />
                      </Button>

                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(exp); }}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      {/* publish feature removed */}
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(exp.id); }}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-border animate-fade-in">
                    <div className="pt-4 space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Experience</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">{exp.experience}</p>
                      </div>
                      {exp.tips && (
                        <div className="p-4 rounded-xl gradient-mint">
                          <h4 className="font-medium mb-2">💡 Tips</h4>
                          <p className="text-muted-foreground whitespace-pre-wrap">{exp.tips}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
