"use client";

import { useState } from "react";

export default function Exam() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);

  const handleNext = () => {
    setShowConfirmModal(true);
  };

  const handleSubmit = () => {
    setShowConfirmModal(false);
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleGoBack = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="w-full h-[16px] bg-surface-container-highest flex-shrink-0">
        <div className="h-full bg-on-tertiary-container w-[15%] transition-all duration-500 ease-in-out"></div>
      </div>
      <header className="flex-shrink-0 border-b border-slate-100 shadow-sm bg-white">
        <div className="flex justify-between items-center w-full px-4 py-3 max-w-[1024px] mx-auto">
          <button aria-label="Home" className="text-tertiary-container hover:bg-slate-50 transition-colors active:scale-95 duration-150 p-1.5 rounded-full focus:outline-none focus:ring-4 focus:ring-tertiary-fixed">
            <span className="material-symbols-outlined text-3xl">home</span>
          </button>
          <h1 className="text-tertiary-container font-bold text-xl tracking-tight">Question {currentQuestion} of 20</h1>
        </div>
      </header>
      <main className="flex-1 w-full max-w-container-max mx-auto px-6 py-4 flex flex-col overflow-hidden">
        <section className="mb-4 text-center md:text-left flex-shrink-0">
          <h2 className="text-3xl font-bold max-w-6xl">
            Which tool is used for moving heavy boxes?
          </h2>
        </section>
        <section aria-label="Multiple choice options" className="flex-1 flex flex-col gap-3" role="radiogroup">
          <label className="group relative flex items-center p-3 bg-surface-container-lowest border-2 border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-all duration-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] has-[:checked]:bg-tertiary-fixed has-[:checked]:border-4 has-[:checked]:border-tertiary has-[:checked]:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
            <input className="peer sr-only" name="answer" type="radio" value="forklift" />
            <div className="flex items-center gap-3 w-full">
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-surface-container flex items-center justify-center font-headline-md text-headline-md text-on-surface-variant group-has-[:checked]:bg-surface-container-lowest group-has-[:checked]:text-tertiary transition-colors">
                A
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span className="material-symbols-outlined text-2xl text-on-surface-variant group-has-[:checked]:text-tertiary">forklift</span>
                <span className="font-body-lg text-body-lg text-on-background group-has-[:checked]:font-semibold">Forklift</span>
              </div>
            </div>
          </label>

          <label className="group relative flex items-center p-3 bg-surface-container-lowest border-2 border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-all duration-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] has-[:checked]:bg-tertiary-fixed has-[:checked]:border-4 has-[:checked]:border-tertiary has-[:checked]:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
            <input className="peer sr-only" name="answer" type="radio" value="pallet_jack" />
            <div className="flex items-center gap-3 w-full">
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-surface-container flex items-center justify-center font-headline-md text-headline-md text-on-surface-variant group-has-[:checked]:bg-surface-container-lowest group-has-[:checked]:text-tertiary transition-colors">
                B
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span className="material-symbols-outlined text-2xl text-on-surface-variant group-has-[:checked]:text-tertiary">hand_bones</span>
                <span className="font-body-lg text-body-lg text-on-background group-has-[:checked]:font-semibold">Pallet Jack</span>
              </div>
            </div>
          </label>

          <label className="group relative flex items-center p-3 bg-surface-container-lowest border-2 border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-all duration-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] has-[:checked]:bg-tertiary-fixed has-[:checked]:border-4 has-[:checked]:border-tertiary has-[:checked]:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
            <input className="peer sr-only" name="answer" type="radio" value="hand_truck" />
            <div className="flex items-center gap-3 w-full">
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-surface-container flex items-center justify-center font-headline-md text-headline-md text-on-surface-variant group-has-[:checked]:bg-surface-container-lowest group-has-[:checked]:text-tertiary transition-colors">
                C
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span className="material-symbols-outlined text-2xl text-on-surface-variant group-has-[:checked]:text-tertiary">trolley</span>
                <span className="font-body-lg text-body-lg text-on-background group-has-[:checked]:font-semibold">Hand Truck</span>
              </div>
            </div>
          </label>

          <label className="group relative flex items-center p-3 bg-surface-container-lowest border-2 border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-all duration-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] has-[:checked]:bg-tertiary-fixed has-[:checked]:border-4 has-[:checked]:border-tertiary has-[:checked]:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
            <input className="peer sr-only" name="answer" type="radio" value="broom" />
            <div className="flex items-center gap-3 w-full">
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-surface-container flex items-center justify-center font-headline-md text-headline-md text-on-surface-variant group-has-[:checked]:bg-surface-container-lowest group-has-[:checked]:text-tertiary transition-colors">
                D
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span className="material-symbols-outlined text-2xl text-on-surface-variant group-has-[:checked]:text-tertiary">cleaning_services</span>
                <span className="font-body-lg text-body-lg text-on-background group-has-[:checked]:font-semibold">Broom</span>
              </div>
            </div>
          </label>
        </section>
        <section className="mt-4 pt-2 flex-shrink-0">
          <button onClick={handleNext} className="w-full h-14 bg-tertiary hover:bg-tertiary-container text-on-tertiary font-button text-button rounded-full flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-tertiary-fixed">
            Next
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </section>
      </main>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.15)] border border-outline-variant flex flex-col items-center text-center relative overflow-hidden py-6 px-4">
            <div className="absolute top-0 left-0 w-full h-2 bg-tertiary"></div>
            <div className="bg-tertiary-fixed w-28 h-28 rounded-full flex items-center justify-center text-on-tertiary-fixed shadow-sm mt-2">
              <span className="material-symbols-outlined text-6xl">help_outline</span>
            </div>
            <h1 className="font-bold text-xl text-tertiary max-w-[320px] mt-4">
              Are you sure you want to finish the test?
            </h1>
            <div className="w-full max-w-[320px] flex flex-col gap-2 mt-6">
              <button onClick={handleSubmit} className="w-full h-14 bg-tertiary text-on-tertiary font-bold text-lg rounded-lg flex items-center justify-center gap-2 shadow-[0_4px_12px_-4px_rgba(0,31,11,0.4)] hover:bg-[#001407] active:border-4 active:border-tertiary active:shadow-none transition-all duration-150">
                <span className="material-symbols-outlined text-2xl">send</span>
                Yes, Submit
              </button>
              <button onClick={handleGoBack} className="w-full h-14 bg-transparent border-[3px] border-tertiary text-tertiary font-bold text-lg rounded-lg flex items-center justify-center gap-2 hover:bg-surface-variant active:bg-surface-container-high transition-colors duration-150">
                <span className="material-symbols-outlined text-2xl">arrow_back</span>
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
