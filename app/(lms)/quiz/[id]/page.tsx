'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  X,
  NotebookPen,
  CheckCircle,
  AlertTriangle,
  ZoomIn,
  Check,
} from 'lucide-react';
import { QUIZ_DETAIL } from '@/data/quizData';
import { Question, QuizResult } from '@/types/quiz';

function CustomCheckbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`w-4 h-4 shrink-0 rounded flex items-center justify-center border-2 transition-all ${
        checked ? 'bg-secondary border-secondary' : 'bg-white border-gray-300'
      }`}
    >
      {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
    </span>
  );
}

interface ModalState {
  open: boolean;
  title: string;
  src: string;
}

function ImageModal({ modal, onClose }: { modal: ModalState; onClose: () => void }) {
  if (!modal.open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3">
          <h3 className="text-xs md:text-sm font-semibold text-textSecondary leading-snug">
            {modal.title}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-secondary hover:brightness-90 flex items-center justify-center text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mx-3 mb-3 rounded-xl overflow-hidden relative aspect-[4/3] sm:h-80 sm:aspect-auto">
          <Image src={modal.src} alt={modal.title} fill className="object-cover" />
        </div>
      </div>
    </div>
  );
}

// ─── Not Answered Badge ─────────────────────────────────────────────────────── 
function NotAnsweredBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 bg-alertLight text-alert font-semibold rounded-lg px-3 py-1.5 whitespace-nowrap text-[10px] md:text-xs ${className}`}
    >
      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
      Not Answered
    </span>
  );
}

interface QuestionCardProps {
  question: Question;
  index: number;
  answers: Record<string, string[]>;
  showError: boolean;
  onAnswer: (qId: string, value: string) => void;
  onImageClick: (title: string, src: string) => void;
}

function QuestionCard({
  question,
  index,
  answers,
  showError,
  onAnswer,
  onImageClick,
}: QuestionCardProps) {
  const selected = answers[question.id] ?? [];
  const hasAnswer = selected.length > 0;
  const showBadge = showError && !hasAnswer;

  return (
    <div
      id={`q-block-${question.id}`}
      className="bg-white rounded-xl shadow-sm overflow-hidden transition-all"
    >
      {/* Question header — alertLight bg when unanswered */}
      <div className={`px-5 py-4 ${showBadge ? 'bg-alertBg' : ''}`}>
        {/* Mobile: badge stacks above question text */}
        {showBadge && (
          <div className="sm:hidden mb-2.5">
            <NotAnsweredBadge />
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <p className="text-xs md:text-sm font-semibold text-textSecondary leading-snug">
            <span className={`font-semibold ${showBadge ? 'text-alert' : 'text-textPrimary'}`}>Q{index + 1}:</span>{' '}
            {question.text}
          </p>

          {/* Desktop: badge sits inline to the right */}
          {showBadge && (
            <div className="hidden sm:block shrink-0">
              <NotAnsweredBadge />
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-gray-100" />

      {/* Options */}
      <div className="px-5 py-4 flex flex-col gap-2.5">
        {question.options.map((opt) => {
          const checked = selected.includes(opt.value);
          return (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer select-none rounded-lg px-3 py-2.5 transition-all"
            >
              <input
                type="checkbox"
                name={question.id}
                value={opt.value}
                checked={checked}
                onChange={() => onAnswer(question.id, opt.value)}
                className="sr-only"
              />
              <CustomCheckbox checked={checked} />

              {opt.imageUrl && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onImageClick(opt.label, opt.imageUrl!.replace('80x52', '480x340'));
                  }}
                  className="focus:outline-none shrink-0 relative group"
                >
                  <Image
                    src={opt.imageUrl}
                    alt={opt.label}
                    width={80}
                    height={52}
                    className="rounded-md object-cover hover:ring-2 hover:ring-secondary transition-all"
                  />
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4 text-white drop-shadow" />
                  </span>
                </button>
              )}

              <span
                className={`text-xs md:text-sm ${
                  checked ? 'text-textSecondary font-semibold' : 'text-textSecondary'
                }`}
              >
                {opt.label}
              </span>
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
    const unanswered = QUIZ_DETAIL.questions.filter(
      (q) => !answers[q.id] || answers[q.id].length === 0,
    );
    if (unanswered.length > 0) {
      setShowErrors(true);
      document
        .getElementById(`q-block-${unanswered[0].id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const results: QuizResult[] = QUIZ_DETAIL.questions.map((q) => {
      const selected = answers[q.id] ?? [];
      const correct = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
      const isCorrect =
        selected.length === correct.length && correct.every((c) => selected.includes(c));
      return {
        questionId: q.id,
        questionText: q.text,
        type: q.type,
        options: q.options,
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        isCorrect,
      };
    });

    sessionStorage.setItem('quizResults', JSON.stringify(results));
    router.push(`/quiz/${QUIZ_DETAIL.id}/results`);
  };

  return (
    <>
      <div className="max-w-3xl mx-auto flex flex-col gap-4">

        {/* ── Quiz Header Card ── */}
        <div className="bg-welcomeLight rounded-xl border border-blue-100 px-5 py-4">
          {/* Desktop */}
          <div className="hidden sm:flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-xl lg:text-xl font-semibold text-textPrimary leading-snug">
                {QUIZ_DETAIL.title}
              </h2>
              <p className="text-xs md:text-xs lg:text-xs text-textSecondary mt-1 leading-relaxed">
                {QUIZ_DETAIL.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs md:text-sm lg:text-sm font-semibold text-textSecondary shrink-0 px-4 py-4 whitespace-nowrap">
              <NotebookPen className="w-3.5 h-3.5 text-primary" />
              {QUIZ_DETAIL.questions.length} Questions
            </div>
          </div>

          {/* Mobile */}
          <div className="sm:hidden flex flex-col gap-2">
            <h2 className="text-base md:text-xl lg:text-xl font-semibold text-textPrimary leading-snug">
              {QUIZ_DETAIL.title}
            </h2>
            <p className="text-xs text-textSecondary leading-relaxed">{QUIZ_DETAIL.subtitle}</p>
            <div className="flex items-center gap-1.5 text-xs md:text-sm lg:text-sm font-semibold text-textSecondary w-fit">
              <NotebookPen className="w-3.5 h-3.5 text-primary" />
              {QUIZ_DETAIL.questions.length} Questions
            </div>
          </div>
        </div>

        {/* ── Question cards ── */}
        {QUIZ_DETAIL.questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={i}
            answers={answers}
            showError={showErrors}
            onAnswer={handleAnswer}
            onImageClick={(title, src) => setModal({ open: true, title, src })}
          />
        ))}

        {/* ── Submit ── */}
        <div className="flex justify-center py-2 pb-6">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-primary hover:brightness-90 text-white font-semibold px-10 py-3 rounded-xl flex items-center gap-2 text-xs md:text-sm transition-all shadow-sm w-full sm:w-auto justify-center"
          >
            <CheckCircle className="w-4 h-4" />
            Submit Answers
          </button>
        </div>
      </div>

      <ImageModal modal={modal} onClose={() => setModal((m) => ({ ...m, open: false }))} />
    </>
  );
}