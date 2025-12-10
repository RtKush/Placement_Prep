import { X, ExternalLink, Download } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PDFViewerProps {
  open: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export function PDFViewer({ open, onClose, url, title }: PDFViewerProps) {
  const isExternalUrl = url.startsWith('http');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[98vw] w-[98vw] h-[98vh] p-0 gap-0 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card shrink-0">
          <h3 className="font-semibold truncate max-w-md">{title}</h3>
          <div className="flex items-center gap-2">
            {isExternalUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(url, '_blank')}
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open in Tab
              </Button>
            )}
            <a href={url} download={title} className="hidden">
              <Button variant="ghost" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </a>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 bg-muted/50 overflow-hidden">
          {url ? (
            <iframe
              src={url}
              className="w-full h-full border-0"
              title={title}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No PDF to display
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
