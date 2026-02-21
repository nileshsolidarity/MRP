import { readFileSync, writeFileSync, existsSync } from 'fs';
import { google } from 'googleapis';
import { getServiceAccountCredentials, getDriveFolderId } from './config.js';

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
    // Search in the shared folder (which has storage quota, unlike service account root)
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
  const folderId = getDriveFolderId();
  const content = JSON.stringify(users, null, 2);
  const fileId = await findDriveFile();

  if (fileId) {
    await drive.files.update({
      fileId,
      media: { mimeType: 'application/json', body: content },
    });
    console.log('Users saved to Drive (updated existing file)');
  } else {
    // Create in the shared folder (service accounts have no storage quota of their own)
    await drive.files.create({
      requestBody: {
        name: DRIVE_FILENAME,
        mimeType: 'application/json',
        parents: [folderId],
      },
      media: { mimeType: 'application/json', body: content },
    });
    console.log('Users saved to Drive (created new file in shared folder)');
  }
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

  // Force test write: always try writing to Drive to check if it works
  if (!driveFileId) {
    const testData = Array.isArray(tmpData) && tmpData.length > 0 ? tmpData : [{ id: 0, email: 'test@test.com', name: 'Drive Write Test', status: 'test', createdAt: new Date().toISOString() }];
    try {
      await uploadUsersToDrive(testData);
      testWriteResult = 'SUCCESS — Drive write works!';
      driveFileId = await findDriveFile();
      // If we used test data, clean up by deleting the file
      if (testData[0].email === 'test@test.com' && driveFileId) {
        try {
          const drive = getDriveWrite();
          await drive.files.delete({ fileId: driveFileId });
          testWriteResult += ' (test file cleaned up)';
          driveFileId = null;
        } catch (cleanupErr) { /* ignore cleanup errors */ }
      }
    } catch (e) {
      testWriteResult = `FAILED — ${e.message}`;
      if (e.stack) testWriteResult += ` | Stack: ${e.stack.split('\n').slice(0, 3).join(' > ')}`;
    }
  }

  return {
    config: { folderId: folderId ? `${folderId.substring(0, 8)}...` : 'NOT SET', hasServiceAccount: hasCreds, serviceAccountEmail },
    tmp: { exists: !!tmpData, userCount: Array.isArray(tmpData) ? tmpData.length : 0, users: Array.isArray(tmpData) ? tmpData.map(u => ({ email: u.email, status: u.status })) : tmpData },
    drive: { fileId: driveFileId || 'NOT FOUND', error: driveError, userCount: Array.isArray(driveData) ? driveData.length : 0, users: Array.isArray(driveData) ? driveData.map(u => ({ email: u.email, status: u.status })) : null },
    testWrite: testWriteResult,
  };
}
