'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import { QUIZZES } from '@/data/quizData';
import { Quiz } from '@/types/quiz';

const PAGE_SIZE_OPTIONS = [5, 10, 20];

// ─── Quiz Banner Illustration (inline SVG — question mark boxes) ──────────────
function QuizBannerIllustration() {
  return (
    <svg
      viewBox="0 0 220 140"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Dotted texture */}
      {[...Array(6)].map((_, row) =>
        [...Array(10)].map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={col * 22 + 5}
            cy={row * 22 + 5}
            r="1.5"
            fill="#F5A623"
            fillOpacity="0.25"
          />
        ))
      )}
      {/* Back box (large, tilted) */}
      <g transform="translate(80, 18) rotate(-12, 60, 60)">
        <rect x="10" y="30" width="90" height="75" rx="8" fill="#E07B20" />
        <path d="M10 30 Q55 10 100 30 L90 50 Q55 35 20 50 Z" fill="#F5A623" />
        <text x="55" y="90" fontSize="38" fontWeight="bold" fill="#FFF3E0" textAnchor="middle" opacity="0.9">?</text>
      </g>
      {/* Front box (smaller, upright) */}
      <g transform="translate(50, 42)">
        <rect x="0" y="28" width="72" height="62" rx="7" fill="#F5A623" />
        <path d="M0 28 Q36 8 72 28 L64 46 Q36 28 8 46 Z" fill="#FFCC70" />
        <text x="36" y="76" fontSize="30" fontWeight="bold" fill="#fff" textAnchor="middle" opacity="0.95">?</text>
      </g>
      {/* Floating question marks */}
      <text x="168" y="28" fontSize="22" fontWeight="bold" fill="#F5A623" opacity="0.7">?</text>
      <text x="148" y="18" fontSize="14" fontWeight="bold" fill="#E07B20" opacity="0.5">?</text>
      <text x="185" y="55" fontSize="12" fontWeight="bold" fill="#F5A623" opacity="0.4">?</text>
    </svg>
  );
}

// ─── Quiz Banner ──────────────────────────────────────────────────────────────
function QuizBanner() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden px-5 sm:px-8 py-6 flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-4"
      style={{
        background: 'linear-gradient(135deg, #FDE8C8 0%, #FDDCAA 50%, #FCD39A 100%)',
        minHeight: 160,
      }}
    >
      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, #E07B20 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Illustration */}
      <div className="relative z-10 flex-shrink-0 w-[120px] h-[100px] sm:order-2 sm:w-[140px] sm:h-[110px]">
        <QuizBannerIllustration />
      </div>

      {/* Text */}
      <div className="relative z-10 flex-1 min-w-0 flex flex-col items-center text-center sm:items-start sm:text-left sm:order-1">
        <h2
          className="text-lg md:text-xl lg:text-2xl font-extrabold leading-tight"
          style={{ color: '#D4650A' }}
        >
          Test • Analyze • Improve
        </h2>
        <p className="text-xs md:text-sm mt-2 leading-relaxed max-w-sm" style={{ color: '#7A4010' }}>
          Structured quizzes built to evaluate your understanding, reinforce
          learning outcomes, and support continuous professional development
          in trichology and related clinical domains.
        </p>
      </div>
    </div>
  );
}

// ─── Status Button ────────────────────────────────────────────────────────────
function StatusButton({ quiz }: { quiz: Quiz }) {
  if (quiz.status === 'completed') {
    return (
      <Link href={`/quiz/${quiz.id}/results`}
        className="inline-flex items-center gap-1.5 bg-success text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap">
        View Results
      </Link>
    );
  }
  return (
    <Link href={`/quiz/${quiz.id}`}
      className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap">
      Start Quiz →
    </Link>
  );
}

// ─── Mobile Quiz Card ─────────────────────────────────────────────────────────
function MobileQuizCard({ quiz, index }: { quiz: Quiz; index: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <span className="text-xs font-bold text-textSecondary mt-0.5 shrink-0">{index + 1}.</span>
        <p className="text-xs md:text-sm font-semibold text-textSecondary leading-snug flex-1">{quiz.title}</p>
      </div>
      <div className="pl-5">
        {quiz.status === 'completed' ? (
          <Link href={`/quiz/${quiz.id}/results`}
            className="flex items-center justify-center gap-1.5 bg-success text-white text-xs md:text-sm font-semibold px-4 py-2.5 rounded-lg w-full">
            View Results
          </Link>
        ) : (
          <Link href={`/quiz/${quiz.id}`}
            className="flex items-center justify-center gap-1.5 bg-primary text-white text-xs md:text-sm font-semibold px-4 py-2.5 rounded-lg w-full">
            Start Quiz →
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
interface PaginationProps {
  currentPage: number; totalPages: number; pageSize: number;
  totalItems: number; onPageChange: (p: number) => void; onPageSizeChange: (s: number) => void;
}

function Pagination({ currentPage, totalPages, pageSize, totalItems, onPageChange, onPageSizeChange }: PaginationProps) {
  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }
  const start = (currentPage - 1) * pageSize + 1;
  const end   = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 pt-4 border-t border-gray-100">
      <div className="flex items-center gap-3 text-xs text-textSecondary">
        <span>Showing <span className="font-semibold text-textSecondary">{start}–{end}</span> of{' '}
          <span className="font-semibold text-textSecondary">{totalItems}</span></span>
        <div className="flex items-center gap-1.5">
          <span>Rows:</span>
          <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-gray-200 rounded-md px-2 py-1 text-xs text-textSecondary focus:outline-none focus:ring-1 focus:ring-primary bg-white">
            {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-textSecondary hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
          <ChevronLeft size={14} />
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-textSecondary text-xs">…</span>
          ) : (
            <button key={p} onClick={() => onPageChange(p as number)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium border ${
                currentPage === p ? 'bg-primary text-white border-primary' : 'border-gray-200 text-textSecondary hover:bg-gray-50'}`}>
              {p}
            </button>
          )
        )}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-textSecondary hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function QuizListPage() {
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not_attempted' | 'completed'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize]       = useState(5);

  const filtered = useMemo(() =>
    QUIZZES.filter((q) => {
      const matchName   = q.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || q.status === statusFilter;
      return matchName && matchStatus;
    }), [search, statusFilter]);

  const handleSearch   = (val: string)              => { setSearch(val);        setCurrentPage(1); };
  const handleStatus   = (val: typeof statusFilter) => { setStatusFilter(val);  setCurrentPage(1); };
  const handlePageSize = (val: number)              => { setPageSize(val);      setCurrentPage(1); };

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-5">

      {/* Banner */}
      <QuizBanner />

      {/* Quiz List Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Card header */}
        <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-base md:text-xl lg:text-xl font-semibold text-textPrimary">Your Quiz List</h2>
          <p className="text-xs md:text-sm lg:text-sm text-textSecondary mt-0.5">
            Here you can find all your quizzes along with their current status and start them anytime.
          </p>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
              <input
                type="text"
                placeholder="Search by quiz name..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs md:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-gray-50 placeholder:text-textSecondary transition-all"
              />
            </div>
            {/* Status filter buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {([{ value: 'all', label: 'All' }, { value: 'not_attempted', label: 'Not Started' }, { value: 'completed', label: 'Completed' }] as const)
                .map(({ value, label }) => (
                  <button key={value} onClick={() => handleStatus(value)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      statusFilter === value
                        ? 'bg-secondary text-white border-secondary'
                        : 'bg-white text-textSecondary border-gray-200 hover:border-secondary hover:text-secondary'
                    }`}>
                    {label}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block">
          {paginated.length === 0 ? (
            <div className="py-14 flex flex-col items-center gap-2 text-textSecondary">
              <ClipboardList size={40} strokeWidth={1.5} className="opacity-40" />
              <p className="text-xs md:text-sm">No quizzes match your filters.</p>
            </div>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs md:text-sm lg:text-sm font-semibold text-textPrimary w-16">S.No</th>
                  <th className="text-left px-4 py-3 text-xs md:text-sm lg:text-sm font-semibold text-textPrimary">Quiz Title</th>
                  <th className="text-left px-4 py-3 text-xs md:text-sm lg:text-sm font-semibold text-textPrimary w-40">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((quiz, index) => (
                  <tr key={quiz.id} className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4 text-xs md:text-sm lg:text-sm font-medium text-textPrimary">{(currentPage - 1) * pageSize + index + 1}</td>
                    <td className="px-4 py-4 text-xs md:text-sm lg:text-sm font-medium text-textPrimary">{quiz.title}</td>
                    <td className="px-4 py-4"><StatusButton quiz={quiz} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden px-4 py-4 flex flex-col gap-3">
          {paginated.length === 0 ? (
            <div className="py-10 flex flex-col items-center gap-2 text-textSecondary">
              <p className="text-xs md:text-sm">No quizzes match your filters.</p>
            </div>
          ) : (
            paginated.map((quiz, index) => (
              <MobileQuizCard key={quiz.id} quiz={quiz} index={(currentPage - 1) * pageSize + index} />
            ))
          )}
        </div>

        {/* Pagination */}
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
  );
}