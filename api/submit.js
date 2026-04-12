// ════════════════════════════════════════════════════════
// CLAWR PILOT — FEEDBACK CAPTURE ENDPOINT
// Writes brain dump submissions to Google Sheets
// Sheet: Clawr Pilot Feedback, Tab: Submissions
// ════════════════════════════════════════════════════════

import { google } from 'googleapis';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const submission = req.body;

    // Validation
    if (!submission || !submission.userName || !submission.feedback) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Parse service account credentials from env var
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.CLAWR_PILOT_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error('CLAWR_PILOT_SHEET_ID not configured');
    }

    // Build row matching the 19-column structure:
    // A: Timestamp
    // B: Access Code
    // C: User Name
    // D: Agent Name
    // E: Duration
    // F: Welcome Response
    // G: Who Are You
    // H: Sleep/Wake
    // I: Important People
    // J: Worried About
    // K: Work Feeling
    // L: Drain / Energy
    // M: Inner Life Enjoyment
    // N: Routine Change
    // O: 5-Year Ambition
    // P: Neglected Side
    // Q: Honest Feedback
    // R: Device
    // S: Source
    const row = [
      submission.timestamp,
      submission.accessCode || 'direct',
      submission.userName,
      submission.agentName,
      submission.duration + ' min',
      submission.facts.stage0_q0 || '',
      submission.facts.stage1_q0 || '',
      submission.facts.stage1_q1 || '',
      submission.facts.stage2_q0 || '',
      submission.facts.stage2_q1 || '',
      submission.facts.stage3_q0 || '',
      submission.facts.stage3_q1 || '',
      submission.facts.stage4_q0 || '',
      submission.facts.stage4_q1 || '',
      submission.facts.stage5_q0 || '',
      submission.facts.stage5_q1 || '',
      submission.feedback,
      submission.userAgent || '',
      submission.referrer || 'direct',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Submissions!A:S',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    });

    return res.status(200).json({ success: true, message: 'Feedback captured' });

  } catch (error) {
    console.error('Error capturing feedback:', error);
    return res.status(500).json({
      error: 'Failed to save feedback',
      details: error.message
    });
  }
}
