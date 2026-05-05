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
  
  // Timer states
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [timerStarted, setTimerStarted] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [examStartTime, setExamStartTime] = useState<number | null>(null);
  const [examEndTime, setExamEndTime] = useState<number | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = currentQuestionIndex > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Timer formatting function
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    if (timerStarted && timeLeft > 0 && !isExamComplete) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          // Save to localStorage periodically
          const savedData = JSON.parse(localStorage.getItem("exam_progress") || "{}");
          localStorage.setItem("exam_progress", JSON.stringify({
            ...savedData,
            timeLeft: newTime,
            timerStarted: true
          }));
          return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    
    if (timeLeft === 0 && !isExamComplete && timerStarted) {
      setShowTimeUpModal(true);
    }
  }, [timerStarted, timeLeft, isExamComplete]);

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
          // Restore timer state
          if (parsed.timeLeft !== undefined) {
            setTimeLeft(parsed.timeLeft);
          }
          if (parsed.timerStarted) {
            setTimerStarted(true);
          }
          if (parsed.examStartTime) {
            setExamStartTime(parsed.examStartTime);
          }
          if (parsed.examEndTime) {
            setExamEndTime(parsed.examEndTime);
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
    // Initialize timer
    setTimeLeft(1800); // 30 minutes
    setTimerStarted(true);
    const startTime = Date.now();
    setExamStartTime(startTime);
    setExamEndTime(null);
    // Save to localStorage
    localStorage.setItem("exam_progress", JSON.stringify({
      results: emptyResults,
      currentQuestionIndex: 0,
      isExamComplete: false,
      timeLeft: 1800,
      timerStarted: true,
      examStartTime: startTime
    }));
  };

  const saveToLocalStorage = (newResults: Result[], newIndex: number, complete: boolean) => {
    const storageData: Record<string, unknown> = {
      results: newResults,
      currentQuestionIndex: newIndex,
      isExamComplete: complete,
      savedAt: new Date().toISOString(),
      timeLeft,
      timerStarted,
      examStartTime
    };
    if (complete && examEndTime) {
      storageData.examEndTime = examEndTime;
    }
    localStorage.setItem("exam_progress", JSON.stringify(storageData));
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
      setTimeLeft(1800);
      setTimerStarted(false);
      setExamStartTime(null);
      setExamEndTime(null);
    }
  };

  const handleNext = () => {
    const newResult: Result = {
      questionId: currentQuestion.id,
      selectedAnswerIndex: selectedAnswer !== null ? selectedAnswer : -1,
      isCorrect: selectedAnswer === currentQuestion.correctAnswerIndex
    };
    
    const newResults = [...results];
    newResults[currentQuestionIndex] = newResult;
    setResults(newResults);
    
    if (isLastQuestion) {
      const endTime = Date.now();
      setExamEndTime(endTime);
      setTimerStarted(false);
      setIsExamComplete(true);
      saveToLocalStorage(newResults, currentQuestionIndex, true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      const nextResult = newResults[currentQuestionIndex + 1];
      setSelectedAnswer(nextResult && nextResult.selectedAnswerIndex >= 0 ? nextResult.selectedAnswerIndex : null);
      saveToLocalStorage(newResults, currentQuestionIndex + 1, false);
    }
  };

  const handleTimeUp = () => {
    // Save current answer
    const newResult: Result = {
      questionId: currentQuestion.id,
      selectedAnswerIndex: selectedAnswer !== null ? selectedAnswer : -1,
      isCorrect: selectedAnswer === currentQuestion.correctAnswerIndex
    };
    const newResults = [...results];
    newResults[currentQuestionIndex] = newResult;
    setResults(newResults);
    
    // End exam
    const endTime = Date.now();
    setExamEndTime(endTime);
    setTimerStarted(false);
    setIsExamComplete(true);
    setShowTimeUpModal(false);
    saveToLocalStorage(newResults, currentQuestionIndex, true);
  };

  const handleFinalSubmit = () => {
    const newResult: Result = {
      questionId: currentQuestion.id,
      selectedAnswerIndex: selectedAnswer !== null ? selectedAnswer : -1,
      isCorrect: selectedAnswer === currentQuestion.correctAnswerIndex
    };
    const newResults = [...results];
    newResults[currentQuestionIndex] = newResult;
    setResults(newResults);
    
    const endTime = Date.now();
    setExamEndTime(endTime);
    setTimerStarted(false);
    setIsExamComplete(true);
    saveToLocalStorage(newResults, currentQuestionIndex, true);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      // Save current answer before going back
      const newResult: Result = {
        questionId: currentQuestion.id,
        selectedAnswerIndex: selectedAnswer !== null ? selectedAnswer : -1,
        isCorrect: selectedAnswer === currentQuestion.correctAnswerIndex
      };
      const newResults = [...results];
      newResults[currentQuestionIndex] = newResult;
      setResults(newResults);
      
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      // Restore selected answer for the previous question
      const prevResult = newResults[prevIndex];
      setSelectedAnswer(prevResult && prevResult.selectedAnswerIndex >= 0 ? prevResult.selectedAnswerIndex : null);
      saveToLocalStorage(newResults, prevIndex, false);
    }
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
        <main className="flex-1 w-full  mx-auto px-6 py-4 flex flex-col items-center justify-center">
          <div className="bg-tertiary-fixed w-32 h-32 rounded-full flex items-center justify-center text-on-tertiary-fixed shadow-sm mb-6">
            <span className="material-symbols-outlined text-6xl">assignment</span>
          </div>
          <h2 className="text-2xl font-bold text-tertiary mb-4">লোডার ও আনলোডার ট্রেড টেস্ট</h2>
          <p className="text-lg text-on-surface-variant mb-8">মোট 15 টি প্রশ্ন</p>

          <div className="flex w-full justify-between mt-10 ">
            <button className="flex w-40 bg-red-600 justify-center items-center rounded-full text-white font-black">
             বাতিল করুন
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
          <button onClick={startExam} className="w-60 px-6 py-2  h-14 bg-tertiary hover:bg-tertiary-container text-on-tertiary font-button text-button rounded-full flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]">
            নিশ্চিত করুন
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
          </div>
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
          <div className="flex justify-between items-center w-full px-4 py-3 max-w-[1024px] mx-auto max-sm:px-2 max-sm:py-2">
            <button onClick={handleStartOver} aria-label="Start Over" className="text-tertiary-container hover:bg-slate-50 transition-colors active:scale-95 duration-150 p-1.5 rounded-full focus:outline-none focus:ring-4 focus:ring-tertiary-fixed max-sm:p-1">
              <span className="material-symbols-outlined text-3xl max-sm:text-xl">refresh</span>
            </button>
            <div className={`font-bold text-xl tracking-tight max-sm:text-base ${timeLeft < 60 ? 'text-error' : 'text-tertiary-container'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="flex items-center gap-2 max-sm:gap-1">
              {isLastQuestion ? (
                <button 
                  onClick={handleFinalSubmit}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#002915'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00ba28'}
                  className="h-9 px-4 font-button text-sm rounded-lg flex items-center justify-center gap-1 shadow-md active:scale-[0.98] transition-all mt-10 max-sm:mt-0 max-sm:h-8 max-sm:px-2 max-sm:text-xs"
                  style={{ backgroundColor: '#00ba28', color: '#ffffff' }}
                >
                  <span className="material-symbols-outlined text-lg max-sm:text-base">send</span>
                  <span className="max-sm:hidden">সমাপ্তি করুন</span>
                </button>
              ) : (
                <h1 className="text-tertiary-container font-bold text-xl tracking-tight max-sm:text-sm">Question {currentQuestionIndex + 1} of {totalQuestions}</h1>
              )}
              {isLastQuestion && (
                <h1 className="text-tertiary-container font-bold text-xl tracking-tight max-sm:text-sm">Question {currentQuestionIndex + 1} of {totalQuestions}</h1>
              )}
            </div>
          </div>
        </header>
      <main className="flex-1 w-full max-w-container-max mx-auto px-6 py-4 flex flex-col overflow-hidden max-sm:px-3 max-sm:py-3">
        {isExamComplete ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="bg-tertiary-fixed w-32 h-32 rounded-full flex items-center justify-center text-on-tertiary-fixed shadow-sm mb-6">
              <span className="material-symbols-outlined text-6xl">check_circle</span>
            </div>
            <h2 className="text-2xl font-bold text-tertiary mb-4">পরীক্ষা সম্পন্ন!</h2>
            <p className="text-lg text-on-surface-variant mb-8">আপনি সফলভাবে পরীক্ষা শেষ করেছেন</p>
            
          </div>
        ) : (
          <>
            <section className="mb-4 text-center md:text-left flex-shrink-0 max-sm:mb-3">
              <h2 className="text-3xl font-bold max-w-6xl max-sm:text-lg">
                {currentQuestion.question}
              </h2>
            </section>
            <section aria-label="Multiple choice options" className="flex-1 flex flex-col gap-2 sm:gap-3" role="radiogroup">
              {currentQuestion.options.map((option, index) => (
                <label 
                  key={index} 
                  className={`group relative flex items-center p-2 sm:p-3 bg-surface-container-lowest border-2 border-outline-variant rounded-lg cursor-pointer transition-all duration-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] ${selectedAnswer === index ? '' : 'hover:bg-[#f5f5f5]'}`}
                  style={selectedAnswer === index ? { backgroundColor: '#fbbf24', borderColor: '#d97706', borderWidth: '4px' } : {}}
                >
                  <input 
                    className="peer sr-only" 
                    name="answer" 
                    type="radio" 
                    value={index}
                    checked={selectedAnswer === index}
                    onChange={() => handleOptionChange(index)}
                  />
                  <div className="flex items-center gap-2 sm:gap-3 w-full">
                    <div 
                      className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-surface-container flex items-center justify-center font-headline-sm sm:font-headline-md text-on-surface-variant transition-colors`}
                      style={selectedAnswer === index ? { backgroundColor: '#fde68a', color: '#78350f' } : {}}
                    >
                      {optionLabels[index]}
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <span className={`font-body-md sm:font-body-lg text-sm sm:text-body-lg text-on-background ${selectedAnswer === index ? 'font-semibold' : ''}`}>{option}</span>
                    </div>
                  </div>
                </label>
              ))}
</section>

            {!isLastQuestion && (
            <section className="mt-4 pt-2 flex-shrink-0 flex justify-end gap-2">
              <button 
                onClick={handlePrevious} 
                disabled={currentQuestionIndex === 0}
                className={`h-10 px-4 font-button text-sm rounded-lg flex items-center justify-center gap-1 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-tertiary-fixed ${currentQuestionIndex === 0 ? 'bg-surface-container-low text-on-surface-variant cursor-not-allowed' : 'bg-surface-container hover:bg-surface-container-high active:scale-[0.98]'}`}
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                পিছিয়ে যান
              </button>
              <button onClick={handleNext} className="h-10 px-6 bg-tertiary text-on-tertiary font-button text-sm rounded-lg flex items-center justify-center gap-1 shadow-md transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-tertiary-fixed">
                এগিয়ে যান
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </section>
            )}

            {isLastQuestion && (
            <section className="mt-4 pt-2 flex-shrink-0 flex justify-end">
              <button 
                onClick={handlePrevious} 
                disabled={currentQuestionIndex === 0}
                className={`h-10 px-4 font-button text-sm rounded-lg flex items-center justify-center gap-1 shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-tertiary-fixed ${currentQuestionIndex === 0 ? 'bg-surface-container-low text-on-surface-variant cursor-not-allowed' : 'bg-surface-container hover:bg-surface-container-high active:scale-[0.98]'}`}
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                পিছিয়ে যান
              </button>
            </section>
            )}


          </>
        )}
      </main>

      {showTimeUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
          <div className="relative w-full max-w-[400px] bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.15)] border border-outline-variant flex flex-col items-center text-center overflow-hidden p-8">
            <div className="absolute top-0 left-0 w-full h-2 bg-error"></div>
            <div className="bg-error-container w-40 h-40 rounded-full flex items-center justify-center text-on-error-container shadow-sm mt-4">
              <span className="material-symbols-outlined text-[80px]">timer_off</span>
            </div>
            <h1 className="font-bold text-2xl text-error max-w-[320px] mt-6">
              সময় শেষ!
            </h1>
            <p className="text-on-surface-variant mt-2 mb-6">আপনার পরীক্ষার সময় শেষ হয়ে গেছে।</p>
            <button onClick={handleTimeUp} className="w-full max-w-[320px] min-h-[72px] bg-tertiary text-on-tertiary font-button text-button rounded-lg flex items-center justify-center gap-2 shadow-[0_4px_12px_-4px_rgba(0,31,11,0.4)] hover:bg-[#001407] active:border-4 active:border-tertiary active:shadow-none transition-all duration-150">
              ফলাফল দেখুন
              <span className="material-symbols-outlined text-[28px]">visibility</span>
            </button>
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
