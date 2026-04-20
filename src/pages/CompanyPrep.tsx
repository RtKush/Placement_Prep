import { useState } from 'react';
import { Building2, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EmptyState } from '@/components/EmptyState';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CompanyPrep } from '@/types/workspace';
import { cn } from '@/lib/utils';

const initialFormData = {
  company: '',
  notes: '',
  resources: ''
};

export default function CompanyPrepPage() {
  const [preps, setPreps] = useLocalStorage<CompanyPrep[]>('companyPrep', []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrep, setEditingPrep] = useState<CompanyPrep | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedPrep, setSelectedPrep] = useState<CompanyPrep | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const resourcesArray = formData.resources.split('\n').map(r => r.trim()).filter(Boolean);
    
    if (editingPrep) {
      setPreps(prev => prev.map(p => 
        p.id === editingPrep.id 
          ? { ...p, company: formData.company, notes: formData.notes, resources: resourcesArray }
          : p
      ));
    } else {
      const newPrep: CompanyPrep = {
        id: Date.now().toString(),
        company: formData.company,
        notes: formData.notes,
        resources: resourcesArray,
        createdAt: new Date().toISOString()
      };
      setPreps(prev => [...prev, newPrep]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingPrep(null);
    setDialogOpen(false);
  };

  const handleEdit = (prep: CompanyPrep) => {
    setEditingPrep(prep);
    setFormData({
      company: prep.company,
      notes: prep.notes,
      resources: prep.resources.join('\n')
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const prep = preps.find(p => p.id === id);
    const name = prep?.company || 'this company prep';
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setPreps(prev => prev.filter(p => p.id !== id));
    // close viewer if it was open for this item
    if (selectedPrep?.id === id) {
      setViewerOpen(false);
      setSelectedPrep(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Company Prep</h1>
          <p className="text-muted-foreground mt-1">
            Company-specific preparation notes and resources
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => resetForm()}>
              <Plus className="w-4 h-4" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPrep ? 'Edit Company Prep' : 'Add Company Prep'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  placeholder="e.g., Google, Amazon, Microsoft"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Preparation Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Interview process, important topics, tips..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="min-h-[150px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resources">Resources (one per line)</Label>
                <Textarea
                  id="resources"
                  placeholder="https://leetcode.com/company/google/&#10;https://youtube.com/..."
                  value={formData.resources}
                  onChange={(e) => setFormData(prev => ({ ...prev, resources: e.target.value }))}
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPrep ? 'Save Changes' : 'Add Company'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Company Cards */}
      {preps.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No company prep yet"
          description="Add company-specific notes and resources for targeted preparation"
          actionLabel="Add Your First Company"
          onAction={() => setDialogOpen(true)}
          gradient="gradient-coral"
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {preps.map((prep, index) => (
            <div
              key={prep.id}
              className={cn(
                "group rounded-2xl bg-card border border-border overflow-hidden",
                "card-hover shadow-card animate-fade-in"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div 
                className="p-5 cursor-pointer"
                onClick={() => { setSelectedPrep(prep); setViewerOpen(true); }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-coral flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-foreground/80" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{prep.company}</h3>
                      <p className="text-sm text-muted-foreground">
                        {prep.resources.length} resource{prep.resources.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleEdit(prep); }}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(prep.id); }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

        {/* Viewer dialog for a selected company prep */}
        <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto animate-fade-in">
            <DialogHeader>
              <DialogTitle>{selectedPrep?.company}</DialogTitle>
            </DialogHeader>

            <div className="pt-2 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Notes</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{selectedPrep?.notes}</p>
              </div>

              {selectedPrep?.resources && selectedPrep.resources.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Resources</h4>
                  <div className="space-y-2 max-h-[40vh] overflow-auto">
                    {selectedPrep.resources.map((resource, i) => (
                      <a
                        key={i}
                        href={resource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-2 rounded-lg bg-muted hover:bg-accent text-sm break-words max-w-full transition-colors"
                      >
                        {resource}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="ghost" onClick={() => { setViewerOpen(false); setSelectedPrep(null); }}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* native confirm used for deletions */}
    </div>
  );
}
