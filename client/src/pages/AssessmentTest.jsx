import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assessmentApi } from '../services/api';
import { ArrowLeft, ClipboardCheck, Loader2, Trophy, CheckCircle, XCircle, RotateCcw, BarChart3 } from 'lucide-react';

function QuestionCard({ index, question, selectedAnswer, onAnswer }) {
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
      <div className="flex items-start gap-3 mb-4">
        <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-sm font-bold">
          {index + 1}
        </span>
        <p className="text-gray-900 font-medium leading-relaxed">{question.question}</p>
      </div>
      <div className="grid grid-cols-1 gap-2 ml-11">
        {question.options.map((opt, i) => {
          const isSelected = selectedAnswer === opt;
          return (
            <button
              key={i}
              onClick={() => onAnswer(opt)}
              className={`text-left px-4 py-3 rounded-lg border-2 text-sm transition ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-800 font-medium'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultCard({ result, index }) {
  return (
    <div className={`rounded-xl border p-4 mb-3 ${result.is_correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 mt-0.5 ${result.is_correct ? 'text-green-600' : 'text-red-600'}`}>
          {result.is_correct ? <CheckCircle size={20} /> : <XCircle size={20} />}
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900 text-sm">{index + 1}. {result.question}</p>
          {!result.is_correct && (
            <div className="mt-2 space-y-1 text-sm">
              <p className="text-red-600">Your answer: {result.user_answer || 'Not answered'}</p>
              <p className="text-green-700 font-medium">Correct: {result.correct_answer}</p>
            </div>
          )}
          <p className="mt-1.5 text-xs text-gray-500">{result.explanation}</p>
        </div>
      </div>
    </div>
  );
}

export default function AssessmentTest() {
  const { pillarId, moduleId } = useParams();
  const { branch } = useAuth();
  const [phase, setPhase] = useState('loading'); // loading, quiz, submitting, results
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [testInfo, setTestInfo] = useState(null);
  const [error, setError] = useState('');
  const [pillarInfo, setPillarInfo] = useState(null);

  useEffect(() => {
    loadTest();
  }, [pillarId, moduleId]);

  async function loadTest() {
    setPhase('loading');
    setError('');
    try {
      const [testData, pillarData] = await Promise.all([
        assessmentApi.startTest(pillarId, moduleId),
        assessmentApi.getPillarDetail(pillarId),
      ]);
      setQuestions(testData.questions);
      setSessionId(testData.sessionId);
      setTestInfo(testData);
      setPillarInfo(pillarData);
      setAnswers({});
      setPhase('quiz');
    } catch (err) {
      setError(err.message || 'Failed to load test');
      setPhase('loading');
    }
  }

  function handleAnswer(questionIndex, answer) {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  }

  async function handleSubmit() {
    setPhase('submitting');
    try {
      const answerArray = Object.entries(answers).map(([index, answer]) => ({
        index: parseInt(index),
        answer,
      }));
      const data = await assessmentApi.submitTest(pillarId, moduleId, answerArray, sessionId);
      setResult(data);
      setPhase('results');
    } catch (err) {
      setError(err.message || 'Failed to submit test');
      setPhase('quiz');
    }
  }

  function handleRetake() {
    setResult(null);
    setAnswers({});
    loadTest();
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const allAnswered = answeredCount === totalQuestions;
  const progressPct = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  // Get module title
  let moduleTitle = 'Full Pillar Assessment';
  if (pillarInfo && moduleId !== 'all') {
    const mod = pillarInfo.modules.find(m => m.id === moduleId);
    if (mod) moduleTitle = mod.title;
  }

  if (phase === 'loading' && !error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600 font-medium">Loading assessment questions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link to={`/assessments/${pillarId}`} className="flex items-center gap-1 text-sm text-blue-600 hover:underline mb-3">
          <ArrowLeft size={14} />
          Back to Pillar {pillarId}
        </Link>
        <div className="flex items-center gap-3">
          <div className="bg-green-600 text-white p-2 rounded-lg">
            <ClipboardCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{moduleTitle}</h1>
            <p className="text-sm text-gray-500">
              {pillarInfo ? `Pillar ${pillarInfo.id}: ${pillarInfo.title}` : ''}
              {testInfo ? ` • ${testInfo.totalQuestions} Questions • ${testInfo.passMark}% to pass` : ''}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Quiz Phase */}
      {(phase === 'quiz' || phase === 'submitting') && (
        <>
          {/* Progress Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 sticky top-0 z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {answeredCount} of {totalQuestions} answered
              </span>
              <span className="text-sm font-medium text-blue-600">{progressPct}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Questions */}
          {questions.map((q, idx) => (
            <QuestionCard
              key={q.id || idx}
              index={idx}
              question={q}
              selectedAnswer={answers[idx]}
              onAnswer={(ans) => handleAnswer(idx, ans)}
            />
          ))}

          {/* Submit Button */}
          <div className="mt-6 flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">
              {allAnswered ? 'All questions answered! Ready to submit.' : `${totalQuestions - answeredCount} questions remaining`}
            </p>
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || phase === 'submitting'}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {phase === 'submitting' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Assessment'
              )}
            </button>
          </div>
        </>
      )}

      {/* Results Phase */}
      {phase === 'results' && result && (
        <>
          {/* Score Banner */}
          <div className={`rounded-xl p-6 mb-6 ${result.passed ? 'bg-green-600' : 'bg-red-600'} text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {result.passed ? <CheckCircle size={28} /> : <XCircle size={28} />}
                  <span className="text-2xl font-bold">{result.passed ? 'PASSED!' : 'NOT PASSED'}</span>
                </div>
                <p className="text-white/80 text-sm">
                  {result.passed ? 'Congratulations! You have demonstrated competency.' : 'Review the correct answers below and retake when ready.'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{result.percentage}%</div>
                <div className="text-white/80 text-sm">{result.score}/{result.total} correct</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleRetake}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <RotateCcw size={14} />
              Retake Test
            </button>
            <Link
              to={`/assessments/${pillarId}`}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <BarChart3 size={14} />
              Back to Pillar
            </Link>
            <Link
              to="/leaderboard"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              <Trophy size={14} />
              Leaderboard
            </Link>
          </div>

          {/* Question Review */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Question Review</h2>
            {result.answers.map((r, idx) => (
              <ResultCard key={idx} result={r} index={idx} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
