import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Code2 } from 'lucide-react';
import { getPdfDownloadUrl, getJsonDownloadUrl } from '@/services/historyApi';

export function ExportReportButtons({ scanId }) {
  if (!scanId) return null;

  const handleDownloadPdf = () => {
    window.open(getPdfDownloadUrl(scanId), '_blank');
  };

  const handleDownloadJson = () => {
    window.open(getJsonDownloadUrl(scanId), '_blank');
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleDownloadPdf}
        className="gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700"
      >
        <FileText className="w-4 h-4 text-sky-400" />
        Download PDF Certificate
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadJson}
        className="gap-2 border-slate-700 text-slate-300 hover:text-white"
      >
        <Code2 className="w-4 h-4 text-slate-400" />
        Raw Forensic JSON
      </Button>
    </div>
  );
}

