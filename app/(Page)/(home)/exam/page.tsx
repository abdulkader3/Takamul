"use client";

import { useState, useEffect } from "react";
import { questions, totalQuestions } from "./data";

const optionLabels = ["A", "B", "C", "D"];

interface Result {
  questionId: number;
  selectedAnswerIndex: number;
  isCorrect: boolean;
}

export default function Exam() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [isExamComplete, setIsExamComplete] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [examStarted, setExamStarted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = currentQuestionIndex > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  useEffect(() => {
    const savedData = localStorage.getItem("exam_progress");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.results && parsed.results.length > 0) {
          setResults(parsed.results);
          setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
          setExamStarted(true);
          if (parsed.isExamComplete) {
            setIsExamComplete(true);
          }
          // Set selected answer to the saved answer for current question
          const savedResult = parsed.results[parsed.currentQuestionIndex];
          if (savedResult && savedResult.selectedAnswerIndex >= 0) {
            setSelectedAnswer(savedResult.selectedAnswerIndex);
          }
        }
      } catch (e) {
        console.error("Error parsing saved exam data:", e);
        localStorage.removeItem("exam_progress");
      }
    }
    setIsLoaded(true);
  }, []);

  const startExam = () => {
    // Pre-populate results array with null results for each question
    const emptyResults: Result[] = Array(totalQuestions).fill(null).map((_, i) => ({
      questionId: i + 1,
      selectedAnswerIndex: -1,
      isCorrect: false
    }));
    setResults(emptyResults);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setExamStarted(true);
    setIsExamComplete(false);
  };

  const saveToLocalStorage = (newResults: Result[], newIndex: number, complete: boolean) => {
    localStorage.setItem("exam_progress", JSON.stringify({
      results: newResults,
      currentQuestionIndex: newIndex,
      isExamComplete: complete,
      savedAt: new Date().toISOString()
    }));
  };

  const handleStartOver = () => {
    if (confirm("Are you sure you want to start over? All progress will be lost.")) {
      localStorage.removeItem("exam_progress");
      setResults([]);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsExamComplete(false);
      setExamStarted(false);
      setShowResultsModal(false);
    }
  };

  const handleNext = () => {
    const newResult: Result = {
      questionId: currentQuestion.id,
      selectedAnswerIndex: selectedAnswer !== null ? selectedAnswer : -1,
      isCorrect: selectedAnswer === currentQuestion.correctAnswerIndex
    };
    
    // Replace result for current question index to avoid duplicates
    const newResults = [...results];
    newResults[currentQuestionIndex] = newResult;
    setResults(newResults);
    saveToLocalStorage(newResults, currentQuestionIndex, isLastQuestion);
    setShowConfirmModal(true);
  };

  const handleSubmit = () => {
    const newResult: Result = {
      questionId: currentQuestion.id,
      selectedAnswerIndex: selectedAnswer !== null ? selectedAnswer : -1,
      isCorrect: selectedAnswer === currentQuestion.correctAnswerIndex
    };
    
    // Replace result for current question index to avoid duplicates
    const newResults = [...results];
    newResults[currentQuestionIndex] = newResult;
    setResults(newResults);
    setShowConfirmModal(false);
    
    if (isLastQuestion) {
      setIsExamComplete(true);
      saveToLocalStorage(newResults, currentQuestionIndex, true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      saveToLocalStorage(newResults, currentQuestionIndex + 1, false);
    }
  };

  const handleGoBack = () => {
    setShowConfirmModal(false);
  };

  const handleOptionChange = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleViewResults = () => {
    setShowResultsModal(true);
  };

  const toggleQuestionExpand = (questionId: number) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const correctCount = results.filter(r => r.isCorrect).length;
  const wrongCount = results.filter(r => !r.isCorrect).length;

  if (!isLoaded) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="bg-tertiary-fixed w-16 h-16 rounded-full flex items-center justify-center text-on-tertiary-fixed">
          <span className="material-symbols-outlined text-4xl animate-spin">sync</span>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-on-surface-variant">Something went wrong</p>
        <button onClick={handleStartOver} className="mt-4 text-tertiary">Start Over</button>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="h-full flex flex-col">
        <div className="w-full h-[16px] bg-surface-container-highest flex-shrink-0">
          <div className="h-full bg-on-tertiary-container" style={{ width: '0%' }}></div>
        </div>
        <header className="flex-shrink-0 border-b border-slate-100 shadow-sm bg-white">
          <div className="flex justify-between items-center w-full px-4 py-3 max-w-[1024px] mx-auto">
            <button aria-label="Home" className="text-tertiary-container hover:bg-slate-50 transition-colors active:scale-95 duration-150 p-1.5 rounded-full focus:outline-none focus:ring-4 focus:ring-tertiary-fixed">
              <span className="material-symbols-outlined text-3xl">home</span>
            </button>
            <h1 className="text-tertiary-container font-bold text-xl tracking-tight">প্রস্তুতি নিন</h1>
            <div className="w-9"></div>
          </div>
        </header>
        <main className="flex-1 w-full max-w-container-max mx-auto px-6 py-4 flex flex-col items-center justify-center">
          <div className="bg-tertiary-fixed w-32 h-32 rounded-full flex items-center justify-center text-on-tertiary-fixed shadow-sm mb-6">
            <span className="material-symbols-outlined text-6xl">assignment</span>
          </div>
          <h2 className="text-2xl font-bold text-tertiary mb-4">লোডার ও আনলোডার ট্রেড টেস্ট</h2>
          <p className="text-lg text-on-surface-variant mb-8">মোট ১০টি প্রশ্ন</p>
          <button onClick={startExam} className="w-full max-w-[320px] h-14 bg-tertiary hover:bg-tertiary-container text-on-tertiary font-button text-button rounded-full flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]">
            পরীকা শুরু করুন
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-[16px] bg-surface-container-highest flex-shrink-0">
        <div className="h-full bg-on-tertiary-container transition-all duration-500 ease-in-out" style={{ width: `${isExamComplete ? 100 : progress}%` }}></div>
      </div>
      <header className="flex-shrink-0 border-b border-slate-100 shadow-sm bg-white">
        <div className="flex justify-between items-center w-full px-4 py-3 max-w-[1024px] mx-auto">
          <button onClick={handleStartOver} aria-label="Start Over" className="text-tertiary-container hover:bg-slate-50 transition-colors active:scale-95 duration-150 p-1.5 rounded-full focus:outline-none focus:ring-4 focus:ring-tertiary-fixed">
            <span className="material-symbols-outlined text-3xl">refresh</span>
          </button>
          <h1 className="text-tertiary-container font-bold text-xl tracking-tight">Question {currentQuestionIndex + 1} of {totalQuestions}</h1>
          <div className="w-9"></div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-container-max mx-auto px-6 py-4 flex flex-col overflow-hidden">
        {isExamComplete ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="bg-tertiary-fixed w-32 h-32 rounded-full flex items-center justify-center text-on-tertiary-fixed shadow-sm mb-6">
              <span className="material-symbols-outlined text-6xl">check_circle</span>
            </div>
            <h2 className="text-2xl font-bold text-tertiary mb-4">পরীক্ষা সম্পন্ন!</h2>
            <p className="text-lg text-on-surface-variant mb-8">আপনি সফলভাবে পরীক্ষা শেষ করেছেন</p>
            <button onClick={handleViewResults} className="w-full max-w-[320px] h-14 bg-tertiary hover:bg-tertiary-container text-on-tertiary font-button text-button rounded-full flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]">
              ফলাফল দেখুন
              <span className="material-symbols-outlined text-xl">visibility</span>
            </button>
          </div>
        ) : (
          <>
            <section className="mb-4 text-center md:text-left flex-shrink-0">
              <h2 className="text-3xl font-bold max-w-6xl">
                {currentQuestion.question}
              </h2>
            </section>
            <section aria-label="Multiple choice options" className="flex-1 flex flex-col gap-3" role="radiogroup">
              {currentQuestion.options.map((option, index) => (
                <label key={index} className={`group relative flex items-center p-3 bg-surface-container-lowest border-2 border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-all duration-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] ${selectedAnswer === index ? 'bg-tertiary-fixed border-4 border-tertiary' : ''}`}>
                  <input 
                    className="peer sr-only" 
                    name="answer" 
                    type="radio" 
                    value={index}
                    checked={selectedAnswer === index}
                    onChange={() => handleOptionChange(index)}
                  />
                  <div className="flex items-center gap-3 w-full">
                    <div className={`flex-shrink-0 w-11 h-11 rounded-full bg-surface-container flex items-center justify-center font-headline-md text-headline-md text-on-surface-variant transition-colors ${selectedAnswer === index ? 'bg-surface-container-lowest text-tertiary' : ''}`}>
                      {optionLabels[index]}
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <span className={`font-body-lg text-body-lg text-on-background ${selectedAnswer === index ? 'font-semibold' : ''}`}>{option}</span>
                    </div>
                  </div>
                </label>
              ))}
            </section>
            <section className="mt-4 pt-2 flex-shrink-0">
              <button onClick={handleNext} className="w-full h-14 bg-tertiary hover:bg-tertiary-container text-on-tertiary font-button text-button rounded-full flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-tertiary-fixed">
                {isLastQuestion ? "Submit" : "Next"}
                <span className="material-symbols-outlined text-xl">{isLastQuestion ? "send" : "arrow_forward"}</span>
              </button>
            </section>
          </>
        )}
      </main>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
          <div className="relative w-full max-w-[400px] bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.15)] border border-outline-variant flex flex-col items-center text-center overflow-hidden p-8">
            <div className="absolute top-0 left-0 w-full h-2 bg-tertiary"></div>
            <div className="bg-tertiary-fixed w-40 h-40 rounded-full flex items-center justify-center text-on-tertiary-fixed shadow-sm mt-4">
              <span className="material-symbols-outlined text-[80px]">help_outline</span>
            </div>
            <h1 className="font-bold text-2xl text-tertiary max-w-[320px] mt-6">
              {isLastQuestion ? "আপনি কি পরীক্ষা শেষ করতে চান?" : "পরবর্তী প্রশ্নে যেতে চান?"}
            </h1>
            <div className="w-full max-w-[320px] flex flex-col gap-3 mt-8">
              <button onClick={handleSubmit} className="w-full min-h-[72px] bg-tertiary text-on-tertiary font-button text-button rounded-lg flex items-center justify-center gap-2 shadow-[0_4px_12px_-4px_rgba(0,31,11,0.4)] hover:bg-[#001407] active:border-4 active:border-tertiary active:shadow-none transition-all duration-150">
                <span className="material-symbols-outlined text-[28px]">send</span>
                {isLastQuestion ? "হ্যাঁ, জমা দিন" : "হ্যাঁ, পরবর্তী"}
              </button>
              <button onClick={handleGoBack} className="w-full min-h-[72px] bg-transparent border-[3px] border-tertiary text-tertiary font-button text-button rounded-lg flex items-center justify-center gap-2 hover:bg-surface-variant active:bg-surface-container-high transition-colors duration-150">
                <span className="material-symbols-outlined text-[28px]">arrow_back</span>
                না, ফিরে যান
              </button>
            </div>
          </div>
        </div>
      )}

      {showResultsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
          <div className="relative w-full max-w-[500px] max-h-[80vh] bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.15)] border border-outline-variant flex flex-col overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-tertiary"></div>
            <div className="p-6 border-b border-outline-variant flex-shrink-0">
              <div className="flex justify-between items-center mb-4">
                <h1 className="font-bold text-2xl text-tertiary">ফলাফল</h1>
                <button onClick={handleStartOver} className="text-tertiary hover:bg-surface-container-low px-3 py-1 rounded-lg text-sm font-medium">
                  নতুন করে শুরু
                </button>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 bg-tertiary-fixed rounded-lg p-4 text-center">
                  <span className="text-3xl font-bold text-tertiary block">{correctCount}</span>
                  <span className="text-sm text-on-tertiary-fixed">সঠিক</span>
                </div>
                <div className="flex-1 bg-error-container rounded-lg p-4 text-center">
                  <span className="text-3xl font-bold text-error block">{wrongCount}</span>
                  <span className="text-sm text-on-error-container">ভুল</span>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {results.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-2">info</span>
                  <p>কোনো ফলাফল নেই</p>
                </div>
              ) : (
              results.map((result, index) => {
                const question = questions.find(q => q.id === result.questionId);
                if (!question) return null;
                const isExpanded = expandedQuestion === result.questionId;
                
                return (
                  <div key={`result-${index}`} className="mb-3">
                    <div 
                      onClick={() => toggleQuestionExpand(result.questionId)}
                      className={`p-3 rounded-lg cursor-pointer flex items-center justify-between ${result.isCorrect ? 'bg-tertiary-fixed/50' : 'bg-error-container/50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined ${result.isCorrect ? 'text-tertiary' : 'text-error'}`}>
                          {result.isCorrect ? 'check_circle' : 'cancel'}
                        </span>
                        <span className="font-medium">প্রশ্ন {index + 1}</span>
                      </div>
                      <span className="material-symbols-outlined text-2xl transition-transform duration-200">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </div>
                    {isExpanded && (
                      <div className="mt-2 p-3 bg-surface-container-low rounded-lg text-sm">
                        <p className="font-medium mb-2">{question.question}</p>
                        <div className="space-y-1 text-on-surface-variant">
                          <p>আপনার উত্তর: <span className={result.isCorrect ? 'text-tertiary font-medium' : 'text-error font-medium'}>{question.options[result.selectedAnswerIndex] || "উত্তর দেননি"}</span></p>
                          {!result.isCorrect && (
                            <p>সঠিক উত্তর: <span className="text-tertiary font-medium">{question.options[question.correctAnswerIndex]}</span></p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
