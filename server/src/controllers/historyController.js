import { ScanReport } from '../models/ScanReport.js';

export async function getScanHistory(req, res, next) {
  try {
    const { mediaType, verdict, limit = 50 } = req.query;
    const query = {};

    if (mediaType && mediaType !== 'all') query.mediaType = mediaType;
    if (verdict && verdict !== 'all') query.verdict = verdict;

    const reports = await ScanReport.find(query, { createdAt: -1 }, parseInt(limit, 10));
    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (err) {
    next(err);
  }
}

export async function getScanById(req, res, next) {
  try {
    const { id } = req.params;
    const report = await ScanReport.findOne({ scanId: id });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Scan report not found.' });
    }
    res.status(200).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
}

export async function deleteScan(req, res, next) {
  try {
    const { id } = req.params;
    const result = await ScanReport.deleteOne({ scanId: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Scan report not found.' });
    }
    res.status(200).json({ success: true, message: 'Scan report deleted successfully.' });
  } catch (err) {
    next(err);
  }
}

