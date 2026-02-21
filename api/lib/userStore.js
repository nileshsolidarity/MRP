import { readFileSync, writeFileSync, existsSync } from 'fs';
import { google } from 'googleapis';
import { getServiceAccountCredentials, getDriveFolderId, getResendApiKey, getAppUrl } from './config.js';

const USERS_PATH = '/tmp/mrp-users.json';
const DRIVE_FILENAME = 'mrp-users-data.json';

let driveWriteClient;

function getDriveWrite() {
  if (!driveWriteClient) {
    const credJson = getServiceAccountCredentials();
    if (!credJson) throw new Error('Google service account credentials not configured');
    const credentials = JSON.parse(credJson);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    driveWriteClient = google.drive({ version: 'v3', auth });
  }
  return driveWriteClient;
}

async function findDriveFile() {
  try {
    const drive = getDriveWrite();
    const folderId = getDriveFolderId();
    const res = await drive.files.list({
      q: `name = '${DRIVE_FILENAME}' and '${folderId}' in parents and trashed = false`,
      fields: 'files(id, name)',
      pageSize: 1,
    });
    return res.data.files && res.data.files.length > 0 ? res.data.files[0].id : null;
  } catch (err) {
    console.error('Error finding users file on Drive:', err.message);
    return null;
  }
}

async function downloadUsersFromDrive() {
  try {
    const fileId = await findDriveFile();
    if (!fileId) return null;
    const drive = getDriveWrite();
    const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'text' });
    const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
    return data;
  } catch (err) {
    console.error('Error downloading users from Drive:', err.message);
    return null;
  }
}

async function uploadUsersToDrive(users) {
  const drive = getDriveWrite();
  const content = JSON.stringify(users, null, 2);
  const fileId = await findDriveFile();

  if (!fileId) {
    console.error('Drive file not found. Please create a file named "mrp-users-data.json" with content [] in the Drive folder.');
    throw new Error('SETUP REQUIRED: Create a file named "mrp-users-data.json" with content [] in your Google Drive folder.');
  }

  // Only UPDATE the existing file (service accounts cannot create files — no storage quota)
  await drive.files.update({
    fileId,
    media: { mimeType: 'application/json', body: content },
  });
  console.log('Users saved to Drive (updated existing file)');
}

export async function loadUsers() {
  // Try local /tmp first
  try {
    if (existsSync(USERS_PATH)) {
      return JSON.parse(readFileSync(USERS_PATH, 'utf-8'));
    }
  } catch { /* corrupted, continue */ }

  // Cold start — try Drive
  const driveData = await downloadUsersFromDrive();
  if (driveData && Array.isArray(driveData)) {
    writeFileSync(USERS_PATH, JSON.stringify(driveData));
    return driveData;
  }

  // Brand new — empty array
  const empty = [];
  writeFileSync(USERS_PATH, JSON.stringify(empty));
  return empty;
}

export async function saveUsers(users) {
  writeFileSync(USERS_PATH, JSON.stringify(users));
  // Await Drive backup to ensure data is available across serverless instances
  try {
    await uploadUsersToDrive(users);
  } catch (err) {
    console.error('Drive backup failed:', err.message);
  }
}

export async function findUserByEmail(email) {
  const users = await loadUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function addUser(user) {
  const users = await loadUsers();
  const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = { id: nextId, ...user };
  users.push(newUser);
  await saveUsers(users);
  return newUser;
}

export async function updateUser(email, fields) {
  const users = await loadUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return null;
  Object.assign(users[idx], fields);
  await saveUsers(users);
  return users[idx];
}

export async function debugUsers() {
  const folderId = getDriveFolderId();
  const credJson = getServiceAccountCredentials();
  const hasCreds = !!credJson;
  let serviceAccountEmail = null;
  try {
    if (credJson) {
      const creds = JSON.parse(credJson);
      serviceAccountEmail = creds.client_email || null;
    }
  } catch (e) { /* ignore parse error */ }
  let driveFileId = null;
  let driveData = null;
  let driveError = null;
  let tmpData = null;
  let testWriteResult = null;

  // Check /tmp
  try {
    if (existsSync(USERS_PATH)) {
      tmpData = JSON.parse(readFileSync(USERS_PATH, 'utf-8'));
    }
  } catch (e) { tmpData = `Error: ${e.message}`; }

  // Check Drive
  try {
    driveFileId = await findDriveFile();
    if (driveFileId) {
      driveData = await downloadUsersFromDrive();
    }
  } catch (e) { driveError = e.message; }

  // Test update write if file exists on Drive
  if (driveFileId) {
    try {
      const drive = getDriveWrite();
      const testContent = JSON.stringify(Array.isArray(driveData) ? driveData : [], null, 2);
      await drive.files.update({
        fileId: driveFileId,
        media: { mimeType: 'application/json', body: testContent },
      });
      testWriteResult = 'SUCCESS — Drive update works!';
    } catch (e) {
      testWriteResult = `UPDATE FAILED — ${e.message}`;
    }
  } else {
    testWriteResult = 'SETUP REQUIRED — Please create a file named "mrp-users-data.json" with content [] in your Google Drive folder. Service accounts cannot create files (no storage quota), but they CAN update existing files.';
  }

  // List all files in the Drive folder to help diagnose issues
  let folderFiles = [];
  try {
    const drive = getDriveWrite();
    const listRes = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'files(id, name, mimeType)',
      pageSize: 50,
    });
    folderFiles = (listRes.data.files || []).map(f => ({ name: f.name, mimeType: f.mimeType, id: f.id.substring(0, 8) + '...' }));
  } catch (e) { folderFiles = [{ error: e.message }]; }

  const resendKey = getResendApiKey();
  const appUrl = getAppUrl();

  return {
    config: { folderId: folderId ? `${folderId.substring(0, 8)}...` : 'NOT SET', hasServiceAccount: hasCreds, serviceAccountEmail },
    email: {
      resendApiKey: resendKey ? `${resendKey.substring(0, 8)}...configured` : 'NOT SET — emails will NOT work!',
      appUrl,
      adminEmails: ['anthony.okoro@clubconcierge.com', 'ceo@gotravelcc.com', 'ceo@clubconcierge.com'],
    },
    tmp: { exists: !!tmpData, userCount: Array.isArray(tmpData) ? tmpData.length : 0, users: Array.isArray(tmpData) ? tmpData.map(u => ({ email: u.email, status: u.status })) : tmpData },
    drive: { fileId: driveFileId || 'NOT FOUND', error: driveError, userCount: Array.isArray(driveData) ? driveData.length : 0, users: Array.isArray(driveData) ? driveData.map(u => ({ email: u.email, status: u.status })) : null },
    testWrite: testWriteResult,
    folderContents: folderFiles,
  };
}
