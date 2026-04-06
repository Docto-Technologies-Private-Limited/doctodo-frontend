export type QuizStatus = 'not_attempted' | 'completed';

export interface Quiz {
  id: number;
  title: string;
  status: QuizStatus;
  score?: number;
  totalQuestions: number;
}

export type AnswerOption = {
  value: string;
  label: string;
  imageUrl?: string;
};

export type QuestionType = 'single' | 'multi';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: AnswerOption[];
  correctAnswer: string | string[];
  explanation: string;
}

export interface QuizDetail {
  id: number;
  title: string;
  subtitle: string;
  questions: Question[];
}

export interface QuizResult {
  questionId: string;
  questionText: string;
  type: QuestionType;
  options: AnswerOption[];
  selectedAnswer: string | string[];
  correctAnswer: string | string[];
  explanation: string;
  isCorrect: boolean;
}