// Config values are read directly from process.env at runtime
// This file provides helper functions to avoid Vercel static analysis issues

export function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY;
}

export function getDriveFolderId() {
  return (process.env.GOOGLE_DRIVE_FOLDER_ID || '').trim();
}

export function getServiceAccountCredentials() {
  return process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
}

export function getJwtSecret() {
  return process.env.JWT_SECRET || 'default-secret-change-me';
}

export function getResendApiKey() {
  return process.env.RESEND_API_KEY;
}

export function getAppUrl() {
  return (process.env.APP_URL || 'https://mrp-process-repository.vercel.app').replace(/\/$/, '');
}

export function getHrApprovalEmail() {
  return process.env.HR_APPROVAL_EMAIL || 'anthony.okoro@clubconcierge.com';
}
