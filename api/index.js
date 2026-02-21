import { loadStore, saveStore, getNextId } from './lib/store.js';
import { createToken, requireAuth } from './lib/auth.js';
import { listFiles, downloadFileContent } from './lib/drive.js';
import { generateEmbeddings } from './lib/embedding.js';
import { generateRagResponse } from './lib/rag.js';
import { getDriveFolderId, getGeminiApiKey } from './lib/config.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

// --- Route handlers ---

async function handleAuthLogin(req, res) {
  const { code } = req.body || {};
  if (!code) return res.status(400).json({ error: 'Branch code is required' });
  const store = loadStore();
  const branch = store.branches.find((b) => b.code === code.toUpperCase());
  if (!branch) return res.status(401).json({ error: 'Invalid branch code' });
  const token = createToken(branch);
  res.json({ token, branch: { id: branch.id, name: branch.name, code: branch.code } });
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

// --- Main router ---

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = req.url.split('?')[0];

  // Public routes (no auth)
  if (url === '/api/auth/login' && req.method === 'POST') return handleAuthLogin(req, res);
  if (url === '/api/auth/branches') return handleAuthBranches(req, res);
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

  if (url === '/api/processes/categories') return handleCategories(req, res, branch);
  if (url === '/api/processes' && req.method === 'GET') return handleProcesses(req, res, branch);
  if (url === '/api/sync' && req.method === 'POST') return handleSync(req, res, branch);
  if (url === '/api/chat' && req.method === 'POST') return handleChat(req, res, branch);

  // Test routes
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
