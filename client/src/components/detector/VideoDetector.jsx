import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { DropZoneUploader } from './DropZoneUploader';
import { VerdictBanner } from '@/components/report/VerdictBanner';
import { ForensicScoreGauge } from '@/components/report/ForensicScoreGauge';
import { ForensicMatrixRadar } from '@/components/report/ForensicMatrixRadar';
import { AnomaliesList } from '@/components/report/AnomaliesList';
import { EngineProvenanceBadge } from '@/components/report/EngineProvenanceBadge';
import { ExportReportButtons } from '@/components/report/ExportReportButtons';
import { scanVideoFile } from '@/services/detectionApi';
import { Video, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export function VideoDetector() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleClear = () => {
    setFile(null);
    setError(null);
    setReport(null);
  };

  const handleScan = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await scanVideoFile(file);
      setReport(result.data);

      if (result.data.verdict === 'AUTHENTIC') {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
        });
      }
    } catch (err) {
      setError(err.message || 'Video analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5 fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-zinc-300" />
            <CardTitle>Video & Deepfake Face-Swap Check</CardTitle>
          </div>
          <CardDescription>
            Examine video files for AI face replacements, artificial lip-syncing, or synthetic avatar generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DropZoneUploader
            accept="video/mp4,video/webm,video/quicktime"
            mediaType="video"
            selectedFile={file}
            onFileSelect={handleFileSelect}
            onClear={handleClear}
            disabled={isLoading}
          />

          {error && <Alert variant="destructive">{error}</Alert>}

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-zinc-500">
              {file ? file.name : 'Upload MP4, WebM or MOV video up to 50 MB'}
            </span>
            <Button
              onClick={handleScan}
              disabled={!file || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Analyzing Video...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Analyze Video
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {report && (
        <div className="space-y-5 fade-in">
          <VerdictBanner
            verdict={report.verdict}
            confidenceLevel={report.confidenceLevel}
            scanId={report.scanId}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="flex flex-col items-center justify-center p-5">
              <ForensicScoreGauge
                deepfakeScore={report.deepfakeScore}
                authenticityScore={report.authenticityScore}
              />
            </Card>

            <Card className="md:col-span-2 p-5">
              <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-4">
                Movement & Face Realism
              </h3>
              <ForensicMatrixRadar breakdown={report.forensicBreakdown} />
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="p-5">
              <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2.5">
                Summary & Details
              </h3>
              <p className="text-xs text-zinc-800 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-900/60 p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                {report.summaryText}
              </p>
            </Card>

            <Card className="p-5">
              <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2.5">
                Identified Points
              </h3>
              <AnomaliesList anomalies={report.detectedAnomalies} />
            </Card>
          </div>

          <Card className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <EngineProvenanceBadge engines={report.engines} />
            <ExportReportButtons scanId={report.scanId} />
          </Card>
        </div>
      )}
    </div>
  );
}
