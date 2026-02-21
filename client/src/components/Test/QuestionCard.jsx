export default function QuestionCard({ question, index, selectedAnswer, onAnswer }) {
  const { type, question: text, options } = question;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <span className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-semibold">
          {index + 1}
        </span>
        <div>
          <p className="text-gray-900 font-medium">{text}</p>
          <span className="text-xs text-gray-400 mt-1 inline-block">
            {type === 'multiple_choice' ? 'Multiple Choice' : type === 'true_false' ? 'True / False' : 'Short Answer'}
          </span>
        </div>
      </div>

      {type === 'multiple_choice' && (
        <div className="space-y-2 ml-10">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onAnswer(index, opt)}
              className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition ${
                selectedAnswer === opt
                  ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {type === 'true_false' && (
        <div className="flex gap-3 ml-10">
          {['True', 'False'].map((opt) => (
            <button
              key={opt}
              onClick={() => onAnswer(index, opt)}
              className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition ${
                selectedAnswer === opt
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {type === 'short_answer' && (
        <div className="ml-10">
          <input
            type="text"
            value={selectedAnswer || ''}
            onChange={(e) => onAnswer(index, e.target.value)}
            placeholder="Type your answer..."
            className="w-full max-w-md px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}
    </div>
  );
}
