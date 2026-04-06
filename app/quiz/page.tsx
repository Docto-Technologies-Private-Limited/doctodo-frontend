'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Sidebar from '@/app/component/Sidebar';
import Topbar from '@/app/component/Topbar';
import { QUIZZES } from '@/data/quizData';
import { Quiz } from '@/types/quiz';

// ── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE_OPTIONS = [5, 10, 20];

// ── Status Badge ─────────────────────────────────────────────────────────────
function StatusButton({ quiz }: { quiz: Quiz }) {
  if (quiz.status === 'completed') {
    return (
      <Link
        href={`/quiz/${quiz.id}/results`}
        className="inline-flex items-center gap-1.5 bg-success text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap"
      >
        View Results
      </Link>
    );
  }
  return (
    <Link
      href={`/quiz/${quiz.id}`}
      className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap"
    >
      Start Quiz →
    </Link>
  );
}

// ── Mobile Quiz Card ──────────────────────────────────────────────────────────
function MobileQuizCard({ quiz, index }: { quiz: Quiz; index: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <span className="text-xs font-bold text-gray-400 mt-0.5 shrink-0">{index + 1}.</span>
        <p className="text-sm font-semibold text-gray-800 leading-snug flex-1">{quiz.title}</p>
      </div>
      <div className="pl-5">
        {quiz.status === 'completed' ? (
          <Link
            href={`/quiz/${quiz.id}/results`}
            className="flex items-center justify-center gap-1.5 bg-success text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors w-full"
          >
            View Results
          </Link>
        ) : (
          <Link
            href={`/quiz/${quiz.id}`}
            className="flex items-center justify-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors w-full"
          >
            Start Quiz →
          </Link>
        )}
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  // Build page number array with ellipsis
  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    )
      pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 pt-4 border-t border-gray-100">
      {/* Info + page size */}
      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>
          Showing <span className="font-semibold text-gray-700">{start}–{end}</span> of{' '}
          <span className="font-semibold text-gray-700">{totalItems}</span>
        </span>
        <div className="flex items-center gap-1.5">
          <span>Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary bg-white"
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
        >
          ‹
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-xs">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors border ${
                currentPage === p
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
        >
          ›
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function QuizListPage() {
  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not_attempted' | 'completed'>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Filtered list
  const filtered = useMemo(() => {
    return QUIZZES.filter((q) => {
      const matchName = q.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || q.status === statusFilter;
      return matchName && matchStatus;
    });
  }, [search, statusFilter]);

  // Reset to page 1 when filters change
  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };
  const handleStatus = (val: typeof statusFilter) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };
  const handlePageSize = (val: number) => {
    setPageSize(val);
    setCurrentPage(1);
  };

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex min-h-screen bg-[#f4f5f7]">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto mt-[80px] mb-[60px] sm:mb-0 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-5">

            {/* ── Banner ── */}
            <div className="relative w-full rounded-2xl overflow-hidden" style={{ minHeight: 160 }}>
              <Image
                src="/images/banner/quiz_banner.webp"
                alt="Quiz Banner"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* ── Quiz List Card ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Card header */}
              <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-base">Your Quiz List</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Here you can find all your quizzes along with their current status and start them anytime.
                </p>

                {/* ── Filters ── */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  {/* Search by name */}
                  <div className="relative flex-1">
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <circle cx="11" cy="11" r="8" strokeWidth="2" />
                      <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by quiz name..."
                      value={search}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-gray-50 placeholder:text-gray-400 transition-all"
                    />
                  </div>

                  {/* Status filter */}
                  <div className="flex items-center gap-2 shrink-0">
                    {(
                      [
                        { value: 'all', label: 'All' },
                        { value: 'not_attempted', label: 'Not Started' },
                        { value: 'completed', label: 'Completed' },
                      ] as const
                    ).map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => handleStatus(value)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                          statusFilter === value
                            ? 'bg-secondary text-white border-secondary'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-secondary hover:text-secondary'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Desktop Table (sm+) ── */}
              <div className="hidden sm:block">
                {paginated.length === 0 ? (
                  <div className="py-14 flex flex-col items-center gap-2 text-gray-400">
                    <svg className="w-10 h-10 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-sm">No quizzes match your filters.</p>
                  </div>
                ) : (
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 w-16">S.No</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Quiz Title</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 w-40">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((quiz, index) => (
                        <tr
                          key={quiz.id}
                          className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors"
                        >
                          <td className="px-6 py-4 text-gray-400 text-xs">
                            {(currentPage - 1) * pageSize + index + 1}
                          </td>
                          <td className="px-4 py-4 text-gray-800 font-medium">{quiz.title}</td>
                          <td className="px-4 py-4">
                            <StatusButton quiz={quiz} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* ── Mobile Cards (< sm) ── */}
              <div className="sm:hidden px-4 py-4 flex flex-col gap-3">
                {paginated.length === 0 ? (
                  <div className="py-10 flex flex-col items-center gap-2 text-gray-400">
                    <p className="text-sm">No quizzes match your filters.</p>
                  </div>
                ) : (
                  paginated.map((quiz, index) => (
                    <MobileQuizCard
                      key={quiz.id}
                      quiz={quiz}
                      index={(currentPage - 1) * pageSize + index}
                    />
                  ))
                )}
              </div>

              {/* ── Pagination ── */}
              {filtered.length > 0 && (
                <div className="px-5 sm:px-6 pb-5">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={filtered.length}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={handlePageSize}
                  />
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}