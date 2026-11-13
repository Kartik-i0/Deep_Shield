import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { fetchScanHistory, deleteScanRecord, getPdfDownloadUrl } from '@/services/historyApi';
import { getVerdictTheme } from '@/lib/utils';
import { History, Trash2, FileText, RefreshCw, Image, Video, Mic, FileEdit } from 'lucide-react';

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
    if (!window.confirm('Delete this scan record?')) return;
    try {
      await deleteScanRecord(id);
      setHistory(prev => prev.filter(item => item.scanId !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case 'image': return <Image className="w-3.5 h-3.5 text-zinc-400" />;
      case 'video': return <Video className="w-3.5 h-3.5 text-zinc-400" />;
      case 'audio': return <Mic className="w-3.5 h-3.5 text-zinc-400" />;
      case 'text': return <FileEdit className="w-3.5 h-3.5 text-zinc-400" />;
      default: return <History className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <Card className="fade-in">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-zinc-400" />
            <CardTitle>Recent Scans</CardTitle>
          </div>
          <CardDescription>
            History of your analyzed files and verification results.
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs">
            {['all', 'image', 'video', 'audio', 'text'].map((type) => (
              <button
                key={type}
                onClick={() => setMediaFilter(type)}
                className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                  mediaFilter === type
                    ? 'bg-zinc-800 text-white font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <Button variant="ghost" size="icon" onClick={loadHistory} className="h-8 w-8 text-zinc-400 hover:text-zinc-200">
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-zinc-400 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin text-zinc-400 mb-2" />
            Loading scan history...
          </div>
        ) : history.length === 0 ? (
          <div className="py-12 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
            No scans recorded yet. Upload a file or paste text to see results here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900/60 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">File / Content</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Result</th>
                  <th className="py-3 px-4 font-semibold">AI Risk Score</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {history.map((item) => {
                  const theme = getVerdictTheme(item.verdict);
                  return (
                    <tr key={item.scanId} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-medium text-zinc-200 truncate max-w-[200px] sm:max-w-xs">
                          {item.fileName}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-500">
                          {item.scanId.slice(0, 14)}...
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 capitalize text-zinc-400">
                          {getMediaIcon(item.mediaType)}
                          {item.mediaType}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${theme.badge}`}>
                          {item.verdict === 'AI_GENERATED' ? 'AI Generated' : 'Authentic'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-mono font-medium ${item.deepfakeScore >= 60 ? 'text-zinc-200' : 'text-zinc-400'}`}>
                          {item.deepfakeScore}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(getPdfDownloadUrl(item.scanId), '_blank')}
                            className="h-7 w-7 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                            title="Download PDF"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item.scanId)}
                            className="h-7 w-7 text-zinc-500 hover:text-red-400 hover:bg-red-950/20"
                            title="Delete"
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

