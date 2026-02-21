import { loadStore, saveStore, getNextId } from './lib/store.js';
import { createToken, requireAuth, createUserToken, createPurposeToken, verifyPurposeToken } from './lib/auth.js';
import { listFiles, downloadFileContent } from './lib/drive.js';
import { generateEmbeddings } from './lib/embedding.js';
import { generateRagResponse } from './lib/rag.js';
import { getDriveFolderId, getGeminiApiKey, getAppUrl, getAdminEmails } from './lib/config.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PILLARS, SCENARIOS, CERTIFICATION_RULES, getPillarQuestions, getModuleQuestions, getModuleScenarios, formatQuestionsForClient, gradeAnswers, shuffleArray } from './lib/questionBank.js';
import { loadUsers, findUserByEmail, addUser, updateUser } from './lib/userStore.js';
import { sendApprovalEmail, sendPasswordResetEmail } from './lib/email.js';
import bcrypt from 'bcryptjs';

export const config = { maxDuration: 60 };

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function inferCategory(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('hr') || lower.includes('human resource')) return 'HR';
  if (lower.includes('finance') || lower.includes('accounting')) return 'Finance';
  if (lower.includes('compliance') || lower.includes('regulatory')) return 'Compliance';
  if (lower.includes('operations') || lower.includes('ops')) return 'Operations';
  if (lower.includes('sales') || lower.includes('marketing')) return 'Sales & Marketing';
  if (lower.includes('it') || lower.includes('technology') || lower.includes('tech')) return 'IT';
  if (lower.includes('security') || lower.includes('safety')) return 'Security';
  if (lower.includes('customer') || lower.includes('service')) return 'Customer Service';
  if (lower.includes('policy')) return 'Policies';
  if (lower.includes('sop') || lower.includes('procedure')) return 'SOPs';
  return 'General';
}

function chunkText(text, targetSize = 500, overlap = 100) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= targetSize) return [words.join(' ')];
  const chunks = [];
  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + targetSize, words.length);
    chunks.push(words.slice(start, end).join(' '));
    if (end >= words.length) break;
    start = end - overlap;
  }
  return chunks;
}

async function extractText(content, mimeType) {
  if (typeof content === 'string') return content;
  if (mimeType === 'text/plain' || mimeType === 'text/csv' || mimeType === 'text/markdown') {
    return content.toString('utf-8');
  }
  if (mimeType === 'application/pdf') {
    try {
      const pdfParse = (await import('pdf-parse')).default;
      return (await pdfParse(content)).text;
    } catch (e) { console.error('PDF parse error:', e.message); return null; }
  }
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    try {
      const mammoth = await import('mammoth');
      const buf = Buffer.isBuffer(content) ? content : Buffer.from(content);
      return (await mammoth.extractRawText({ buffer: buf })).value;
    } catch (e) { console.error('DOCX parse error:', e.message); return null; }
  }
  // Try as plain text as fallback
  try {
    const str = content.toString('utf-8');
    if (str && str.trim().length > 10 && !str.includes('\x00')) return str;
  } catch { /* ignore */ }
  return null;
}

// --- Test utilities ---

function simpleHash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return String(Math.abs(hash));
}

function normalizeAnswer(str) {
  return str.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
}

function buildTestPrompt(docTitle, contentText) {
  const truncated = contentText.substring(0, 8000);
  return `You are a corporate training assessment generator. Based on the following company process document, generate exactly 10 test questions to evaluate an employee's understanding.

DOCUMENT TITLE: "${docTitle}"

DOCUMENT CONTENT:
${truncated}

REQUIREMENTS:
- Generate exactly 10 questions
- Mix of question types: 5 Multiple Choice, 3 True/False, 2 Short Answer
- Questions should test comprehension of key procedures, policies, and facts from the document
- Multiple Choice questions must have exactly 4 options labeled A, B, C, D with only 1 correct answer
- True/False questions should test common misconceptions or important facts
- Short Answer questions should have brief 1-5 word answers (not sentences)
- Include a brief explanation for each correct answer
- Questions should progress from basic recall to applied understanding

RESPOND WITH ONLY a valid JSON array (no markdown, no explanation), in this exact format:
[
  {
    "index": 0,
    "type": "multiple_choice",
    "question": "What is the first step in the onboarding process?",
    "options": ["A. Submit paperwork", "B. Meet the team", "C. Complete training", "D. Set up workstation"],
    "correct_answer": "A. Submit paperwork",
    "explanation": "According to the document, submitting paperwork is listed as step 1."
  },
  {
    "index": 1,
    "type": "true_false",
    "question": "All employees must complete safety training within 30 days.",
    "options": ["True", "False"],
    "correct_answer": "True",
    "explanation": "The document states safety training must be completed within 30 days."
  },
  {
    "index": 2,
    "type": "short_answer",
    "question": "What department handles expense report approvals?",
    "options": null,
    "correct_answer": "Finance",
    "explanation": "The Finance department approves all expense reports as stated in section 3."
  }
]`;
}

// --- Admin emails ---
const ADMIN_EMAILS = ['anthony.okoro@clubconcierge.com', 'ceo@gotravelcc.com', 'ceo@clubconcierge.com'];

function isAdmin(branch) {
  return branch.email && ADMIN_EMAILS.includes(branch.email.toLowerCase());
}

// --- Allowed email domains ---
const ALLOWED_DOMAINS = ['gotravelcc.com', 'clubconcierge.com'];

function isAllowedEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  return ALLOWED_DOMAINS.includes(domain);
}

// --- Route handlers ---

async function handleAuthLogin(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    if (user.status === 'pending') return res.status(403).json({ error: 'Your registration is still pending HR approval. Please wait for the approval email.' });
    if (user.status === 'approved') return res.status(403).json({ error: 'Your registration has been approved. Please check your email to set your password.' });
    if (user.status !== 'active') return res.status(403).json({ error: 'Account is not active. Please contact HR.' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    const token = createUserToken(user);
    res.json({
      token,
      branch: { id: 1, name: 'Head Office', code: 'HO001' },
      user: { email: user.email, name: user.name },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
}

async function handleRegister(req, res) {
  const { email, name } = req.body || {};
  if (!email || !name) return res.status(400).json({ error: 'Name and email are required' });
  if (!isAllowedEmail(email)) return res.status(400).json({ error: 'Only @gotravelcc.com and @clubconcierge.com email addresses are allowed.' });

  const emailLower = email.toLowerCase();
  const adminEmails = getAdminEmails();
  const isAdminEmail = adminEmails.includes(emailLower);

  try {
    const existing = await findUserByEmail(emailLower);
    if (existing) {
      if (existing.status === 'active') return res.status(400).json({ error: 'An account with this email already exists. Please log in.' });
      // If admin is stuck in pending, re-process them through auto-approve
      if (existing.status === 'pending' && isAdminEmail) {
        await updateUser(emailLower, { status: 'approved', approvedAt: new Date().toISOString() });
        const resetToken = createPurposeToken(emailLower, 'reset', '24h');
        const resetUrl = `${getAppUrl()}/set-password/${resetToken}`;
        try {
          await sendPasswordResetEmail(existing.name, existing.email, resetUrl);
        } catch (emailErr) {
          console.error('Email sending failed (admin auto-approve):', emailErr.message);
        }
        return res.json({
          message: 'Admin account auto-approved! Use the link below to set your password.',
          setPasswordUrl: resetUrl,
        });
      }
      if (existing.status === 'pending') return res.status(400).json({ error: 'A registration request for this email is already pending HR approval.' });
      if (existing.status === 'approved') {
        // Re-send set-password link
        const resetToken = createPurposeToken(emailLower, 'reset', '24h');
        const resetUrl = `${getAppUrl()}/set-password/${resetToken}`;
        try {
          await sendPasswordResetEmail(existing.name, existing.email, resetUrl);
        } catch (emailErr) {
          console.error('Email sending failed (re-send):', emailErr.message);
        }
        return res.json({
          message: 'Your registration was already approved. A new password setup link has been generated.',
          setPasswordUrl: resetUrl,
        });
      }
    }

    // --- Admin auto-approval: skip HR approval step ---
    if (isAdminEmail) {
      await addUser({
        email: emailLower,
        name,
        passwordHash: null,
        status: 'approved',
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
      });

      const resetToken = createPurposeToken(emailLower, 'reset', '24h');
      const resetUrl = `${getAppUrl()}/set-password/${resetToken}`;
      try {
        await sendPasswordResetEmail(name, emailLower, resetUrl);
      } catch (emailErr) {
        console.error('Email sending failed (admin registration):', emailErr.message);
      }
      return res.json({
        message: 'Admin account auto-approved! Use the link below to set your password.',
        setPasswordUrl: resetUrl,
      });
    }

    // --- Normal employee: requires HR approval ---
    await addUser({
      email: emailLower,
      name,
      passwordHash: null,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    const approvalToken = createPurposeToken(emailLower, 'approve', '72h');
    const approvalUrl = `${getAppUrl()}/api/auth/approve/${approvalToken}`;
    try {
      await sendApprovalEmail(name, email, approvalUrl);
    } catch (emailErr) {
      console.error('Approval email sending failed:', emailErr.message);
    }

    res.json({ message: 'Registration submitted successfully! You will receive an email once HR approves your request.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
}

async function handleApprove(req, res, token) {
  const payload = verifyPurposeToken(token, 'approve');
  if (!payload) {
    res.setHeader('Content-Type', 'text/html');
    return res.status(400).send(`
<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gotravelcc</title></head>
<body style="margin:0;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f3f4f6;text-align:center;">
<div style="max-width:400px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 24px;box-shadow:0 4px 12px rgba(0,0,0,.1);">
<div style="font-size:48px;margin-bottom:16px;">&#10060;</div>
<h1 style="color:#dc2626;font-size:22px;margin:0 0 12px;">Link Expired</h1>
<p style="color:#6b7280;font-size:15px;">This approval link has expired or is invalid. Please ask the employee to register again.</p>
</div></body></html>`);
  }

  try {
    const user = await findUserByEmail(payload.email);
    if (!user) {
      res.setHeader('Content-Type', 'text/html');
      return res.status(404).send(`
<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gotravelcc</title></head>
<body style="margin:0;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f3f4f6;text-align:center;">
<div style="max-width:400px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 24px;box-shadow:0 4px 12px rgba(0,0,0,.1);">
<div style="font-size:48px;margin-bottom:16px;">&#10060;</div>
<h1 style="color:#dc2626;font-size:22px;margin:0 0 12px;">User Not Found</h1>
<p style="color:#6b7280;font-size:15px;">No registration request found for this email address.</p>
</div></body></html>`);
    }

    if (user.status === 'active') {
      res.setHeader('Content-Type', 'text/html');
      return res.send(`
<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gotravelcc</title></head>
<body style="margin:0;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f3f4f6;text-align:center;">
<div style="max-width:400px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 24px;box-shadow:0 4px 12px rgba(0,0,0,.1);">
<div style="font-size:48px;margin-bottom:16px;">&#9989;</div>
<h1 style="color:#16a34a;font-size:22px;margin:0 0 12px;">Already Active</h1>
<p style="color:#6b7280;font-size:15px;">${user.name} has already set their password and is active.</p>
</div></body></html>`);
    }

    await updateUser(payload.email, { status: 'approved', approvedAt: new Date().toISOString() });

    const resetToken = createPurposeToken(payload.email, 'reset', '24h');
    const resetUrl = `${getAppUrl()}/set-password/${resetToken}`;
    await sendPasswordResetEmail(user.name, user.email, resetUrl);

    res.setHeader('Content-Type', 'text/html');
    res.send(`
<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gotravelcc</title></head>
<body style="margin:0;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f3f4f6;text-align:center;">
<div style="max-width:400px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 24px;box-shadow:0 4px 12px rgba(0,0,0,.1);">
<div style="font-size:48px;margin-bottom:16px;">&#9989;</div>
<h1 style="color:#16a34a;font-size:22px;margin:0 0 12px;">Employee Approved!</h1>
<p style="color:#374151;font-size:16px;font-weight:600;margin:0 0 8px;">${user.name}</p>
<p style="color:#6b7280;font-size:14px;margin:0 0 20px;">${user.email}</p>
<p style="color:#6b7280;font-size:15px;">A password setup email has been sent to the employee. They can set their password and start using the Gotravelcc Process Repository.</p>
</div></body></html>`);
  } catch (err) {
    console.error('Approval error:', err);
    res.setHeader('Content-Type', 'text/html');
    res.status(500).send(`
<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gotravelcc</title></head>
<body style="margin:0;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f3f4f6;text-align:center;">
<div style="max-width:400px;margin:0 auto;background:#fff;border-radius:16px;padding:40px 24px;box-shadow:0 4px 12px rgba(0,0,0,.1);">
<div style="font-size:48px;margin-bottom:16px;">&#10060;</div>
<h1 style="color:#dc2626;font-size:22px;margin:0 0 12px;">Error</h1>
<p style="color:#6b7280;font-size:15px;">Something went wrong processing the approval. Please try again.</p>
</div></body></html>`);
  }
}

async function handleSetPassword(req, res) {
  const { token, password } = req.body || {};
  if (!token || !password) return res.status(400).json({ error: 'Token and password are required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters long' });

  const payload = verifyPurposeToken(token, 'reset');
  if (!payload) return res.status(400).json({ error: 'This link has expired or is invalid. Please contact HR for a new approval.' });

  try {
    const user = await findUserByEmail(payload.email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const passwordHash = await bcrypt.hash(password, 10);
    await updateUser(payload.email, {
      passwordHash,
      status: 'active',
      activatedAt: new Date().toISOString(),
    });

    res.json({ message: 'Password set successfully! You can now log in.' });
  } catch (err) {
    console.error('Set password error:', err);
    res.status(500).json({ error: 'Failed to set password. Please try again.' });
  }
}

function handleAuthBranches(req, res) {
  const store = loadStore();
  res.json(store.branches.map((b) => ({ id: b.id, name: b.name, code: b.code })));
}

function handleProcesses(req, res, branch) {
  const { search, category, page = '1', limit = '20' } = req.query;
  const store = loadStore();
  let docs = [...store.documents];
  if (search) {
    const s = search.toLowerCase();
    docs = docs.filter((d) => d.title.toLowerCase().includes(s) || (d.content_text && d.content_text.toLowerCase().includes(s)));
  }
  if (category && category !== 'All') docs = docs.filter((d) => d.category === category);
  docs.sort((a, b) => a.title.localeCompare(b.title));
  const total = docs.length;
  const pageNum = parseInt(page), limitNum = parseInt(limit);
  const paged = docs.slice((pageNum - 1) * limitNum, (pageNum - 1) * limitNum + limitNum);
  res.json({
    documents: paged.map(({ content_text, ...rest }) => rest),
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
  });
}

function handleProcessById(req, res, branch, id) {
  const store = loadStore();
  const doc = store.documents.find((d) => d.id === parseInt(id));
  if (!doc) return res.status(404).json({ error: 'Process not found' });
  res.json(doc);
}

function handleCategories(req, res, branch) {
  const store = loadStore();
  const cats = [...new Set(store.documents.map((d) => d.category))].sort();
  res.json(['All', ...cats]);
}

async function handleSync(req, res, branch) {
  try {
    const folderId = getDriveFolderId();
    console.log('Sync starting. Folder ID:', folderId);
    const files = await listFiles();
    const store = loadStore();
    let processed = 0;
    for (const file of files) {
      const existing = store.documents.find((d) => d.drive_file_id === file.id);
      if (existing && existing.last_modified === file.modifiedTime) continue;
      try {
        console.log(`Processing file: ${file.name}, mimeType: ${file.mimeType}`);
        const { content, exportedMimeType } = await downloadFileContent(file.id, file.mimeType);
        console.log(`Downloaded: ${file.name}, exportedMimeType: ${exportedMimeType}, contentType: ${typeof content}, contentLength: ${content?.length || content?.byteLength || 0}`);
        const text = await extractText(content, exportedMimeType);
        console.log(`Extracted text for ${file.name}: ${text ? text.substring(0, 100) + '...' : 'NULL'}`);
        if (!text || text.trim().length < 10) {
          console.log(`Skipping ${file.name}: text too short or null`);
          continue;
        }
        const category = inferCategory(file.name);
        if (existing) {
          Object.assign(existing, { title: file.name, category, mime_type: file.mimeType, drive_url: file.webViewLink, content_text: text, file_size: parseInt(file.size || '0'), last_modified: file.modifiedTime, synced_at: new Date().toISOString() });
          store.chunks = store.chunks.filter((c) => c.document_id !== existing.id);
        } else {
          const docId = getNextId(store, 'documents');
          store.documents.push({ id: docId, drive_file_id: file.id, title: file.name, category, mime_type: file.mimeType, drive_url: file.webViewLink, content_text: text, file_size: parseInt(file.size || '0'), last_modified: file.modifiedTime, synced_at: new Date().toISOString(), created_at: new Date().toISOString() });
        }
        const docEntry = store.documents.find((d) => d.drive_file_id === file.id);
        const textChunks = chunkText(text);
        const embeddings = await generateEmbeddings(textChunks);
        for (let j = 0; j < textChunks.length; j++) {
          store.chunks.push({ id: getNextId(store, 'chunks'), document_id: docEntry.id, chunk_index: j, content: textChunks[j], embedding: embeddings[j], token_count: textChunks[j].split(/\s+/).length });
        }
        processed++;
      } catch (fileErr) { console.error(`Error processing ${file.name}:`, fileErr.message); }
    }
    saveStore(store);
    res.json({ success: true, filesFound: files.length, filesProcessed: processed });
  } catch (err) {
    console.error('Sync error:', err);
    res.status(500).json({ error: err.message, details: err.errors ? err.errors : undefined, folderId: getDriveFolderId() });
  }
}

async function handleChat(req, res, branch) {
  const { message, sessionId } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Message is required' });
  const store = loadStore();
  let currentSessionId = sessionId;
  if (!currentSessionId) {
    currentSessionId = getNextId(store, 'chatSessions');
    store.chatSessions.push({ id: currentSessionId, branch_id: branch.branchId, created_at: new Date().toISOString() });
  }
  store.chatMessages.push({ id: getNextId(store, 'chatMessages'), session_id: currentSessionId, role: 'user', content: message, created_at: new Date().toISOString() });
  saveStore(store);
  const chatHistory = store.chatMessages.filter((m) => m.session_id === currentSessionId).sort((a, b) => a.id - b.id);

  res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  res.write(`data: ${JSON.stringify({ type: 'session', sessionId: currentSessionId })}\n\n`);

  try {
    let fullResponse = '';
    let sources = [];
    for await (const event of generateRagResponse(message, chatHistory.slice(0, -1))) {
      if (event.type === 'chunk') { res.write(`data: ${JSON.stringify({ type: 'chunk', content: event.content })}\n\n`); fullResponse += event.content; }
      else if (event.type === 'sources') { sources = event.sources; res.write(`data: ${JSON.stringify({ type: 'sources', sources })}\n\n`); }
      else if (event.type === 'done') {
        const freshStore = loadStore();
        freshStore.chatMessages.push({ id: getNextId(freshStore, 'chatMessages'), session_id: currentSessionId, role: 'assistant', content: fullResponse, sources: JSON.stringify(sources), created_at: new Date().toISOString() });
        saveStore(freshStore);
        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      }
    }
  } catch (err) {
    console.error('Chat error:', err);
    const errMsg = err.message || String(err);
    res.write(`data: ${JSON.stringify({ type: 'error', message: `Error: ${errMsg}` })}\n\n`);
  }
  res.end();
}

// --- Test handlers ---

async function handleTestGenerate(req, res, branch, documentId) {
  const store = loadStore();
  const doc = store.documents.find(d => d.id === parseInt(documentId));
  if (!doc) return res.status(404).json({ error: 'Process not found' });
  if (!doc.content_text || doc.content_text.trim().length < 50)
    return res.status(400).json({ error: 'Document has insufficient content to generate a test' });

  const docHash = simpleHash(doc.content_text.substring(0, 5000));
  let existing = store.testQuestions.find(tq => tq.document_id === parseInt(documentId));

  if (existing && existing.document_hash === docHash) {
    return res.json({
      document_id: existing.document_id,
      questions: existing.questions.map(({ correct_answer, explanation, ...q }) => q),
      generated_at: existing.generated_at,
      cached: true
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(getGeminiApiKey());
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = buildTestPrompt(doc.title, doc.content_text);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonStr = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const questions = JSON.parse(jsonStr);

    if (!Array.isArray(questions) || questions.length < 5) {
      throw new Error('Invalid question format from AI');
    }

    if (existing) {
      Object.assign(existing, { questions, generated_at: new Date().toISOString(), document_hash: docHash });
    } else {
      store.testQuestions.push({
        id: getNextId(store, 'testQuestions'),
        document_id: parseInt(documentId),
        questions,
        generated_at: new Date().toISOString(),
        document_hash: docHash
      });
    }
    saveStore(store);

    res.json({
      document_id: parseInt(documentId),
      questions: questions.map(({ correct_answer, explanation, ...q }) => q),
      generated_at: new Date().toISOString(),
      cached: false
    });
  } catch (err) {
    console.error('Test generation error:', err);
    res.status(500).json({ error: 'Failed to generate test questions: ' + err.message });
  }
}

function handleTestQuestions(req, res, branch, documentId) {
  const store = loadStore();
  const testQ = store.testQuestions.find(tq => tq.document_id === parseInt(documentId));
  if (!testQ) return res.status(404).json({ error: 'No test found. Generate one first.' });
  res.json({
    document_id: testQ.document_id,
    questions: testQ.questions.map(({ correct_answer, explanation, ...q }) => q),
    generated_at: testQ.generated_at
  });
}

function handleTestSubmit(req, res, branch, documentId) {
  const { answers } = req.body || {};
  if (!answers || !Array.isArray(answers))
    return res.status(400).json({ error: 'Answers array is required' });

  const store = loadStore();
  const testQ = store.testQuestions.find(tq => tq.document_id === parseInt(documentId));
  if (!testQ) return res.status(404).json({ error: 'No test found. Generate one first.' });

  let score = 0;
  const results = testQ.questions.map((q, i) => {
    const userAnswer = answers.find(a => a.index === i)?.answer || '';
    let isCorrect = false;

    if (q.type === 'short_answer') {
      const normalUser = normalizeAnswer(userAnswer);
      const normalCorrect = normalizeAnswer(q.correct_answer);
      isCorrect = normalUser === normalCorrect || normalCorrect.includes(normalUser) || normalUser.includes(normalCorrect);
      if (normalUser.length < 2) isCorrect = false;
    } else {
      isCorrect = userAnswer.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();
    }

    if (isCorrect) score++;
    return { index: i, question: q.question, type: q.type, user_answer: userAnswer, correct_answer: q.correct_answer, explanation: q.explanation, is_correct: isCorrect };
  });

  const total = testQ.questions.length;
  const percentage = Math.round((score / total) * 100);
  const attempt = {
    id: getNextId(store, 'testAttempts'),
    document_id: parseInt(documentId),
    branch_id: branch.branchId,
    branch_name: branch.name,
    branch_code: branch.code,
    user_email: branch.email || null,
    user_name: branch.userName || branch.name,
    score, total, percentage,
    passed: percentage >= 80,
    answers: results,
    completed_at: new Date().toISOString()
  };

  store.testAttempts.push(attempt);
  saveStore(store);
  res.json(attempt);
}

function handleTestAttempts(req, res, branch, documentId) {
  const store = loadStore();
  const attempts = store.testAttempts
    .filter(a => a.document_id === parseInt(documentId) && a.branch_id === branch.branchId)
    .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));
  res.json(attempts);
}

function handleTestLeaderboard(req, res, branch, documentId) {
  const store = loadStore();
  const attempts = store.testAttempts.filter(a => a.document_id === parseInt(documentId));
  const bestByBranch = {};
  for (const a of attempts) {
    if (!bestByBranch[a.branch_id] || a.percentage > bestByBranch[a.branch_id].percentage) {
      bestByBranch[a.branch_id] = a;
    }
  }
  const leaderboard = Object.values(bestByBranch)
    .sort((a, b) => b.percentage - a.percentage || new Date(a.completed_at) - new Date(b.completed_at))
    .map((a, i) => ({ rank: i + 1, branch_name: a.branch_name, branch_code: a.branch_code, score: a.score, total: a.total, percentage: a.percentage, passed: a.passed, completed_at: a.completed_at }));
  res.json(leaderboard);
}

function handleGlobalLeaderboard(req, res, branch) {
  const store = loadStore();
  const bestScores = {};
  for (const a of store.testAttempts) {
    if (!bestScores[a.branch_id]) bestScores[a.branch_id] = {};
    const existing = bestScores[a.branch_id][a.document_id];
    if (!existing || a.percentage > existing.percentage) {
      bestScores[a.branch_id][a.document_id] = a;
    }
  }
  const leaderboard = Object.entries(bestScores).map(([, docs]) => {
    const attempts = Object.values(docs);
    const avgPercentage = Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length);
    const sample = attempts[0];
    return { branch_name: sample.branch_name, branch_code: sample.branch_code, tests_taken: attempts.length, average_percentage: avgPercentage, tests_passed: attempts.filter(a => a.passed).length };
  }).sort((a, b) => b.average_percentage - a.average_percentage);
  leaderboard.forEach((entry, i) => entry.rank = i + 1);
  res.json(leaderboard);
}

// --- Assessment Bank handlers ---

function handleAssessmentPillars(req, res) {
  const pillars = PILLARS.map(p => ({
    id: p.id,
    title: p.title,
    certification: p.certification,
    audience: p.audience,
    passMark: p.passMark,
    timeMinutes: p.timeMinutes,
    moduleCount: p.modules.length,
    questionCount: p.modules.reduce((sum, m) => sum + m.questions.length, 0),
  }));
  res.json({ pillars, rules: CERTIFICATION_RULES });
}

function handleAssessmentPillarDetail(req, res, pillarId) {
  const pillar = PILLARS.find(p => p.id === parseInt(pillarId));
  if (!pillar) return res.status(404).json({ error: 'Pillar not found' });
  res.json({
    id: pillar.id,
    title: pillar.title,
    certification: pillar.certification,
    audience: pillar.audience,
    passMark: pillar.passMark,
    timeMinutes: pillar.timeMinutes,
    modules: pillar.modules.map(m => ({
      id: m.id,
      title: m.title,
      duration: m.duration,
      questionCount: m.questions.length,
      scenarioCount: m.scenarios ? m.scenarios.length : 0,
    })),
  });
}

function handleAssessmentStart(req, res, branch, pillarId, moduleId) {
  let questions;
  if (moduleId === 'all') {
    questions = getPillarQuestions(parseInt(pillarId));
  } else {
    questions = getModuleQuestions(parseInt(pillarId), moduleId);
  }
  if (!questions || questions.length === 0)
    return res.status(404).json({ error: 'No questions found for this module' });

  const shuffled = shuffleArray(questions);
  const formatted = formatQuestionsForClient(shuffled);

  // Store the question order so we can grade later
  const store = loadStore();
  const testSessionId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  if (!store.assessmentSessions) store.assessmentSessions = {};
  store.assessmentSessions[testSessionId] = {
    pillarId: parseInt(pillarId),
    moduleId,
    branchId: branch.branchId,
    questionIds: shuffled.map(q => q.id),
    startedAt: new Date().toISOString(),
  };
  saveStore(store);

  res.json({
    sessionId: testSessionId,
    pillarId: parseInt(pillarId),
    moduleId,
    questions: formatted,
    totalQuestions: formatted.length,
    passMark: CERTIFICATION_RULES.passMark,
  });
}

function handleAssessmentSubmit(req, res, branch, pillarId, moduleId) {
  const { answers, sessionId } = req.body || {};
  if (!answers || !Array.isArray(answers))
    return res.status(400).json({ error: 'Answers array is required' });

  const store = loadStore();

  // Recover the question order from session
  let questionIds;
  if (sessionId && store.assessmentSessions && store.assessmentSessions[sessionId]) {
    questionIds = store.assessmentSessions[sessionId].questionIds;
    delete store.assessmentSessions[sessionId]; // Clean up
  }

  // Get the actual questions in the right order
  let allQuestions;
  if (moduleId === 'all') {
    allQuestions = getPillarQuestions(parseInt(pillarId));
  } else {
    allQuestions = getModuleQuestions(parseInt(pillarId), moduleId);
  }

  // Reorder to match session if available
  let orderedQuestions = allQuestions;
  if (questionIds) {
    orderedQuestions = questionIds.map(id => allQuestions.find(q => q.id === id)).filter(Boolean);
  }

  const graded = gradeAnswers(orderedQuestions, answers);

  // Store attempt
  if (!store.assessmentAttempts) store.assessmentAttempts = [];
  const attempt = {
    id: (store.assessmentAttempts.length || 0) + 1,
    pillar_id: parseInt(pillarId),
    module_id: moduleId,
    branch_id: branch.branchId,
    branch_name: branch.name,
    branch_code: branch.code,
    user_email: branch.email || null,
    user_name: branch.userName || branch.name,
    score: graded.score,
    total: graded.total,
    percentage: graded.percentage,
    passed: graded.passed,
    answers: graded.results,
    completed_at: new Date().toISOString(),
  };

  store.assessmentAttempts.push(attempt);
  saveStore(store);

  res.json(attempt);
}

function handleAssessmentLeaderboard(req, res, branch, pillarId) {
  const store = loadStore();
  const attempts = (store.assessmentAttempts || []).filter(a => {
    if (pillarId) return a.pillar_id === parseInt(pillarId);
    return true;
  });

  if (!pillarId) {
    // Global leaderboard: average across all pillars per branch
    const branchData = {};
    for (const a of attempts) {
      if (!branchData[a.branch_id]) branchData[a.branch_id] = { attempts: [], name: a.branch_name, code: a.branch_code };
      branchData[a.branch_id].attempts.push(a);
    }
    const leaderboard = Object.values(branchData).map(bd => {
      const best = {};
      for (const a of bd.attempts) {
        const key = `${a.pillar_id}_${a.module_id}`;
        if (!best[key] || a.percentage > best[key].percentage) best[key] = a;
      }
      const bestArr = Object.values(best);
      const avgPct = Math.round(bestArr.reduce((s, a) => s + a.percentage, 0) / bestArr.length);
      return { branch_name: bd.name, branch_code: bd.code, tests_taken: bestArr.length, average_percentage: avgPct, tests_passed: bestArr.filter(a => a.passed).length };
    }).sort((a, b) => b.average_percentage - a.average_percentage);
    leaderboard.forEach((e, i) => e.rank = i + 1);
    return res.json(leaderboard);
  }

  // Per-pillar leaderboard: best score per branch
  const bestByBranch = {};
  for (const a of attempts) {
    if (!bestByBranch[a.branch_id] || a.percentage > bestByBranch[a.branch_id].percentage) {
      bestByBranch[a.branch_id] = a;
    }
  }
  const leaderboard = Object.values(bestByBranch)
    .sort((a, b) => b.percentage - a.percentage)
    .map((a, i) => ({ rank: i + 1, branch_name: a.branch_name, branch_code: a.branch_code, score: a.score, total: a.total, percentage: a.percentage, passed: a.passed, completed_at: a.completed_at }));
  res.json(leaderboard);
}

function handleAssessmentScenarios(req, res, pillarId, moduleId) {
  if (pillarId && moduleId) {
    const scenarios = getModuleScenarios(parseInt(pillarId), moduleId);
    return res.json(scenarios);
  }
  // Return cross-pillar scenarios
  res.json(SCENARIOS);
}

// --- Admin handlers ---

async function handleAdminDashboard(req, res, branch) {
  if (!isAdmin(branch)) return res.status(403).json({ error: 'Access denied. Admin only.' });

  try {
    const users = await loadUsers();
    const store = loadStore();
    const assessmentAttempts = store.assessmentAttempts || [];
    const testAttempts = store.testAttempts || [];
    const allAttempts = [...assessmentAttempts, ...testAttempts];

    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const pendingUsers = users.filter(u => u.status === 'pending').length;
    const approvedUsers = users.filter(u => u.status === 'approved').length;

    const totalAssessmentAttempts = assessmentAttempts.length;
    const avgScore = assessmentAttempts.length > 0
      ? Math.round(assessmentAttempts.reduce((s, a) => s + a.percentage, 0) / assessmentAttempts.length)
      : 0;
    const passRate = assessmentAttempts.length > 0
      ? Math.round((assessmentAttempts.filter(a => a.passed).length / assessmentAttempts.length) * 100)
      : 0;

    // Recent activity — last 20 assessment attempts
    const recentActivity = [...assessmentAttempts]
      .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
      .slice(0, 20)
      .map(a => {
        const pillar = PILLARS.find(p => p.id === a.pillar_id);
        return {
          user_email: a.user_email || a.branch_code,
          user_name: a.user_name || a.branch_name,
          pillar_title: pillar ? pillar.title : `Pillar ${a.pillar_id}`,
          module_id: a.module_id,
          score: a.score,
          total: a.total,
          percentage: a.percentage,
          passed: a.passed,
          completed_at: a.completed_at,
        };
      });

    res.json({ totalUsers, activeUsers, pendingUsers, approvedUsers, totalAssessmentAttempts, avgScore, passRate, recentActivity });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
}

async function handleAdminUsers(req, res, branch) {
  if (!isAdmin(branch)) return res.status(403).json({ error: 'Access denied. Admin only.' });

  try {
    const users = await loadUsers();
    const store = loadStore();
    const assessmentAttempts = store.assessmentAttempts || [];

    const result = users.map(u => {
      const userAttempts = assessmentAttempts.filter(a =>
        a.user_email && a.user_email.toLowerCase() === u.email.toLowerCase()
      );
      const totalAttempts = userAttempts.length;
      const avgPercentage = totalAttempts > 0
        ? Math.round(userAttempts.reduce((s, a) => s + a.percentage, 0) / totalAttempts)
        : 0;
      const passRate = totalAttempts > 0
        ? Math.round((userAttempts.filter(a => a.passed).length / totalAttempts) * 100)
        : 0;
      const lastActivity = userAttempts.length > 0
        ? userAttempts.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))[0].completed_at
        : null;
      const pillarsTested = [...new Set(userAttempts.map(a => a.pillar_id))].length;

      return {
        email: u.email,
        name: u.name,
        status: u.status,
        createdAt: u.createdAt,
        approvedAt: u.approvedAt || null,
        activatedAt: u.activatedAt || null,
        stats: { totalAttempts, avgPercentage, passRate, lastActivityAt: lastActivity, pillarsTested },
      };
    });

    // Sort: active first, then by name
    result.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      return a.name.localeCompare(b.name);
    });

    res.json(result);
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ error: 'Failed to load users' });
  }
}

async function handleAdminUserActivity(req, res, branch, userEmail) {
  if (!isAdmin(branch)) return res.status(403).json({ error: 'Access denied. Admin only.' });

  try {
    const users = await loadUsers();
    const user = users.find(u => u.email.toLowerCase() === decodeURIComponent(userEmail).toLowerCase());
    if (!user) return res.status(404).json({ error: 'User not found' });

    const store = loadStore();
    const assessmentAttempts = (store.assessmentAttempts || []).filter(a =>
      a.user_email && a.user_email.toLowerCase() === user.email.toLowerCase()
    );

    const attempts = assessmentAttempts
      .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
      .map(a => {
        const pillar = PILLARS.find(p => p.id === a.pillar_id);
        return {
          pillar_id: a.pillar_id,
          pillar_title: pillar ? pillar.title : `Pillar ${a.pillar_id}`,
          module_id: a.module_id,
          score: a.score,
          total: a.total,
          percentage: a.percentage,
          passed: a.passed,
          completed_at: a.completed_at,
        };
      });

    res.json({
      user: { email: user.email, name: user.name, status: user.status, createdAt: user.createdAt },
      attempts,
    });
  } catch (err) {
    console.error('Admin user activity error:', err);
    res.status(500).json({ error: 'Failed to load user activity' });
  }
}

// --- Main router ---

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = req.url.split('?')[0];

  // Public routes (no auth)
  if (url === '/api/auth/login' && req.method === 'POST') return handleAuthLogin(req, res);
  if (url === '/api/auth/register' && req.method === 'POST') return handleRegister(req, res);
  if (url === '/api/auth/set-password' && req.method === 'POST') return handleSetPassword(req, res);
  if (url === '/api/auth/branches') return handleAuthBranches(req, res);

  const approveMatch = url.match(/^\/api\/auth\/approve\/(.+)$/);
  if (approveMatch && req.method === 'GET') return handleApprove(req, res, approveMatch[1]);
  if (url === '/api/health') {
    const folderId = getDriveFolderId();
    return res.json({ status: 'ok', timestamp: new Date().toISOString(), folderIdLength: folderId ? folderId.length : 0, folderIdPreview: folderId ? folderId.substring(0, 5) + '...' : 'NOT SET' });
  }
  if (url === '/api/debug-sync' && req.method === 'POST') {
    try {
      const files = await listFiles();
      const store = loadStore();
      const results = [];
      for (const file of files) {
        const existing = store.documents.find((d) => d.drive_file_id === file.id);
        let status = 'new';
        if (existing && existing.last_modified === file.modifiedTime) status = 'skipped (unchanged)';
        else if (existing) status = 'update needed';
        try {
          const { content, exportedMimeType } = await downloadFileContent(file.id, file.mimeType);
          const text = await extractText(content, exportedMimeType);
          results.push({ name: file.name, mimeType: file.mimeType, exportedMimeType, contentType: typeof content, contentLength: content?.length || content?.byteLength || 0, textLength: text ? text.length : 0, textPreview: text ? text.substring(0, 200) : 'NULL', status });
        } catch (e) { results.push({ name: file.name, mimeType: file.mimeType, error: e.message, status }); }
      }
      return res.json({ filesFound: files.length, existingDocs: store.documents.length, existingChunks: store.chunks.length, results });
    } catch (e) { return res.status(500).json({ error: e.message }); }
  }

  // Protected routes
  const branch = requireAuth(req, res);
  if (!branch) return;

  // Admin routes
  if (url === '/api/admin/dashboard' && req.method === 'GET') return handleAdminDashboard(req, res, branch);
  if (url === '/api/admin/users' && req.method === 'GET') return handleAdminUsers(req, res, branch);
  const adminUserMatch = url.match(/^\/api\/admin\/user\/(.+)\/activity$/);
  if (adminUserMatch && req.method === 'GET') return handleAdminUserActivity(req, res, branch, adminUserMatch[1]);

  if (url === '/api/processes/categories') return handleCategories(req, res, branch);
  if (url === '/api/processes' && req.method === 'GET') return handleProcesses(req, res, branch);
  if (url === '/api/sync' && req.method === 'POST') return handleSync(req, res, branch);
  if (url === '/api/chat' && req.method === 'POST') return handleChat(req, res, branch);

  // Assessment Bank routes
  if (url === '/api/assessments/pillars' && req.method === 'GET') return handleAssessmentPillars(req, res);

  const pillarDetailMatch = url.match(/^\/api\/assessments\/pillars\/(\d+)$/);
  if (pillarDetailMatch && req.method === 'GET') return handleAssessmentPillarDetail(req, res, pillarDetailMatch[1]);

  const assessStartMatch = url.match(/^\/api\/assessments\/start\/(\d+)\/(.+)$/);
  if (assessStartMatch && req.method === 'POST') return handleAssessmentStart(req, res, branch, assessStartMatch[1], assessStartMatch[2]);

  const assessSubmitMatch = url.match(/^\/api\/assessments\/submit\/(\d+)\/(.+)$/);
  if (assessSubmitMatch && req.method === 'POST') return handleAssessmentSubmit(req, res, branch, assessSubmitMatch[1], assessSubmitMatch[2]);

  const assessLeaderboardPillarMatch = url.match(/^\/api\/assessments\/leaderboard\/(\d+)$/);
  if (assessLeaderboardPillarMatch && req.method === 'GET') return handleAssessmentLeaderboard(req, res, branch, assessLeaderboardPillarMatch[1]);

  if (url === '/api/assessments/leaderboard' && req.method === 'GET') return handleAssessmentLeaderboard(req, res, branch, null);

  if (url === '/api/assessments/scenarios' && req.method === 'GET') return handleAssessmentScenarios(req, res, null, null);

  const assessScenariosMatch = url.match(/^\/api\/assessments\/scenarios\/(\d+)\/(.+)$/);
  if (assessScenariosMatch && req.method === 'GET') return handleAssessmentScenarios(req, res, assessScenariosMatch[1], assessScenariosMatch[2]);

  // Test routes (legacy AI-generated)
  const testGenerateMatch = url.match(/^\/api\/tests\/generate\/(\d+)$/);
  if (testGenerateMatch && req.method === 'POST') return handleTestGenerate(req, res, branch, testGenerateMatch[1]);

  const testQuestionsMatch = url.match(/^\/api\/tests\/questions\/(\d+)$/);
  if (testQuestionsMatch && req.method === 'GET') return handleTestQuestions(req, res, branch, testQuestionsMatch[1]);

  const testSubmitMatch = url.match(/^\/api\/tests\/submit\/(\d+)$/);
  if (testSubmitMatch && req.method === 'POST') return handleTestSubmit(req, res, branch, testSubmitMatch[1]);

  const testAttemptsMatch = url.match(/^\/api\/tests\/attempts\/(\d+)$/);
  if (testAttemptsMatch && req.method === 'GET') return handleTestAttempts(req, res, branch, testAttemptsMatch[1]);

  const testLeaderboardMatch = url.match(/^\/api\/tests\/leaderboard\/(\d+)$/);
  if (testLeaderboardMatch && req.method === 'GET') return handleTestLeaderboard(req, res, branch, testLeaderboardMatch[1]);

  if (url === '/api/tests/leaderboard' && req.method === 'GET') return handleGlobalLeaderboard(req, res, branch);

  // Dynamic route: /api/processes/:id
  const processMatch = url.match(/^\/api\/processes\/(\d+)$/);
  if (processMatch) return handleProcessById(req, res, branch, processMatch[1]);

  res.status(404).json({ error: 'Not found' });
}
