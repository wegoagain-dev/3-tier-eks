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
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <div className="font-mono text-cyan text-xs animate-pulse mb-2">LOADING_MODULE...</div>
        <div className="w-32 h-0.5 bg-slate overflow-hidden">
          <div className="h-full bg-cyan w-1/2 animate-[shimmer_1s_infinite_linear]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <div className="bg-red-900/10 border border-red-500/50 p-6 rounded backdrop-blur-sm max-w-lg w-full">
          <h2 className="font-mono text-red-500 font-bold mb-2">SYSTEM_ERROR</h2>
          <p className="text-red-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 rounded font-mono text-xs uppercase transition-colors"
          >
            Return to Base
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="font-mono text-gray-500">MODULE_NOT_FOUND</div>
      </div>
    );
  }

  // Calculate progress
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / quiz.questions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl relative">
       {/* Background Grid */}
       <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-end justify-between mb-8 pb-4 border-b border-slate relative z-10">
        <div>
          <div className="font-mono text-xs text-cyan mb-1">active_module:</div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{quiz.title}</h1>
          <p className="font-mono text-gray-500 text-xs mt-2">
            ID: {topic.toUpperCase()} <span className="mx-1 text-slate">/</span> Q_COUNT: {quiz.questions.length}
          </p>
        </div>
        {!result && (
          <div className="text-right">
            <div className="font-mono text-2xl font-bold text-cyan">
              {String(answeredCount).padStart(2, '0')}<span className="text-gray-600">/</span>{String(quiz.questions.length).padStart(2, '0')}
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Progress</div>
          </div>
        )}
      </div>

      {!result && (
        <div className="w-full bg-slate h-1 mb-12 relative z-10">
          <div 
            className="bg-cyan h-1 shadow-[0_0_10px_rgba(0,243,255,0.5)] transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      )}
      
      {!result ? (
        <div className="space-y-12 relative z-10">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="relative group">
               {/* Vertical decorative line */}
               <div className="absolute left-[-20px] top-0 bottom-0 w-[1px] bg-slate group-hover:bg-cyan/30 transition-colors hidden md:block"></div>
               
              <div className="mb-6 flex items-start">
                <span className="font-mono text-xs text-cyan mr-4 mt-1 bg-cyan/10 px-2 py-1 rounded">
                  Q_{String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-lg md:text-xl font-medium text-gray-200 leading-relaxed">
                  {question.question}
                </p>
              </div>

              <div className="space-y-3 pl-0 md:pl-12">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className={`block relative p-4 cursor-pointer transition-all duration-200 border ${
                      answers[question.id] === optionIndex
                        ? 'bg-cyan/10 border-cyan text-cyan'
                        : 'bg-charcoal/50 border-slate text-gray-400 hover:border-cyan/50 hover:text-gray-200'
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
                      <div className={`font-mono text-xs mr-4 ${
                        answers[question.id] === optionIndex ? 'text-cyan' : 'text-gray-600'
                      }`}>
                        [{String.fromCharCode(65 + optionIndex)}]
                      </div>
                      <span className="text-sm md:text-base font-light">
                        {option}
                      </span>
                    </div>
                    
                    {/* Corner Accent */}
                    {answers[question.id] === optionIndex && (
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan"></div>
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}
          
          <div className="pt-8 border-t border-slate">
            <button
              onClick={handleSubmit}
              className="w-full md:w-auto bg-cyan text-black font-bold font-mono text-sm px-8 py-4 hover:bg-white hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all duration-300 uppercase tracking-wider clip-path-polygon"
            >
              Execute_Submission
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-1 rounded border border-slate relative z-10">
            <div className="bg-obsidian/90 p-8 md:p-12 text-center relative overflow-hidden">
                {/* Result Background Effects */}
                <div className={`absolute inset-0 opacity-10 ${result.score >= 70 ? 'bg-green-500' : 'bg-red-500'}`}></div>

                <div className="relative z-10">
                    <div className="font-mono text-xs text-gray-500 uppercase tracking-[0.2em] mb-2">Evaluation Complete</div>
                    <h2 className="text-4xl font-bold text-white mb-8">
                        {result.score >= 70 ? 'OBJECTIVES_ACHIEVED' : 'MISSION_FAILED'}
                    </h2>
                    
                    <div className="relative inline-flex items-center justify-center mb-12">
                        <svg className="w-48 h-48 transform -rotate-90">
                            <circle
                            className="text-slate"
                            strokeWidth="4"
                            stroke="currentColor"
                            fill="transparent"
                            r="80"
                            cx="96"
                            cy="96"
                            />
                            <circle
                            className={`transition-all duration-1000 ease-out ${result.score >= 70 ? 'text-green-500 shadow-[0_0_20px_#22c55e]' : 'text-red-500 shadow-[0_0_20px_#ef4444]'}`}
                            strokeWidth="4"
                            strokeDasharray={502}
                            strokeDashoffset={502 - (502 * result.score) / 100}
                            strokeLinecap="square"
                            stroke="currentColor"
                            fill="transparent"
                            r="80"
                            cx="96"
                            cy="96"
                            />
                        </svg>
                        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                            <span className="text-5xl font-mono font-bold text-white">{Math.round(result.score)}%</span>
                            <span className="text-[10px] text-gray-500 uppercase mt-2">Accuracy</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-12">
                        <div className="bg-slate/30 p-4 border border-slate/50">
                            <p className="text-2xl font-mono font-bold text-green-500">{result.correct}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Correct</p>
                        </div>
                        <div className="bg-slate/30 p-4 border border-slate/50">
                            <p className="text-2xl font-mono font-bold text-gray-400">{result.total}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleTryAgain}
                            className="px-8 py-3 bg-slate hover:bg-slate/80 text-white font-mono text-xs uppercase tracking-wider border border-slate hover:border-white/20 transition-all"
                        >
                            Retry_Module
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-cyan text-black font-mono text-xs uppercase tracking-wider hover:bg-white hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all"
                        >
                            Return_Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;
