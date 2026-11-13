import PDFDocument from 'pdfkit';
import { ScanReport } from '../models/ScanReport.js';

export async function exportReportPdf(req, res, next) {
  try {
    const { id } = req.params;
    const report = await ScanReport.findOne({ scanId: id });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Scan report not found.' });
    }

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="DeepShield_Forensic_${report.scanId}.pdf"`);

    doc.pipe(res);

    // Header styling
    doc.rect(0, 0, doc.page.width, 80).fill('#0f172a'); // Slate 900
    doc.fillColor('#38bdf8').fontSize(22).text('DEEPSHIELD FORENSIC AUDIT CERTIFICATE', 40, 25);
    doc.fillColor('#94a3b8').fontSize(10).text(`Cryptographic Evidence & AI Deepfake Verification Report | ID: ${report.scanId}`, 40, 52);

    doc.moveDown(3);

    // File Metadata Section
    doc.fillColor('#0f172a').fontSize(14).text('1. Media Target Metadata', 40, 100);
    doc.fontSize(10).fillColor('#334155');
    doc.text(`File Name: ${report.fileName}`);
    doc.text(`Media Type: ${report.mediaType.toUpperCase()}`);
    doc.text(`File Size: ${(report.fileSize / 1024).toFixed(1)} KB`);
    doc.text(`Verification Timestamp: ${new Date(report.createdAt).toUTCString()}`);

    doc.moveDown(1.5);

    // Verdict Box
    const isFake = report.deepfakeScore > 50;
    const boxColor = isFake ? '#fee2e2' : '#dcfce7';
    const textColor = isFake ? '#991b1b' : '#166534';

    doc.rect(40, doc.y, doc.page.width - 80, 50).fill(boxColor);
    doc.fillColor(textColor).fontSize(16).text(`VERDICT: ${report.verdict.replace(/_/g, ' ')}`, 55, doc.y - 40);
    doc.fontSize(11).text(`Authenticity Score: ${report.authenticityScore}% | Deepfake Risk: ${report.deepfakeScore}% | Confidence: ${report.confidenceLevel}`, 55, doc.y + 4);

    doc.moveDown(3.5);

    // Forensic Breakdown
    doc.fillColor('#0f172a').fontSize(14).text('2. Forensic Analysis Matrix');
    doc.fontSize(10).fillColor('#334155');
    if (report.forensicBreakdown) {
      doc.text(`• Facial Structural Consistency: ${report.forensicBreakdown.facialConsistency}%`);
      doc.text(`• Lighting & Acoustic Physics: ${report.forensicBreakdown.lightingAcousticPhysics}%`);
      doc.text(`• Compression & Frequency Spectrum: ${report.forensicBreakdown.compressionFrequencyPurity}%`);
      doc.text(`• Metadata & Provenance Integrity: ${report.forensicBreakdown.metadataIntegrity}%`);
    }

    doc.moveDown(1.5);

    // Detected Anomalies
    doc.fillColor('#0f172a').fontSize(14).text('3. Detected Forensic Anomalies & Artifacts');
    doc.fontSize(10).fillColor('#334155');
    if (report.detectedAnomalies && report.detectedAnomalies.length > 0) {
      report.detectedAnomalies.forEach((a, idx) => {
        doc.text(`${idx + 1}. ${a}`);
      });
    } else {
      doc.text('No critical artificial or tampering artifacts detected.');
    }

    doc.moveDown(1.5);

    // Summary & Recommendations
    doc.fillColor('#0f172a').fontSize(14).text('4. Forensic Summary & Actionable Recommendations');
    doc.fontSize(10).fillColor('#334155');
    doc.text(report.summaryText || 'Audit complete.');
    doc.moveDown(0.5);
    if (report.recommendations && report.recommendations.length > 0) {
      report.recommendations.forEach(r => doc.text(`• ${r}`));
    }

    // Footer
    doc.fontSize(8).fillColor('#94a3b8').text('DeepShield Secure Forensic Verification Engine • Multi-Key AI Ensemble Architecture', 40, doc.page.height - 40, { align: 'center' });

    doc.end();
  } catch (err) {
    next(err);
  }
}

export async function exportReportJson(req, res, next) {
  try {
    const { id } = req.params;
    const report = await ScanReport.findOne({ scanId: id });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Scan report not found.' });
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="DeepShield_${report.scanId}.json"`);
    res.status(200).send(JSON.stringify(report, null, 2));
  } catch (err) {
    next(err);
  }
}

