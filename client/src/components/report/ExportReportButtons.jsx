import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { getPdfDownloadUrl, getJsonDownloadUrl } from '@/services/historyApi';

export function ExportReportButtons({ scanId }) {
  if (!scanId) return null;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => window.open(getPdfDownloadUrl(scanId), '_blank')}
        className="gap-1.5"
      >
        <FileText className="w-3.5 h-3.5 text-zinc-400" />
        PDF Certificate
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(getJsonDownloadUrl(scanId), '_blank')}
        className="gap-1.5 text-zinc-400 hover:text-white"
      >
        <Download className="w-3.5 h-3.5" />
        JSON
      </Button>
    </div>
  );
}
