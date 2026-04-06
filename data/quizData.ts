import { Quiz, QuizDetail } from '@/types/quiz';

export const QUIZZES: Quiz[] = [
  {
    id: 1,
    title: "What's New & Trending in Trichology?",
    status: 'not_attempted',
    totalQuestions: 5,
  },
  {
    id: 2,
    title: 'Advanced Scalp Disorders Assessment',
    status: 'completed',
    score: 3,
    totalQuestions: 5,
  },
  {
    id: 3,
    title: 'Hair Loss Patterns & Classification Quiz',
    status: 'not_attempted',
    totalQuestions: 5,
  },
  {
    id: 4,
    title: 'Clinical Trichology Fundamentals',
    status: 'completed',
    score: 4,
    totalQuestions: 5,
  },
  {
    id: 5,
    title: 'Nutrition & Hair Health Evaluation',
    status: 'not_attempted',
    totalQuestions: 5,
  },
];

export const QUIZ_DETAIL: QuizDetail = {
  id: 1,
  title: "What's New & Trending in Trichology?",
  subtitle: 'Assessment for Managing Androgenetic Alopecia - From Roots to Remedies',
  questions: [
    {
      id: 'q1',
      text: 'Which of the following is not an indication of Exosomes',
      type: 'multi',
      options: [
        { value: 'a', label: 'Antiaging' },
        { value: 'b', label: 'Hyperpigmentation' },
        { value: 'c', label: 'Hydration' },
        { value: 'd', label: 'Alopecia' },
        { value: 'e', label: 'Not sure' },
      ],
      correctAnswer: 'b',
      explanation: 'Hyperpigmentation',
    },
    {
      id: 'q2',
      text: 'Identify the structure labelled in the diagram below.',
      type: 'single',
      options: [
        {
          value: 'a',
          label: 'Sebaceous Gland',
          imageUrl: '/images/quiz_image/quiz_img.jpg',
        },
        {
          value: 'b',
          label: 'Arrector Pili Muscle',
          imageUrl: '/images/quiz_image/quiz_img.jpg',
        },
        {
          value: 'c',
          label: 'Dermal Papilla',
          imageUrl: '/images/quiz_image/quiz_img.jpg',
        },
        {
          value: 'd',
          label: 'Apocrine Sweat Gland',
          imageUrl: '/images/quiz_image/quiz_img.jpg',
        },
      ],
      correctAnswer: 'b',
      explanation: 'Arrector Pili Muscle',
    },
    {
      id: 'q3',
      text: 'Which layer confers natural hydrophobicity to the hair',
      type: 'single',
      options: [
        { value: 'a', label: 'A layer' },
        { value: 'b', label: 'B layer' },
        { value: 'c', label: 'Lipid layer' },
        { value: 'd', label: 'Outer B layer' },
        { value: 'e', label: 'Not sure' },
      ],
      correctAnswer: 'a',
      explanation: 'A layer',
    },
    {
      id: 'q4',
      text: 'Which of the following surfactants should one look for in baby hair',
      type: 'single',
      options: [
        { value: 'a', label: 'Amphoteric' },
        { value: 'b', label: 'Cationics' },
        { value: 'c', label: 'Non-ionic' },
        { value: 'd', label: 'Anionics' },
        { value: 'e', label: 'Not sure' },
      ],
      correctAnswer: 'a',
      explanation: 'Amphoteric',
    },
    {
      id: 'q5',
      text: 'Why is it not advisable to use minoxidil sulfate instead of minoxidil?',
      type: 'single',
      options: [
        { value: 'a', label: 'Larger molecular weight' },
        { value: 'b', label: 'Higher degradation' },
        { value: 'c', label: 'Penetration problem' },
        { value: 'd', label: 'All of the above' },
        { value: 'e', label: 'Not sure' },
      ],
      correctAnswer: 'd',
      explanation: 'All of the above',
    },
  ],
};