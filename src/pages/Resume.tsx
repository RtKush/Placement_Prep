import { useState, useRef } from 'react';
import { FileUser, Plus, Eye, Trash2, Upload, Link as LinkIcon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/EmptyState';
import { PDFViewer } from '@/components/PDFViewer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PDFResource } from '@/types/workspace';
import { cn } from '@/lib/utils';

export default function Resume() {
  const [pdfs, setPdfs] = useLocalStorage<PDFResource[]>('pdfResources', []);
  const [primaryResumeId, setPrimaryResumeId] = useLocalStorage<string | null>('primaryResumeId', null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<PDFResource | null>(null);
  const [formData, setFormData] = useState({ name: '', url: '' });
  const [uploadTab, setUploadTab] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resumes = pdfs.filter(pdf => pdf.category === 'resume');
  const primaryResume = resumes.find(r => r.id === primaryResumeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPdf: PDFResource = {
      id: Date.now().toString(),
      name: formData.name,
      category: 'resume',
      url: formData.url,
      createdAt: new Date().toISOString()
    };
    setPdfs(prev => [...prev, newPdf]);
    
    // If first resume, set as primary
    if (resumes.length === 0) {
      setPrimaryResumeId(newPdf.id);
    }
    
    resetForm();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newPdf: PDFResource = {
        id: Date.now().toString(),
        name: formData.name || file.name.replace('.pdf', ''),
        category: 'resume',
        url: reader.result as string,
        createdAt: new Date().toISOString()
      };
      setPdfs(prev => [...prev, newPdf]);
      
      if (resumes.length === 0) {
        setPrimaryResumeId(newPdf.id);
      }
      
      resetForm();
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({ name: '', url: '' });
    setDialogOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleView = (pdf: PDFResource) => {
    setSelectedPdf(pdf);
    setViewerOpen(true);
  };

  const handleDelete = (id: string) => {
    const pdf = pdfs.find(p => p.id === id);
    const name = pdf?.name || 'this resume';
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setPdfs(prev => prev.filter(pdf => pdf.id !== id));
    if (primaryResumeId === id) {
      const remaining = resumes.filter(r => r.id !== id);
      setPrimaryResumeId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleSetPrimary = (id: string) => {
    setPrimaryResumeId(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Resume</h1>
          <p className="text-muted-foreground mt-1">
            Keep your latest resume ready and accessible
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Resume
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Resume</DialogTitle>
            </DialogHeader>
            
            <Tabs value={uploadTab} onValueChange={(v) => setUploadTab(v as 'url' | 'file')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="url" className="gap-2">
                  <LinkIcon className="w-4 h-4" />
                  URL
                </TabsTrigger>
                <TabsTrigger value="file" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="url">
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Resume Version</Label>
                    <Input
                      id="name"
                      placeholder="e.g., SDE Resume v2, FAANG Resume"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">Resume URL</Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://drive.google.com/..."
                      value={formData.url}
                      onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="ghost" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Resume</Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="file">
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="fileName">Resume Version (Optional)</Label>
                    <Input
                      id="fileName"
                      placeholder="e.g., SDE Resume v2"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div 
                    className={cn(
                      "border-2 border-dashed border-border rounded-xl p-8",
                      "flex flex-col items-center justify-center gap-3",
                      "hover:border-primary/50 transition-colors cursor-pointer"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-10 h-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground text-center">
                      Click to upload or drag and drop<br />
                      <span className="text-xs">PDF files only</span>
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Primary Resume Card */}
      {primaryResume && (
        <div className="p-6 rounded-2xl gradient-amber border border-amber/30 shadow-soft animate-fade-in">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground/80 mb-3">
            <Star className="w-4 h-4 fill-current" />
            Primary Resume
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-card flex items-center justify-center shadow-card">
                <FileUser className="w-7 h-7 text-foreground/80" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{primaryResume.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Last updated {new Date(primaryResume.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Button onClick={() => handleView(primaryResume)} className="gap-2">
              <Eye className="w-4 h-4" />
              View
            </Button>
          </div>
        </div>
      )}

      {/* All Resumes */}
      {resumes.length === 0 ? (
        <EmptyState
          icon={FileUser}
          title="No resume uploaded yet"
          description="Upload different versions of your resume for different roles"
          actionLabel="Add Your Resume"
          onAction={() => setDialogOpen(true)}
          gradient="gradient-amber"
        />
      ) : (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">All Resumes ({resumes.length})</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map((resume, index) => (
              <div
                key={resume.id}
                className={cn(
                  "group relative p-5 rounded-2xl bg-card border border-border",
                  "card-hover shadow-card animate-fade-in",
                  resume.id === primaryResumeId && "ring-2 ring-primary/30"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl gradient-amber flex items-center justify-center shrink-0">
                    <FileUser className="w-6 h-6 text-foreground/80" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{resume.name}</h3>
                      {resume.id === primaryResumeId && (
                        <Star className="w-4 h-4 text-primary fill-current shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(resume.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => handleView(resume)}
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  {resume.id !== primaryResumeId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSetPrimary(resume.id)}
                      title="Set as primary"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <PDFViewer
          open={viewerOpen}
          onClose={() => {
            setViewerOpen(false);
            setSelectedPdf(null);
          }}
          url={selectedPdf.url}
          title={selectedPdf.name}
        />
      )}

      {/* native confirm used for deletions */}
    </div>
  );
}
