import { useState, useEffect } from 'react';
import { HelpCircle, Plus, Edit2, Trash2, ChevronDown } from 'lucide-react';
// @ts-ignore - worker import via Vite ?url
import pdfWorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.js?url';
import { CloudUpload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/EmptyState';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { HRQuestion } from '@/types/workspace';
import { cn } from '@/lib/utils';
// using native confirm dialogs

const initialFormData: {
  question: string;
  answer: string;
  category: 'hr' | 'technical';
} = {
  question: '',
  answer: '',
  category: 'hr'
};

export default function HRQnA() {
  const [questions, setQuestions] = useLocalStorage<HRQuestion[]>('hrQuestions', []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<HRQuestion | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState<'hr' | 'technical'>('hr');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // Bulk import state
  const [importOpen, setImportOpen] = useState(false);
  const [importCategory, setImportCategory] = useState<'hr' | 'technical'>('hr');
  const [bulkText, setBulkText] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [previewParsed, setPreviewParsed] = useState<{ question: string; answer: string }[]>([]);

  const filteredQuestions = questions.filter(q => q.category === activeTab);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingQuestion) {
      setQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id 
          ? { ...q, ...formData }
          : q
      ));
    } else {
      const newQuestion: HRQuestion = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      setQuestions(prev => [...prev, newQuestion]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingQuestion(null);
    setDialogOpen(false);
  };

  const handleEdit = (question: HRQuestion) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      answer: question.answer,
      category: question.category
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const q = questions.find(item => item.id === id);
    const text = q?.question || 'this question';
    if (!confirm(`Delete "${text}"? This cannot be undone.`)) return;
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const hrCount = questions.filter(q => q.category === 'hr').length;
  const techCount = questions.filter(q => q.category === 'technical').length;

  async function parseAndAddFromText() {
    if (!bulkText.trim()) return;
    console.log('Parsing pasted bulk text (first 2000 chars):', bulkText.slice(0, 2000));
    let parsed = parseTextToQa(bulkText);
    console.log('Parsed from pasted text:', parsed);

    // Fallback: if parser returned nothing but text contains pipe separators, try simple split
    if (parsed.length === 0 && bulkText.includes('|')) {
      const lines = bulkText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const fallback: { question: string; answer: string }[] = [];
      lines.forEach(line => {
        if (line.includes('|')) {
          const parts = line.split('|').map(p => p.trim());
          fallback.push({ question: parts[0] || '', answer: parts[1] || '' });
        }

        {/* native confirm used for deletions */}
      });
      if (fallback.length) {
        parsed = fallback;
        console.log('Fallback parsed pairs from pipes:', fallback);
      }
    }

    // Update preview state so user sees parsed pairs immediately
    try {
      setPreviewParsed(parsed.slice(0, 200));
    } catch (e) {
      // ignore preview errors
    }

    if (parsed.length) {
      const items: HRQuestion[] = parsed.map(p => ({ id: Date.now().toString() + Math.random(), question: p.question, answer: p.answer, category: importCategory, createdAt: new Date().toISOString() }));
      setQuestions(prev => [...prev, ...items]);
      setBulkText('');
      setImportOpen(false);
    } else {
      alert('No Q/A pairs were found in pasted text. Use Question|Answer per line or Q:/A: markers.');
    }
  }

  useEffect(() => {
    if (!bulkText.trim()) {
      setPreviewParsed([]);
      return;
    }
    try {
      const p = parseTextToQa(bulkText).slice(0, 50);
      setPreviewParsed(p);
    } catch (e) {
      setPreviewParsed([]);
    }
  }, [bulkText]);

  async function parseAndAddFromPdf(file: File) {
    setParsing(true);
    try {
      // Use the legacy build which works reliably in browser bundles
      // @ts-ignore - dynamic import, dev should run `npm install pdfjs-dist`
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf');
      if (pdfjs && (pdfjs as any).GlobalWorkerOptions) {
        try {
          // use the locally bundled worker file provided by Vite ?url import
          (pdfjs as any).GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
        } catch (e) {
          // fallback to CDN if local worker not available
          const ver = (pdfjs as any).version || '3.7.107';
          (pdfjs as any).GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${ver}/pdf.worker.min.js`;
        }
      }
      const arrayBuffer = await file.arrayBuffer();
      // @ts-ignore
      const loadingTask = (pdfjs as any).getDocument({ data: arrayBuffer });
      // @ts-ignore
      const pdf = await loadingTask.promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        // @ts-ignore
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((it: any) => it.str).join(' ');
        text += '\n' + pageText;
      }

      console.log('PDF extracted text (first 2000 chars):', text.slice(0, 2000));
      const parsed = parseTextToQa(text);
      console.log('Parsed QA pairs from PDF:', parsed);
      if (parsed.length) {
        const items: HRQuestion[] = parsed.map(p => ({ id: Date.now().toString() + Math.random(), question: p.question, answer: p.answer, category: importCategory, createdAt: new Date().toISOString() }));
        setQuestions(prev => [...prev, ...items]);
        setPdfFile(null);
        setImportOpen(false);
      } else {
        alert('No Q/A pairs found in PDF.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to parse PDF. See console for details.');
    } finally {
      setParsing(false);
    }
  }

  function parseTextToQa(text: string) {
    const out: { question: string; answer: string }[] = [];
    const normalized = text.replace(/\u00A0/g, ' ');

    // Strategy A: Look for Q:/Question and A:/Answer blocks using regex
    // Matches blocks like: Q: What is X? A: Answer...
    const qaBlockRegex = /(?:^|\n)\s*(?:Q(?:uest(?:ion)?)?[:\.\-\s]+)([\s\S]*?)(?:\n|$)\s*(?:A(?:nswer)?[:\.\-\s]+)([\s\S]*?)(?=\n\s*(?:Q(?:uest(?:ion)?)?[:\.\-\s]+)|$)/gi;
    let m: RegExpExecArray | null;
    while ((m = qaBlockRegex.exec(normalized))) {
      const q = m[1].trim().replace(/\s+/g, ' ');
      const a = m[2].trim().replace(/\s+/g, ' ');
      if (q) out.push({ question: q, answer: a });
    }
    if (out.length) return out;

    // Strategy B: Lines with pipe separator (Question|Answer)
    const lines = normalized.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const pipeLines = lines.filter(l => l.includes('|'));
    if (pipeLines.length) {
      pipeLines.forEach(line => {
        const parts = line.split('|').map(p => p.trim());
        out.push({ question: parts[0] || '', answer: parts[1] || '' });
      });
      return out;
    }

    // Strategy D: Question and answer on same line (numbered list style)
    // e.g. "1. What is React.js?  React is a JavaScript library..."
    const inlineQaRegex = /(?:\d+\.\s*)?([^?\n]+?\?)\s+([^\n]+?)(?=\s*(?:\d+\.\s*[^?\n]+?\?)|$)/gs;
    let inlineMatch: RegExpExecArray | null;
    const inlineFound: { q: string; a: string }[] = [];
    while ((inlineMatch = inlineQaRegex.exec(normalized))) {
      const q = inlineMatch[1].trim().replace(/\s+/g, ' ');
      const a = inlineMatch[2].trim().replace(/\s+/g, ' ');
      if (q) inlineFound.push({ q, a });
    }
    if (inlineFound.length) {
      inlineFound.forEach(it => out.push({ question: it.q, answer: it.a }));
      console.log('parseTextToQa: found inline Q/A pairs', inlineFound.slice(0,10));
      return out;
    }

    // Strategy C: Question lines ending with '?' followed by next non-empty line as answer
    for (let i = 0; i < lines.length - 1; i++) {
      const l = lines[i];
      if (l.endsWith('?') || /^Q[:\s]/i.test(l)) {
        const question = l.replace(/^Q[:\s]+/i, '').trim();
        const answer = lines[i + 1].replace(/^A[:\s]+/i, '').trim();
        out.push({ question, answer });
        i++; // skip next line
      }
    }

    return out;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">HR & Technical QnA</h1>
          <p className="text-muted-foreground mt-1">
            Common questions and your best answers
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => resetForm()}>
              <Plus className="w-4 h-4" />
              Add Question
            </Button>
          </DialogTrigger>
          {/* <Button className="gap-2" variant="outline" onClick={() => { setImportOpen(true); setImportCategory(activeTab); }}>
            <CloudUpload className="w-4 h-4" />
            Bulk Import
          </Button> */}
          <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add Question & Answer'}</DialogTitle>
                <DialogDescription>Add a single question and your prepared answer.</DialogDescription>
              </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: 'hr' | 'technical') => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">🤝 HR Question</SelectItem>
                    <SelectItem value="technical">💻 Technical Question</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  placeholder="e.g., Tell me about yourself"
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer">Your Answer</Label>
                <Textarea
                  id="answer"
                  placeholder="Write your best answer here..."
                  value={formData.answer}
                  onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                  className="min-h-[150px]"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingQuestion ? 'Save Changes' : 'Add Question'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Bulk Import Dialog
        <Dialog open={importOpen} onOpenChange={setImportOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Bulk Import Q&A</DialogTitle>
              <DialogDescription>Paste multiple Q&A lines or upload a PDF to extract questions and answers.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Import Category</Label>
                <Select value={importCategory} onValueChange={(v) => setImportCategory(v as 'hr' | 'technical')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr">🤝 HR Question</SelectItem>
                    <SelectItem value="technical">💻 Technical Question</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Paste Q&A (optional)</Label>
                <Textarea
                  placeholder={"One Q&A per line. Format: Question|Answer OR lines with Q:/A: markers."}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="min-h-[140px] bg-muted/10"
                />
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-muted-foreground">Examples: <span className="font-mono">What is REST?|REST uses endpoints</span> or use <span className="font-mono">Q: ...</span> and <span className="font-mono">A: ...</span> markers.</div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground">Preview: <span className="font-medium">{previewParsed.length}</span> parsed</div>
                    <Button onClick={async () => { await parseAndAddFromText(); }} disabled={!bulkText.trim()}>Parse & Add Pasted</Button>
                    <Button variant="outline" onClick={() => setBulkText('')}>Clear</Button>
                  </div>
                </div>

                {previewParsed.length > 0 && (
                  <div className="mt-3 border border-border rounded-md p-3 bg-background">
                    <div className="text-sm font-medium mb-2">Preview (first {Math.min(previewParsed.length, 10)}):</div>
                    <ul className="space-y-2 max-h-48 overflow-auto text-sm">
                      {previewParsed.slice(0, 10).map((p, i) => (
                        <li key={i} className="p-2 rounded-md bg-muted/5">
                          <div className="font-medium">Q: {p.question}</div>
                          <div className="text-muted-foreground">A: {p.answer}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Upload PDF (optional)</Label>
                <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} />
                <div className="flex gap-2 mt-2">
                  <Button disabled={!pdfFile || parsing} onClick={async () => { if (pdfFile) await parseAndAddFromPdf(pdfFile); }}>{parsing ? 'Parsing...' : 'Upload & Parse PDF'}</Button>
                  <Button variant="outline" onClick={() => setPdfFile(null)}>Clear</Button>
                </div>
                <div className="text-xs text-muted-foreground mt-1">PDF parser will try simple heuristics (Q/A markers or Q? next line = A).</div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setImportOpen(false)}>Close</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog> */}
      </div>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'hr' | 'technical')}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="hr" className="gap-2">
            🤝 HR Questions
            <span className="px-2 py-0.5 rounded-full bg-rose-light text-xs">{hrCount}</span>
          </TabsTrigger>
          <TabsTrigger value="technical" className="gap-2">
            💻 Technical
            <span className="px-2 py-0.5 rounded-full bg-sky-light text-xs">{techCount}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hr" className="mt-6">
          {hrCount === 0 ? (
            <EmptyState
              icon={HelpCircle}
              title="No HR questions yet"
              description="Add common HR questions like 'Tell me about yourself' with your prepared answers"
              actionLabel="Add HR Question"
              onAction={() => {
                setFormData(prev => ({ ...prev, category: 'hr' }));
                setDialogOpen(true);
              }}
              gradient="gradient-rose"
            />
          ) : (
            <QuestionsList 
              questions={filteredQuestions}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              onEdit={handleEdit}
              onDelete={handleDelete}
              gradient="gradient-rose"
            />
          )}
        </TabsContent>

        <TabsContent value="technical" className="mt-6">
          {techCount === 0 ? (
            <EmptyState
              icon={HelpCircle}
              title="No technical questions yet"
              description="Add common technical questions like 'Explain OOPs concepts' with detailed answers"
              actionLabel="Add Technical Question"
              onAction={() => {
                setFormData(prev => ({ ...prev, category: 'technical' }));
                setDialogOpen(true);
              }}
              gradient="gradient-sky"
            />
          ) : (
            <QuestionsList 
              questions={filteredQuestions}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              onEdit={handleEdit}
              onDelete={handleDelete}
              gradient="gradient-sky"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface QuestionsListProps {
  questions: HRQuestion[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  onEdit: (question: HRQuestion) => void;
  onDelete: (id: string) => void;
  gradient: string;
}

function QuestionsList({ questions, expandedId, setExpandedId, onEdit, onDelete, gradient }: QuestionsListProps) {
  return (
    <div className="space-y-3">
      {questions.map((question, index) => {
        const isExpanded = expandedId === question.id;
        
        return (
          <div
            key={question.id}
            className={cn(
              "group rounded-2xl bg-card border border-border overflow-hidden",
              "card-hover shadow-card animate-fade-in"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div 
              className="p-5 cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : question.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", gradient)}>
                    <HelpCircle className="w-5 h-5 text-foreground/80" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{question.question}</h3>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(question); }}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDelete(question.id); }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <ChevronDown className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform",
                    isExpanded && "rotate-180"
                  )} />
                </div>
              </div>
            </div>
            
            {isExpanded && (
              <div className="px-5 pb-5 pt-0 border-t border-border animate-fade-in">
                <div className={cn("p-4 rounded-xl mt-4", gradient)}>
                  <h4 className="font-medium mb-2 text-sm">Your Answer</h4>
                  <p className="text-foreground/80 whitespace-pre-wrap">{question.answer}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
