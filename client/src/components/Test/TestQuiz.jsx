import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import QuestionCard from './QuestionCard';

export default function TestQuiz({ questions, onSubmit, submitting }) {
  const [answers, setAnswers] = useState({});

  const handleAnswer = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const answeredCount = Object.values(answers).filter((a) => a && a.trim().length > 0).length;
  const allAnswered = answeredCount === questions.length;

  const handleSubmit = () => {
    const formatted = questions.map((q, i) => ({
      index: i,
      answer: answers[i] || '',
    }));
    onSubmit(formatted);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {answeredCount} of {questions.length} questions answered
        </p>
        <div className="w-48 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <QuestionCard
            key={i}
            question={q}
            index={i}
            selectedAnswer={answers[i]}
            onAnswer={handleAnswer}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!allAnswered || submitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {submitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
          {submitting ? 'Submitting...' : 'Submit Test'}
        </button>
      </div>
    </div>
  );
}
