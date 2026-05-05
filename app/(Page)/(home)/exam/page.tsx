"use client";

import { useState } from "react";
import { questions, totalQuestions } from "./data";

const optionLabels = ["A", "B", "C", "D"];

export default function Exam() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleNext = () => {
    if (selectedAnswer !== null) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedAnswer
      }));
    }
    setShowConfirmModal(true);
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedAnswer
      }));
    }
    setShowConfirmModal(false);
    
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const handleGoBack = () => {
    setShowConfirmModal(false);
  };

  const handleOptionChange = (index: number) => {
    setSelectedAnswer(index);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-[16px] bg-surface-container-highest flex-shrink-0">
        <div className="h-full bg-on-tertiary-container transition-all duration-500 ease-in-out" style={{ width: `${progress}%` }}></div>
      </div>
      <header className="flex-shrink-0 border-b border-slate-100 shadow-sm bg-white">
        <div className="flex justify-between items-center w-full px-4 py-3 max-w-[1024px] mx-auto">
          <button aria-label="Home" className="text-tertiary-container hover:bg-slate-50 transition-colors active:scale-95 duration-150 p-1.5 rounded-full focus:outline-none focus:ring-4 focus:ring-tertiary-fixed">
            <span className="material-symbols-outlined text-3xl">home</span>
          </button>
          <h1 className="text-tertiary-container font-bold text-xl tracking-tight">Question {currentQuestionIndex + 1} of {totalQuestions}</h1>
        </div>
      </header>
      <main className="flex-1 w-full max-w-container-max mx-auto px-6 py-4 flex flex-col overflow-hidden">
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
            Next
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </section>
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
              Are you sure you want to finish the test?
            </h1>
            <div className="w-full max-w-[320px] flex flex-col gap-3 mt-8">
              <button onClick={handleSubmit} className="w-full min-h-[72px] bg-tertiary text-on-tertiary font-button text-button rounded-lg flex items-center justify-center gap-2 shadow-[0_4px_12px_-4px_rgba(0,31,11,0.4)] hover:bg-[#001407] active:border-4 active:border-tertiary active:shadow-none transition-all duration-150">
                <span className="material-symbols-outlined text-[28px]">send</span>
                Yes, Submit
              </button>
              <button onClick={handleGoBack} className="w-full min-h-[72px] bg-transparent border-[3px] border-tertiary text-tertiary font-button text-button rounded-lg flex items-center justify-center gap-2 hover:bg-surface-variant active:bg-surface-container-high transition-colors duration-150">
                <span className="material-symbols-outlined text-[28px]">arrow_back</span>
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
