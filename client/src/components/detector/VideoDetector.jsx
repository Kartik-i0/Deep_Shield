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
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError(null);
    setReport(null);
  };

  const handleClear = () => {
    setFile(null);
    setError(null);
    setReport(null);
  };

  const handleScan = async () => {
    if (!file) return;

    setIsLoading(true);
    setProgress(15);
    setError(null);

    try {
      const result = await scanVideoFile(file, (pct) => {
        setProgress(Math.min(90, Math.max(20, pct)));
      });

      setProgress(100);
      setReport(result.data);

      if (result.data.deepfakeScore < 30) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      }
    } catch (err) {
      setError(err.message || 'Video deepfake audit failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-sky-400" />
            <CardTitle>Video Deepfake & Facial Replacement Detector</CardTitle>
          </div>
          <CardDescription>
            Analyzes video streams for facial boundary warping, lip-sync misalignment, temporal flicker, and synthetic AI avatar generation.
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

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              {file ? `Target Video: ${file.name}` : 'Upload MP4 or WebM video (up to 50MB)'}
            </span>
            <Button
              onClick={handleScan}
              disabled={!file || isLoading}
              className="gap-2 px-6 shadow-sky-600/30"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Extracting Frames & Analyzing ({progress}%)...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  Run Video Deepfake Scan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {report && (
        <div className="space-y-6 animate-fadeIn">
          <VerdictBanner
            verdict={report.verdict}
            confidenceLevel={report.confidenceLevel}
            scanId={report.scanId}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="flex flex-col items-center justify-center p-6">
              <ForensicScoreGauge
                deepfakeScore={report.deepfakeScore}
                authenticityScore={report.authenticityScore}
              />
            </Card>

            <Card className="md:col-span-2 p-6">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4">
                Temporal & Lip-Sync Reliability
              </h3>
              <ForensicMatrixRadar breakdown={report.forensicBreakdown} />
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-3">
                Temporal Motion Analysis
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {report.summaryText}
              </p>

              {report.recommendations && report.recommendations.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Verification Guidance
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                    {report.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-3">
                Identified Temporal Anomalies
              </h3>
              <AnomaliesList anomalies={report.detectedAnomalies} />
            </Card>
          </div>

          <Card className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <EngineProvenanceBadge engines={report.engines} />
            <ExportReportButtons scanId={report.scanId} />
          </Card>
        </div>
      )}
    </div>
  );
}

