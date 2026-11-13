import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { VerdictBanner } from '@/components/report/VerdictBanner';
import { ForensicScoreGauge } from '@/components/report/ForensicScoreGauge';
import { ForensicMatrixRadar } from '@/components/report/ForensicMatrixRadar';
import { AnomaliesList } from '@/components/report/AnomaliesList';
import { EngineProvenanceBadge } from '@/components/report/EngineProvenanceBadge';
import { ExportReportButtons } from '@/components/report/ExportReportButtons';
import { scanTextContent } from '@/services/detectionApi';
import { FileText, Sparkles, RefreshCw, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function TextDetector() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleClear = () => {
    setText('');
    setError(null);
    setReport(null);
  };

  const handleScan = async () => {
    if (!text.trim()) return;

    if (wordCount < 15) {
      setError('Please provide at least 15 words for statistically meaningful forensic analysis.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await scanTextContent(text);
      setReport(result.data);

      if (result.data.deepfakeScore < 30) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      }
    } catch (err) {
      setError(err.message || 'Text AI audit failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const sampleAiText = `In today's fast-paced digital era, it is a testament to technological progress that artificial intelligence seamlessly fosters innovation across multifaceted realms. Delving into this transformative landscape, it is crucial to recognize how pivotal machine learning algorithms have become. Furthermore, in conclusion, embracing this unwavering shift is indispensable for future growth.`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-400" />
              <CardTitle>AI-Generated Text & LLM Forensic Detector</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setText(sampleAiText)}
              className="text-xs text-sky-400 hover:text-sky-300"
            >
              Paste AI Sample
            </Button>
          </div>
          <CardDescription>
            Analyzes sentence length burstiness, syntactic uniformity, perplexity, and LLM-signature buzzwords using RoBERTa and Gemini.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <textarea
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste article, essay, social post, or email text here to evaluate for ChatGPT, Claude, Gemini, or Llama generation..."
              className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />

            <div className="flex items-center justify-between text-xs text-slate-400 mt-2 px-1">
              <span>
                {wordCount} words • {charCount} characters {wordCount < 15 && text.length > 0 && <span className="text-amber-400">(Min 15 words required)</span>}
              </span>
              {text.length > 0 && (
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {error && <Alert variant="destructive">{error}</Alert>}

          <div className="flex items-center justify-end pt-2">
            <Button
              onClick={handleScan}
              disabled={wordCount < 15 || isLoading}
              className="gap-2 px-6 shadow-sky-600/30"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing Linguistic Perplexity...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  Detect AI Writing
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
                Stylometric & Linguistic Integrity
              </h3>
              <ForensicMatrixRadar breakdown={report.forensicBreakdown} />
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-3">
                Linguistic Reasoning & Style Profile
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {report.summaryText}
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider mb-3">
                Detected Stylistic Clichés & Anomalies
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

