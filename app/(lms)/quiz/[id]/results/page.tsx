'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  ChevronLeft,
  Trophy,
  BookOpen,
} from 'lucide-react';
import { QUIZ_DETAIL } from '@/data/quizData';
import { QuizResult } from '@/types/quiz';

const STATIC_RESULTS: QuizResult[] = QUIZ_DETAIL.questions.map((q) => {
  const correct = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
  const selected = [q.options[0].value];
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

function ResultCard({ result, index }: { result: QuizResult; index: number }) {
  const correct = Array.isArray(result.correctAnswer)
    ? result.correctAnswer
    : [result.correctAnswer];
  const selected = Array.isArray(result.selectedAnswer)
    ? result.selectedAnswer
    : [result.selectedAnswer];

  // Always recompute from actual data — never trust stored isCorrect
  const isCorrect =
    selected.length === correct.length && correct.every((c) => selected.includes(c));

  const correctLabel = result.options
    .filter((o) => correct.includes(o.value))
    .map((o) => o.label)
    .join(', ');

  const correctIndex = result.options.findIndex((o) => correct.includes(o.value));
  const correctLetter =
    correctIndex >= 0 ? String.fromCharCode(65 + correctIndex) : correct[0].toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

      {/* ── Question header row ── */}
      <div className="px-5 py-4 flex items-start justify-between gap-3 border-b border-gray-100">
        <p className="text-xs md:text-sm lg:text-sm font-semibold text-textPrimary leading-snug">
          <span className="font-bold text-textSecondary">Q{index + 1}:</span>{' '}
          {result.questionText}
        </p>

        {/* Correct / Wrong badge */}
        <span
          className={`shrink-0 flex items-center justify-center gap-1
          w-7 h-7 sm:w-auto sm:h-auto
          rounded-md sm:rounded-lg
          border text-[10px] md:text-xs font-semibold
          px-0 sm:px-3 py-0 sm:py-1.5 ${
            isCorrect
              ? 'bg-successLight text-success border-success'
              : 'bg-alertLight text-alert border-alert'
          }`}
        >
          {isCorrect ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Correct Answer</span>
            </>
          ) : (
            <>
              <XCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Wrong Answer</span>
            </>
          )}
        </span>
      </div>

      {/* ── Options list ── */}
      <div className="px-5 py-4 flex flex-col gap-3">
        {result.options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          const isCorrectOpt = correct.includes(opt.value);
          return (
            <label
              key={opt.value}
              className={`flex items-center gap-3 text-xs md:text-sm select-none ${
                isCorrectOpt
                  ? 'text-success font-semibold'
                  : isSelected && !isCorrectOpt
                  ? 'text-textSecondary/50 line-through'
                  : 'text-textSecondary'
              }`}
            >
              <input
                type={result.type === 'multi' ? 'checkbox' : 'radio'}
                name={`result-${result.questionId}`}
                checked={isSelected}
                readOnly
                disabled
                className="w-4 h-4 shrink-0 accent-[#1a73e8]"
              />
              {opt.imageUrl && (
                <Image
                  src={opt.imageUrl}
                  alt={opt.label}
                  width={80}
                  height={52}
                  className="rounded-lg object-cover shrink-0"
                />
              )}
              <span>
                {opt.label}
                {isCorrectOpt && ' ✓'}
              </span>
            </label>
          );
        })}
      </div>

      {/* ── Explanation footer ── */}
      <div className="px-5 py-3 bg-successLight border-t border-successLight flex flex-wrap items-center gap-x-6 gap-y-1 text-xs md:text-sm lg:text-sm">
        <span className="text-success font-semibold">
          Correct Answer: {correctLetter}
        </span>
        <span className="text-success">
          Explanation:{' '}
          <strong className="font-bold">{correctLabel}</strong>
        </span>
      </div>
    </div>
  );
}

function CompletedBanner({ score, total }: { score: number; total: number }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #fff8ee 0%, #ffe4b8 100%)' }}
    >
      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 px-6 py-6 sm:px-8 sm:py-7">

        {/* Illustration */}
        <div className="order-first sm:order-last shrink-0">
          <div className="relative">
            <span className="text-7xl sm:text-8xl leading-none select-none">🎁</span>
            <span className="absolute -top-3 -right-4 text-3xl leading-none select-none rotate-12">
              ❓
            </span>
            <span className="absolute -top-1 right-6 text-xl leading-none select-none -rotate-6">
              ❓
            </span>
          </div>
        </div>

        {/* Copy */}
        <div className="order-last sm:order-first text-center sm:text-left">
          <h2 className="text-base md:text-xl lg:text-xl font-extrabold text-warning leading-tight flex items-center gap-2 justify-center sm:justify-start">
            <Trophy className="w-5 h-5 shrink-0" />
            Quiz Completed!
          </h2>
          <p className="text-xs md:text-sm lg:text-sm text-textSecondary mt-2 leading-relaxed">
            You scored{' '}
            <strong className="font-bold text-textSecondary">
              {score} out of {total}
            </strong>
            . Review your answers and see feedback below.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function QuizResultsPage() {
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('quizResults');
      setResults(stored ? JSON.parse(stored) : STATIC_RESULTS);
    } catch {
      setResults(STATIC_RESULTS);
    }
  }, []);

  // Recompute score from actual data, not stored isCorrect flags
  const score = results.filter((r) => {
    const correct = Array.isArray(r.correctAnswer) ? r.correctAnswer : [r.correctAnswer];
    const selected = Array.isArray(r.selectedAnswer) ? r.selectedAnswer : [r.selectedAnswer];
    return selected.length === correct.length && correct.every((c) => selected.includes(c));
  }).length;
  const total = results.length;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4 sm:gap-5">

      {/* ── Completed banner ── */}
      <CompletedBanner score={score} total={total} />

      {/* ── Section label ── */}
      <h2 className="text-base md:text-xl lg:text-xl font-semibold text-textPrimary flex items-center gap-2">
        <BookOpen className="w-5 h-5 shrink-0 text-primary" />
        Answer Review
      </h2>

      {/* ── Result cards ── */}
      {results.map((result, index) => (
        <ResultCard key={result.questionId} result={result} index={index} />
      ))}

      {/* ── Back CTA ── */}
      <div className="flex justify-center pb-4">
        <Link
          href="/quiz"
          className="bg-[#1a73e8] hover:bg-blue-700 text-white text-xs md:text-sm font-semibold px-8 py-2.5 rounded-lg inline-flex items-center gap-2 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Quiz List
        </Link>
      </div>
    </div>
  );
}