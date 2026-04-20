import { useState, useRef } from 'react';
import { BookOpen, Plus, Eye, Trash2, Upload, Link as LinkIcon } from 'lucide-react';
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

export default function Notes() {
  const [pdfs, setPdfs] = useLocalStorage<PDFResource[]>('pdfResources', []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<PDFResource | null>(null);
  const [formData, setFormData] = useState({ name: '', subject: '', url: '' });
  const [uploadTab, setUploadTab] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const notes = pdfs.filter(pdf => pdf.category === 'notes');
  const subjects = [...new Set(notes.map(n => n.subject).filter(Boolean))];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPdf: PDFResource = {
      id: Date.now().toString(),
      name: formData.name,
      category: 'notes',
      subject: formData.subject,
      url: formData.url,
      createdAt: new Date().toISOString()
    };
    setPdfs(prev => [...prev, newPdf]);
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
        category: 'notes',
        subject: formData.subject,
        url: reader.result as string,
        createdAt: new Date().toISOString()
      };
      setPdfs(prev => [...prev, newPdf]);
      resetForm();
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({ name: '', subject: '', url: '' });
    setDialogOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

 const handleView = (pdf: PDFResource) => {
  // Google Drive links → open in new tab
  if (pdf.url.includes('drive.google.com')) {
    window.open(pdf.url, '_blank');
    return;
  }

  // Non-drive PDFs → open in viewer
  setSelectedPdf(pdf);
  setViewerOpen(true);
};


  const handleDelete = (id: string) => {
    const pdf = pdfs.find(p => p.id === id);
    const name = pdf?.name || 'this note';
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setPdfs(prev => prev.filter(pdf => pdf.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Subject Notes</h1>
          <p className="text-muted-foreground mt-1">
            Subject-wise notes for technical interviews
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Notes
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Subject Notes</DialogTitle>
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
                    <Label htmlFor="name">Notes Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., DBMS Complete Notes"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="e.g., DBMS, OS, CN, OOPs"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      list="subjects"
                    />
                    <datalist id="subjects">
                      {subjects.map(s => <option key={s} value={s} />)}
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">PDF URL</Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com/notes.pdf"
                      value={formData.url}
                      onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="ghost" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Notes</Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="file">
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="fileName">Notes Name (Optional)</Label>
                    <Input
                      id="fileName"
                      placeholder="Leave blank to use file name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fileSubject">Subject</Label>
                    <Input
                      id="fileSubject"
                      placeholder="e.g., DBMS, OS, CN, OOPs"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
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

      {/* Subject Tags */}
      {subjects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subjects.map(subject => (
            <span 
              key={subject}
              className="px-3 py-1.5 rounded-full bg-lavender-light text-sm font-medium"
            >
              {subject}
            </span>
          ))}
        </div>
      )}

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No subject notes yet"
          description="Add your notes for DBMS, OS, CN, OOPs and more"
          actionLabel="Add Your First Notes"
          onAction={() => setDialogOpen(true)}
          gradient="gradient-lavender"
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((pdf, index) => (
            <div
              key={pdf.id}
              className={cn(
                "group relative p-5 rounded-2xl bg-card border border-border",
                "card-hover shadow-card animate-fade-in"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl gradient-lavender flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-foreground/80" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{pdf.name}</h3>
                  {pdf.subject && (
                    <span className="inline-block px-2 py-0.5 rounded-full bg-lavender-light text-xs mt-1">
                      {pdf.subject}
                    </span>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDelete(pdf.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              
              <Button
                variant="lavender"
                className="w-full gap-2"
                onClick={() => handleView(pdf)}
              >
                <Eye className="w-4 h-4" />
                View Notes
              </Button>
            </div>
          ))}
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
