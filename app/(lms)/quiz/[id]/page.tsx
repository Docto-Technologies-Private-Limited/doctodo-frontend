'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { X, ClipboardList, CheckCircle, AlertCircle } from 'lucide-react';
import { QUIZ_DETAIL } from '@/data/quizData';
import { Question, QuizResult } from '@/types/quiz';

function CustomCheckbox({ checked }: { checked: boolean }) {
  return (
    <span className={`w-4 h-4 shrink-0 rounded flex items-center justify-center border-2 transition-all ${
      checked ? 'bg-secondary border-secondary' : 'bg-white border-gray-300'}`}>
      {checked && (
        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none"
          stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="2 6 5 9 10 3" />
        </svg>
      )}
    </span>
  );
}

interface ModalState { open: boolean; title: string; src: string; }

function ImageModal({ modal, onClose }: { modal: ModalState; onClose: () => void }) {
  if (!modal.open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 text-base">{modal.title}</h3>
          <button onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="relative w-full h-72">
          <Image src={modal.src} alt={modal.title} fill className="object-contain" />
        </div>
      </div>
    </div>
  );
}

interface QuestionCardProps {
  question: Question; index: number; answers: Record<string, string[]>;
  showError: boolean; onAnswer: (qId: string, value: string) => void;
  onImageClick: (title: string, src: string) => void;
}

function QuestionCard({ question, index, answers, showError, onAnswer, onImageClick }: QuestionCardProps) {
  const selected = answers[question.id] ?? [];
  const hasAnswer = selected.length > 0;
  const showBadge = showError && !hasAnswer;

  return (
    <div id={`q-block-${question.id}`} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all">
      <div className={`px-5 py-4 ${showBadge ? 'bg-red-50/30' : ''}`}>
        {showBadge && (
          <span className="sm:hidden mb-2.5 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white text-primary border border-primary/30">
            <AlertCircle className="w-3.5 h-3.5" /> Not Answered
          </span>
        )}
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-gray-800 leading-relaxed">
            <span className="font-bold text-gray-900">Q{index + 1}:</span> {question.text}
          </p>
          {showBadge && (
            <span className="hidden sm:inline-flex shrink-0 items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-primary border border-primary/30 whitespace-nowrap">
              <AlertCircle className="w-3 h-3" /> Not Answered
            </span>
          )}
        </div>
      </div>
      <div className="h-px bg-gray-100" />
      <div className="px-5 py-4 flex flex-col gap-2.5">
        {question.options.map((opt) => {
          const checked = selected.includes(opt.value);
          return (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer select-none rounded-lg px-3 py-2.5 transition-all">
              <input type="checkbox" name={question.id} value={opt.value}
                checked={checked} onChange={() => onAnswer(question.id, opt.value)} className="sr-only" />
              <CustomCheckbox checked={checked} />
              {opt.imageUrl && (
                <button type="button" onClick={(e) => { e.preventDefault(); onImageClick(opt.label, opt.imageUrl!.replace('80x52', '480x340')); }}
                  className="focus:outline-none shrink-0">
                  <Image src={opt.imageUrl} alt={opt.label} width={80} height={52}
                    className="rounded-md object-cover hover:ring-2 hover:ring-secondary transition-all" />
                </button>
              )}
              <span className={`text-sm ${checked ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>{opt.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function QuizOverviewPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [modal, setModal] = useState<ModalState>({ open: false, title: '', src: '' });

  const handleAnswer = useCallback((qId: string, value: string) => {
    setAnswers((prev) => {
      const current = prev[qId] ?? [];
      return { ...prev, [qId]: current.includes(value) ? [] : [value] };
    });
  }, []);

  const handleSubmit = () => {
    const unanswered = QUIZ_DETAIL.questions.filter((q) => !answers[q.id] || answers[q.id].length === 0);
    if (unanswered.length > 0) {
      setShowErrors(true);
      document.getElementById(`q-block-${unanswered[0].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const results: QuizResult[] = QUIZ_DETAIL.questions.map((q) => {
      const selected = answers[q.id] ?? [];
      const correct = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
      const isCorrect = selected.length === correct.length && correct.every((c) => selected.includes(c));
      return {
        questionId: q.id, questionText: q.text, type: q.type, options: q.options,
        selectedAnswer: selected, correctAnswer: q.correctAnswer, explanation: q.explanation, isCorrect,
      };
    });
    sessionStorage.setItem('quizResults', JSON.stringify(results));
    router.push(`/quiz/${QUIZ_DETAIL.id}/results`);
  };

  return (
    <>
      <div className="max-w-3xl mx-auto flex flex-col gap-4">

        {/* Back button */}
        <button onClick={() => router.back()}
          className="flex items-center gap-3 text-xl font-semibold text-gray-800 hover:text-black transition-colors">
          <span className="text-2xl font-bold leading-none -mt-[2px]">←</span>
          Back
        </button>

        {/* Quiz Header Card */}
        <div className="bg-[#EBF4FF] rounded-xl border border-blue-100 px-5 py-4">
          <div className="hidden sm:flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-gray-900 text-base leading-snug">{QUIZ_DETAIL.title}</h2>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{QUIZ_DETAIL.subtitle}</p>
            </div>
            <div className="flex items-center gap-1.5 text-primary text-xs font-semibold shrink-0 bg-white border border-red-100 rounded-lg px-3 py-1.5 whitespace-nowrap">
              <ClipboardList className="w-3.5 h-3.5" />
              {QUIZ_DETAIL.questions.length} Questions
            </div>
          </div>
          <div className="sm:hidden flex flex-col gap-2">
            <h2 className="font-bold text-gray-900 text-base leading-snug">{QUIZ_DETAIL.title}</h2>
            <p className="text-xs text-gray-500 leading-relaxed">{QUIZ_DETAIL.subtitle}</p>
            <div className="flex items-center gap-1.5 text-primary text-xs font-semibold w-fit bg-white border border-red-100 rounded-lg px-3 py-1.5">
              <ClipboardList className="w-3.5 h-3.5" />
              {QUIZ_DETAIL.questions.length} Questions
            </div>
          </div>
        </div>

        {/* Question cards */}
        {QUIZ_DETAIL.questions.map((q, i) => (
          <QuestionCard key={q.id} question={q} index={i} answers={answers}
            showError={showErrors} onAnswer={handleAnswer}
            onImageClick={(title, src) => setModal({ open: true, title, src })} />
        ))}

        {/* Submit */}
        <div className="flex justify-center py-2 pb-6">
          <button type="button" onClick={handleSubmit}
            className="bg-primary hover:brightness-90 text-white font-semibold px-10 py-3 rounded-xl flex items-center gap-2 text-sm transition-all shadow-sm w-full sm:w-auto justify-center">
            <CheckCircle className="w-4 h-4" />
            Submit Answers
          </button>
        </div>
      </div>

      <ImageModal modal={modal} onClose={() => setModal((m) => ({ ...m, open: false }))} />
    </>
  );
}