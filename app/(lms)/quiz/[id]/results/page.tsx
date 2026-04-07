'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, XCircle, ChevronLeft } from 'lucide-react';
import { QUIZ_DETAIL } from '@/data/quizData';
import { QuizResult } from '@/types/quiz';

const STATIC_RESULTS: QuizResult[] = QUIZ_DETAIL.questions.map((q, i) => {
  const isCorrect = i % 2 !== 0;
  const selected = isCorrect
    ? [Array.isArray(q.correctAnswer) ? q.correctAnswer[0] : q.correctAnswer]
    : [q.options[0].value];
  return {
    questionId: q.id, questionText: q.text, type: q.type, options: q.options,
    selectedAnswer: selected, correctAnswer: q.correctAnswer, explanation: q.explanation, isCorrect,
  };
});

function ResultCard({ result, index }: { result: QuizResult; index: number }) {
  const correct = Array.isArray(result.correctAnswer) ? result.correctAnswer : [result.correctAnswer];
  const selected = Array.isArray(result.selectedAnswer) ? result.selectedAnswer : [result.selectedAnswer];
  const correctLabel = result.options.filter((o) => correct.includes(o.value)).map((o) => o.label).join(', ');
  const correctIndex = result.options.findIndex((o) => correct.includes(o.value));
  const correctLetter = correctIndex >= 0 ? String.fromCharCode(65 + correctIndex) : correct[0].toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 flex items-start justify-between gap-3 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-800 leading-snug">
          <span className="font-bold">Q{index + 1}:</span> {result.questionText}
        </p>
        <span className={`shrink-0 flex items-center gap-1 rounded-lg border text-xs font-semibold px-2 py-1 sm:px-3 sm:py-1.5 ${
          result.isCorrect ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
          {result.isCorrect ? (
            <><CheckCircle2 className="w-3.5 h-3.5 shrink-0" /><span className="hidden sm:inline">Correct Answer</span></>
          ) : (
            <><XCircle className="w-3.5 h-3.5 shrink-0" /><span className="hidden sm:inline">Wrong Answer</span></>
          )}
        </span>
      </div>
      <div className="px-5 py-4 flex flex-col gap-3">
        {result.options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          const isCorrectOpt = correct.includes(opt.value);
          return (
            <label key={opt.value}
              className={`flex items-center gap-3 text-sm select-none ${
                isCorrectOpt ? 'text-green-700 font-semibold'
                  : isSelected && !result.isCorrect ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
              <input type={result.type === 'multi' ? 'checkbox' : 'radio'}
                name={`result-${result.questionId}`} checked={isSelected} readOnly disabled
                className="w-4 h-4 shrink-0 accent-[#1a73e8]" />
              {opt.imageUrl && (
                <Image src={opt.imageUrl} alt={opt.label} width={80} height={52} className="rounded-lg object-cover shrink-0" />
              )}
              <span>{opt.label}{isCorrectOpt && ' ✓'}</span>
            </label>
          );
        })}
      </div>
      <div className="px-5 py-3 bg-green-50 border-t border-green-100 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
        <span className="text-green-700 font-semibold">Correct Answer: {correctLetter}</span>
        <span className="text-green-600">Explanation: <strong className="font-bold">{correctLabel}</strong></span>
      </div>
    </div>
  );
}

function CompletedBanner({ score, total }: { score: number; total: number }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #fff8ee 0%, #ffe4b8 100%)' }}>
      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 px-6 py-6 sm:px-8 sm:py-7">
        <div className="order-first sm:order-last shrink-0">
          <div className="relative">
            <span className="text-7xl sm:text-8xl leading-none select-none">🎁</span>
            <span className="absolute -top-3 -right-4 text-3xl leading-none select-none rotate-12">❓</span>
            <span className="absolute -top-1 right-6 text-xl leading-none select-none -rotate-6">❓</span>
          </div>
        </div>
        <div className="order-last sm:order-first text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#e03131] leading-tight">Quiz Completed!</h2>
          <p className="text-gray-700 text-sm mt-2 leading-relaxed">
            You scored <strong className="font-bold text-gray-900">{score} out of {total}</strong>. Review your answers and see feedback below.
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

  const score = results.filter((r) => r.isCorrect).length;
  const total = results.length;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4 sm:gap-5">
      <CompletedBanner score={score} total={total} />
      {results.map((result, index) => (
        <ResultCard key={result.questionId} result={result} index={index} />
      ))}
      <div className="flex justify-center pb-4">
        <Link href="/quiz"
          className="bg-[#1a73e8] hover:bg-blue-700 text-white text-sm font-semibold px-8 py-2.5 rounded-lg inline-flex items-center gap-2 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Quiz List
        </Link>
      </div>
    </div>
  );
}