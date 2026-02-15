import { google } from 'googleapis';
import { getServiceAccountCredentials, getDriveFolderId } from './config.js';

let driveClient;

function getDrive() {
  if (!driveClient) {
    const credJson = getServiceAccountCredentials();
    if (!credJson) {
      throw new Error('Google service account credentials not configured');
    }
    const credentials = JSON.parse(credJson);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    driveClient = google.drive({ version: 'v3', auth });
  }
  return driveClient;
}

async function listFilesInFolder(drive, folderId) {
  const files = [];
  let pageToken = null;

  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: 'nextPageToken, files(id, name, mimeType, modifiedTime, size, webViewLink)',
      pageSize: 100,
      pageToken,
    });
    files.push(...(res.data.files || []));
    pageToken = res.data.nextPageToken;
  } while (pageToken);

  return files;
}

export async function listFiles() {
  const drive = getDrive();
  const folderId = getDriveFolderId();
  const allFiles = [];

  // Get top-level items
  const topLevel = await listFilesInFolder(drive, folderId);

  for (const item of topLevel) {
    if (item.mimeType === 'application/vnd.google-apps.folder') {
      // Recursively get files from subfolders
      const subFiles = await listFilesInFolder(drive, item.id);
      for (const subItem of subFiles) {
        if (subItem.mimeType === 'application/vnd.google-apps.folder') {
          // Go one more level deep
          const subSubFiles = await listFilesInFolder(drive, subItem.id);
          allFiles.push(...subSubFiles.filter(f => f.mimeType !== 'application/vnd.google-apps.folder'));
        } else {
          allFiles.push(subItem);
        }
      }
    } else {
      allFiles.push(item);
    }
  }

  return allFiles;
}

export async function downloadFileContent(fileId, mimeType) {
  const drive = getDrive();

  const googleMimeTypes = {
    'application/vnd.google-apps.document': 'text/plain',
    'application/vnd.google-apps.spreadsheet': 'text/csv',
    'application/vnd.google-apps.presentation': 'text/plain',
  };

  if (googleMimeTypes[mimeType]) {
    const res = await drive.files.export(
      { fileId, mimeType: googleMimeTypes[mimeType] },
      { responseType: 'text' }
    );
    return { content: res.data, exportedMimeType: googleMimeTypes[mimeType] };
  }

  try {
    const res = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );
    return { content: Buffer.from(res.data), exportedMimeType: mimeType };
  } catch (downloadErr) {
    // If direct download fails, try exporting as plain text (for converted docs)
    console.log(`Direct download failed for ${fileId}, trying export as text:`, downloadErr.message);
    const res = await drive.files.export(
      { fileId, mimeType: 'text/plain' },
      { responseType: 'text' }
    );
    return { content: res.data, exportedMimeType: 'text/plain' };
  }
}
