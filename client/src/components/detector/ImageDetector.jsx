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
import { ElaViewerModal } from './ElaViewerModal';
import { scanImageFile } from '@/services/detectionApi';
import { Shield, Sparkles, Layers, RefreshCw, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export function ImageDetector() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);
  const [showElaModal, setShowElaModal] = useState(false);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
    setError(null);
    setReport(null);
  };

  const handleClear = () => {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(null);
    setFilePreview(null);
    setError(null);
    setReport(null);
  };

  const handleScan = async () => {
    if (!file) return;

    setIsLoading(true);
    setProgress(15);
    setError(null);

    try {
      const result = await scanImageFile(file, (pct) => {
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
      setError(err.message || 'Image forensic audit failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-sky-400" />
            <CardTitle>AI Image & Deepfake Face Detection</CardTitle>
          </div>
          <CardDescription>
            Multi-model forensic audit combining Gemini 1.5/2.0 Vision, Hugging Face AI classifiers, Error Level Analysis (ELA), and EXIF hardware metadata verification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DropZoneUploader
            accept="image/jpeg,image/png,image/webp"
            mediaType="image"
            selectedFile={file}
            onFileSelect={handleFileSelect}
            onClear={handleClear}
            disabled={isLoading}
          />

          {error && <Alert variant="destructive">{error}</Alert>}

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              {file ? `Target: ${file.name}` : 'Select or drop an image to start'}
            </span>
            <Button
              onClick={handleScan}
              disabled={!file || isLoading}
              className="gap-2 px-6 shadow-sky-600/30"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Artifacts ({progress}%)...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  Run Forensic Scan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Section */}
      {report && (
        <div className="space-y-6 animate-fadeIn">
          <VerdictBanner
            verdict={report.verdict}
            confidenceLevel={report.confidenceLevel}
            scanId={report.scanId}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Ring */}
            <Card className="flex flex-col items-center justify-center p-6">
              <ForensicScoreGauge
                deepfakeScore={report.deepfakeScore}
                authenticityScore={report.authenticityScore}
              />
              {report.engines?.localForensics?.elaHeatmapUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowElaModal(true)}
                  className="mt-2 gap-1.5 border-slate-700 text-xs text-sky-400 hover:text-sky-300"
                >
                  <Layers className="w-3.5 h-3.5" />
                  Inspect ELA Heatmap
                </Button>
              )}
            </Card>

            {/* Matrix Breakdown */}
            <Card className="md:col-span-2 p-6">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-4">
                Forensic Reliability Matrix
              </h3>
              <ForensicMatrixRadar breakdown={report.forensicBreakdown} />
            </Card>
          </div>

          {/* Reasoning & Anomalies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-3">
                Forensic Reasoning & Summary
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {report.summaryText}
              </p>

              {report.recommendations && report.recommendations.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Actionable Recommendations
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
                Detected Forensic Artifacts
              </h3>
              <AnomaliesList anomalies={report.detectedAnomalies} />
            </Card>
          </div>

          {/* Engine Provenance & Export Buttons */}
          <Card className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <EngineProvenanceBadge engines={report.engines} />
            <ExportReportButtons scanId={report.scanId} />
          </Card>

          {/* ELA Heatmap Modal */}
          {report.engines?.localForensics?.elaHeatmapUrl && (
            <ElaViewerModal
              open={showElaModal}
              onClose={() => setShowElaModal(false)}
              originalUrl={filePreview}
              elaHeatmapUrl={report.engines.localForensics.elaHeatmapUrl}
              meanError={report.engines.localForensics.meanError}
            />
          )}
        </div>
      )}
    </div>
  );
}

