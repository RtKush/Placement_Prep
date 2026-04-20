// import { useState, useRef } from 'react';
// import { FileText, Plus, Eye, Trash2, Upload, Link as LinkIcon } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { EmptyState } from '@/components/EmptyState';
// import { PDFViewer } from '@/components/PDFViewer';
// import { useLocalStorage } from '@/hooks/useLocalStorage';
// import { PDFResource } from '@/types/workspace';
// import { cn } from '@/lib/utils';

// export default function DSAPDFs() {
//   const [pdfs, setPdfs] = useLocalStorage<PDFResource[]>('pdfResources', []);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [viewerOpen, setViewerOpen] = useState(false);
//   const [selectedPdf, setSelectedPdf] = useState<PDFResource | null>(null);
//   const [formData, setFormData] = useState({ name: '', url: '' });
//   const [uploadTab, setUploadTab] = useState<'url' | 'file'>('url');
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const dsaPdfs = pdfs.filter(pdf => pdf.category === 'dsa');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const newPdf: PDFResource = {
//       id: Date.now().toString(),
//       name: formData.name,
//       category: 'dsa',
//       url: formData.url,
//       createdAt: new Date().toISOString()
//     };
//     setPdfs(prev => [...prev, newPdf]);
//     resetForm();
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       const newPdf: PDFResource = {
//         id: Date.now().toString(),
//         name: formData.name || file.name.replace('.pdf', ''),
//         category: 'dsa',
//         url: reader.result as string,
//         createdAt: new Date().toISOString()
//       };
//       setPdfs(prev => [...prev, newPdf]);
//       resetForm();
//     };
//     reader.readAsDataURL(file);
//   };

//   const resetForm = () => {
//     setFormData({ name: '', url: '' });
//     setDialogOpen(false);
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   };

//   const handleView = (pdf: PDFResource) => {
//     setSelectedPdf(pdf);
//     setViewerOpen(true);
//   };

//   const handleDelete = (id: string) => {
//     setPdfs(prev => prev.filter(pdf => pdf.id !== id));
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold">DSA PDFs</h1>
//           <p className="text-muted-foreground mt-1">
//             Your collection of DSA sheets and problem sets
//           </p>
//         </div>
        
//         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//           <DialogTrigger asChild>
//             <Button className="gap-2">
//               <Plus className="w-4 h-4" />
//               Add PDF
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add DSA PDF</DialogTitle>
//             </DialogHeader>
            
//             <Tabs value={uploadTab} onValueChange={(v) => setUploadTab(v as 'url' | 'file')}>
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="url" className="gap-2">
//                   <LinkIcon className="w-4 h-4" />
//                   URL
//                 </TabsTrigger>
//                 <TabsTrigger value="file" className="gap-2">
//                   <Upload className="w-4 h-4" />
//                   Upload
//                 </TabsTrigger>
//               </TabsList>
              
//               <TabsContent value="url">
//                 <form onSubmit={handleSubmit} className="space-y-4 pt-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">PDF Name</Label>
//                     <Input
//                       id="name"
//                       placeholder="e.g., Striver's SDE Sheet"
//                       value={formData.name}
//                       onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//                       required
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="url">PDF URL</Label>
//                     <Input
//                       id="url"
//                       type="url"
//                       placeholder="https://example.com/dsa-sheet.pdf"
//                       value={formData.url}
//                       onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
//                       required
//                     />
//                   </div>
//                   <div className="flex gap-2 justify-end">
//                     <Button type="button" variant="ghost" onClick={resetForm}>
//                       Cancel
//                     </Button>
//                     <Button type="submit">Add PDF</Button>
//                   </div>
//                 </form>
//               </TabsContent>
              
//               <TabsContent value="file">
//                 <div className="space-y-4 pt-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="fileName">PDF Name (Optional)</Label>
//                     <Input
//                       id="fileName"
//                       placeholder="Leave blank to use file name"
//                       value={formData.name}
//                       onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//                     />
//                   </div>
//                   <div 
//                     className={cn(
//                       "border-2 border-dashed border-border rounded-xl p-8",
//                       "flex flex-col items-center justify-center gap-3",
//                       "hover:border-primary/50 transition-colors cursor-pointer"
//                     )}
//                     onClick={() => fileInputRef.current?.click()}
//                   >
//                     <Upload className="w-10 h-10 text-muted-foreground" />
//                     <p className="text-sm text-muted-foreground text-center">
//                       Click to upload or drag and drop<br />
//                       <span className="text-xs">PDF files only</span>
//                     </p>
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       accept=".pdf"
//                       className="hidden"
//                       onChange={handleFileUpload}
//                     />
//                   </div>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* PDFs Grid */}
//       {dsaPdfs.length === 0 ? (
//         <EmptyState
//           icon={FileText}
//           title="No DSA PDFs yet"
//           description="Add your favorite DSA sheets and problem sets for quick access"
//           actionLabel="Add Your First PDF"
//           onAction={() => setDialogOpen(true)}
//           gradient="gradient-peach"
//         />
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {dsaPdfs.map((pdf, index) => (
//             <div
//               key={pdf.id}
//               className={cn(
//                 "group relative p-5 rounded-2xl bg-card border border-border",
//                 "card-hover shadow-card animate-fade-in"
//               )}
//               style={{ animationDelay: `${index * 50}ms` }}
//             >
//               <div className="flex items-start gap-4 mb-4">
//                 <div className="w-12 h-12 rounded-xl gradient-peach flex items-center justify-center shrink-0">
//                   <FileText className="w-6 h-6 text-foreground/80" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="font-semibold truncate">{pdf.name}</h3>
//                   <p className="text-sm text-muted-foreground">
//                     Added {new Date(pdf.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
                
//                 <Button 
//                   variant="ghost" 
//                   size="icon"
//                   onClick={() => handleDelete(pdf.id)}
//                   className="opacity-0 group-hover:opacity-100 transition-opacity"
//                 >
//                   <Trash2 className="w-4 h-4 text-destructive" />
//                 </Button>
//               </div>
              
//               <Button
//                 variant="peach"
//                 className="w-full gap-2"
//                 onClick={() => handleView(pdf)}
//               >
//                 <Eye className="w-4 h-4" />
//                 View PDF
//               </Button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* PDF Viewer Modal */}
//       {selectedPdf && (
//         <PDFViewer
//           open={viewerOpen}
//           onClose={() => {
//             setViewerOpen(false);
//             setSelectedPdf(null);
//           }}
//           url={selectedPdf.url}
//           title={selectedPdf.name}
//         />
//       )}
//     </div>
//   );
// }


// import { useState } from 'react';
// import { Eye, ExternalLink } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { PDFViewer } from '@/components/PDFViewer';
// import { DSAWebSheet } from '@/types/workspace';

// const DSA_SHEETS: DSAWebSheet[] = [
//   {
//     id: 'striver-a2z',
//     name: 'Striver A2Z DSA Sheet',
//     url: 'https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z',
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: 'love-babbar',
//     name: 'Love Babbar DSA Sheet',
//     url: 'https://www.geeksforgeeks.org/dsa/dsa-sheet-by-love-babbar/',
//     createdAt: new Date().toISOString(),
//   },
//   {
//     id: 'blind-75',
//     name: 'Blind 75 LeetCode Sheet',
//     url: 'https://leetcode.com/discuss/post/460599/blind-75-leetcode-questions-by-krishnade-9xev/',
//     createdAt: new Date().toISOString(),
//   },
// ];

// export default function DSASheets() {
//   const [selected, setSelected] = useState<DSAWebSheet | null>(null);

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold">DSA Sheets</h1>
//       <p className="text-muted-foreground">
//         Structured DSA sheets for revision and interview preparation
//       </p>

//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {DSA_SHEETS.map(sheet => (
//           <div
//             key={sheet.id}
//             className="p-5 rounded-2xl border bg-card space-y-3"
//           >
//             <h3 className="font-semibold">{sheet.name}</h3>

//             <div className="flex gap-2">
//               <Button
//                 className="flex-1 gap-2"
//                 onClick={() => setSelected(sheet)}
//               >
//                 <Eye size={16} />
//                 Open in Workspace
//               </Button>

//               <Button
//                 variant="secondary"
//                 onClick={() => window.open(sheet.url, '_blank')}
//               >
//                 <ExternalLink size={16} />
//               </Button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {selected && (
//         <PDFViewer
//           open={!!selected}
//           onClose={() => setSelected(null)}
//           url={selected.url}
//           title={selected.name}
//         />
//       )}
//     </div>
//   );
// }


import { useState } from 'react';
import { ExternalLink, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface DSAProgress {
  date: string;
  completed: number; // 0–3
}

interface DSASheet {
  id: string;
  name: string;
  url: string;
  progress: DSAProgress[];
}

const today = () => new Date().toISOString().split('T')[0];

const INITIAL_SHEETS: DSASheet[] = [
  {
    id: 'striver',
    name: 'Striver A2Z DSA Sheet',
    url: 'https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z',
    progress: [],
  },
  {
    id: 'love-babbar',
    name: 'Love Babbar DSA Sheet',
    url: 'https://www.geeksforgeeks.org/dsa/dsa-sheet-by-love-babbar/',
    progress: [],
  },
  {
    id: 'blind-75',
    name: 'Blind 75 LeetCode Sheet',
    url: 'https://leetcode.com/discuss/post/460599/blind-75-leetcode-questions-by-krishnade-9xev/',
    progress: [],
  },
];

export default function DSASheets() {
  const [sheets, setSheets] = useLocalStorage<DSASheet[]>(
    'dsa-sheets-progress',
    INITIAL_SHEETS
  );

  const markDone = (sheetId: string) => {
    setSheets(prev =>
      prev.map(sheet => {
        if (sheet.id !== sheetId) return sheet;

        const date = today();
        const existing = sheet.progress.find(p => p.date === date);

        if (existing && existing.completed >= 3) return sheet;

        return {
          ...sheet,
          progress: existing
            ? sheet.progress.map(p =>
                p.date === date
                  ? { ...p, completed: p.completed + 1 }
                  : p
              )
            : [...sheet.progress, { date, completed: 1 }],
        };
      })
    );
  };

  const resetToday = (sheetId: string) => {
    setSheets(prev =>
      prev.map(sheet =>
        sheet.id === sheetId
          ? {
              ...sheet,
              progress: sheet.progress.filter(p => p.date !== today()),
            }
          : sheet
      )
    );
  };

  const todayCount = (sheet: DSASheet) =>
    sheet.progress.find(p => p.date === today())?.completed || 0;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Daily DSA Practice</h1>
      <p className="text-muted-foreground">
        🎯 Daily Target: <b>3 Questions</b>
      </p>

      {/* SHEETS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sheets.map(sheet => {
          const done = todayCount(sheet);

          return (
            <div
              key={sheet.id}
              className="p-5 rounded-2xl border bg-card space-y-4"
            >
              <h3 className="font-semibold">{sheet.name}</h3>

              <Button
                variant="secondary"
                className="w-full gap-2"
                onClick={() => window.open(sheet.url, '_blank')}
              >
                <ExternalLink size={16} />
                Open Link
              </Button>

              {/* DOT VISUALIZATION */}
              <div className="flex gap-3 justify-center py-2">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className={`w-4 h-4 rounded-full ${
                      i < done ? 'bg-green-500' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <p className="text-center text-sm">
                {done}/3 questions completed
              </p>

              <Button
                className="w-full gap-2"
                disabled={done >= 3}
                onClick={() => markDone(sheet.id)}
              >
                <CheckCircle size={16} />
                {done >= 3 ? 'Target Completed' : 'Mark 1 Question Done'}
              </Button>

              {done >= 3 && (
                <Button
                  variant="ghost"
                  className="w-full gap-2 text-sm"
                  onClick={() => resetToday(sheet.id)}
                >
                  <RotateCcw size={16} />
                  Reset Today
                </Button>
              )}
            </div>
          );
        })}
      </div>


    </div>
  );
}
