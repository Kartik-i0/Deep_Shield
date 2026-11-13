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
import { scanAudioFile } from '@/services/detectionApi';
import { Mic, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export function AudioDetector() {
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
      const result = await scanAudioFile(file, (pct) => {
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
      setError(err.message || 'Audio synthetic speech audit failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-sky-400" />
            <CardTitle>AI Voice Clone & Synthetic Audio Detector</CardTitle>
          </div>
          <CardDescription>
            Detects neural voice clones (ElevenLabs, Tortoise, VALL-E), vocoder spectral cutoff, artificial phase coherence, and unnatural acoustic silence.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DropZoneUploader
            accept="audio/mpeg,audio/wav,audio/ogg,audio/mp4,audio/x-m4a"
            mediaType="audio"
            selectedFile={file}
            onFileSelect={handleFileSelect}
            onClear={handleClear}
            disabled={isLoading}
          />

          {error && <Alert variant="destructive">{error}</Alert>}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              {file ? `Target Audio: ${file.name}` : 'Upload MP3, WAV, or AAC audio file'}
            </span>
            <Button
              onClick={handleScan}
              disabled={!file || isLoading}
              className="gap-2 px-6 shadow-sky-600/30"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Acoustic Formants ({progress}%)...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  Run Voice Clone Scan
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
                Spectral & Acoustic Acoustics
              </h3>
              <ForensicMatrixRadar breakdown={report.forensicBreakdown} />
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-3">
                Acoustic Forensic Evaluation
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {report.summaryText}
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-3">
                Acoustic Anomalies
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

