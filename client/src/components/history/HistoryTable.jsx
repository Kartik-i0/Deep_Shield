import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { fetchScanHistory, deleteScanRecord, getPdfDownloadUrl } from '@/services/historyApi';
import { getVerdictTheme, formatBytes } from '@/lib/utils';
import { History, Trash2, FileText, Download, RefreshCw, Eye, Image, Video, Mic, FileEdit } from 'lucide-react';

export function HistoryTable({ onSelectScan }) {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mediaFilter, setMediaFilter] = useState('all');

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const res = await fetchScanHistory({ mediaType: mediaFilter });
      setHistory(res.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load scan history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [mediaFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this scan record from forensic logs?')) return;
    try {
      await deleteScanRecord(id);
      setHistory(prev => prev.filter(item => item.scanId !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4 text-sky-400" />;
      case 'video': return <Video className="w-4 h-4 text-purple-400" />;
      case 'audio': return <Mic className="w-4 h-4 text-emerald-400" />;
      case 'text': return <FileEdit className="w-4 h-4 text-amber-400" />;
      default: return <History className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-sky-400" />
            <CardTitle>Forensic Audit Log & Historical Scans</CardTitle>
          </div>
          <CardDescription>
            Archived deepfake evaluations, forensic hashes, and certificates of authenticity.
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
            {['all', 'image', 'video', 'audio', 'text'].map((type) => (
              <button
                key={type}
                onClick={() => setMediaFilter(type)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                  mediaFilter === type ? 'bg-sky-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <Button variant="ghost" size="icon" onClick={loadHistory} className="h-8 w-8 text-slate-400">
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin text-sky-500 mb-2" />
            Loading forensic records...
          </div>
        ) : history.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
            No scan reports found. Run an image, video, audio, or text scan to populate the audit log.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Target File</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Verdict</th>
                  <th className="py-3 px-4">Deepfake Risk</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.map((item) => {
                  const theme = getVerdictTheme(item.verdict);
                  return (
                    <tr key={item.scanId} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-100 truncate max-w-[180px] sm:max-w-xs">
                          {item.fileName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          ID: {item.scanId}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 capitalize font-medium text-slate-300">
                          {getMediaIcon(item.mediaType)}
                          {item.mediaType}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${theme.badge}`}>
                          {item.verdict.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-mono font-bold ${item.deepfakeScore > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {item.deepfakeScore}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(getPdfDownloadUrl(item.scanId), '_blank')}
                            className="h-7 w-7 text-sky-400 hover:text-sky-300 hover:bg-sky-950/40"
                            title="Download PDF Certificate"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.scanId)}
                            className="h-7 w-7 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

