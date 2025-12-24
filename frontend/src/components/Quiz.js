import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

function Quiz() {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuiz = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/quiz/${topic}`);
      if (!response.ok) {
        throw new Error('Failed to fetch quiz');
      }
      const data = await response.json();
      setQuiz(data);
      setAnswers({});
      setError(null);
    } catch (err) {
      console.error('Error fetching quiz:', err);
      setError('Failed to load quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [topic]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmit = async () => {
    try {
      const answeredQuestions = Object.keys(answers).length;
      const totalQuestions = quiz.questions.length;

      if (answeredQuestions < totalQuestions) {
        alert(`Please answer all questions (${answeredQuestions}/${totalQuestions} answered)`);
        return;
      }

      const response = await fetch(`${API_URL}/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic,
          answers: answers
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit quiz');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Please try again.');
    }
  };

  const handleTryAgain = async () => {
    setResult(null);
    setAnswers({});
    await fetchQuiz();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-500">
        No quiz found for this topic.
      </div>
    );
  }

  // Calculate progress
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / quiz.questions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{quiz.title} Quiz</h1>
          <p className="text-gray-500 mt-1">
            {quiz.selected_questions} Questions selected from pool
          </p>
        </div>
        {!result && (
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {answeredCount}/{quiz.questions.length}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Answered</div>
          </div>
        )}
      </div>

      {!result && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      )}
      
      {!result ? (
        <div className="space-y-8">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Question {index + 1}</span>
                {answers[question.id] !== undefined && (
                  <span className="text-green-500 text-xs font-bold flex items-center">
                    ✓ ANSWERED
                  </span>
                )}
              </div>
              <div className="p-6">
                <p className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
                  {question.question}
                </p>
                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className={`block relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
                        answers[question.id] === optionIndex
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        className="sr-only"
                        checked={answers[question.id] === optionIndex}
                        onChange={() => handleAnswerSelect(question.id, optionIndex)}
                      />
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          answers[question.id] === optionIndex ? 'border-blue-500' : 'border-gray-300'
                        }`}>
                          {answers[question.id] === optionIndex && (
                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <span className={`text-base ${answers[question.id] === optionIndex ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                          {option}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white text-lg font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Submit All Answers
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-blue-100">Here is your performance report</p>
          </div>
          
          <div className="p-10 text-center">
            <div className="relative inline-flex items-center justify-center mb-8">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  className="text-gray-200"
                  strokeWidth="12"
                  stroke="currentColor"
                  fill="transparent"
                  r="70"
                  cx="80"
                  cy="80"
                />
                <circle
                  className={`transition-all duration-1000 ease-out ${result.score >= 70 ? 'text-green-500' : result.score >= 40 ? 'text-yellow-500' : 'text-red-500'}`}
                  strokeWidth="12"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * result.score) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="70"
                  cx="80"
                  cy="80"
                />
              </svg>
              <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-800">{Math.round(result.score)}%</span>
                <span className="text-xs text-gray-500 uppercase font-semibold mt-1">Score</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="text-2xl font-bold text-green-600">{result.correct}</p>
                <p className="text-xs text-green-800 uppercase font-bold">Correct</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-2xl font-bold text-gray-700">{result.total}</p>
                <p className="text-xs text-gray-500 uppercase font-bold">Total</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleTryAgain}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
              >
                Try Another Quiz
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;