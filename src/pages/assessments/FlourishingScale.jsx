import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interpretAssessment } from '../../data/scoring';

const questions = [
  {
    prompt: 'I lead a purposeful and meaningful life.',
  },
  {
    prompt: 'My social relationships are supportive and rewarding.',
  },
  {
    prompt: 'I am engaged and interested in my daily activities.',
  },
  {
    prompt: 'I actively contribute to the happiness and wellbeing of others.',
  },
  {
    prompt: 'I am competent and capable in the activities that are important to me.',
  },
  {
    prompt: 'I am a good person and live a good life.',
  },
  {
    prompt: 'I am optimistic about my future.',
  },
  {
    prompt: 'People respect me.',
  },
];

const options = [
  { label: 'Strongly disagree', value: 1 },
  { label: 'Disagree', value: 2 },
  { label: 'Slightly disagree', value: 3 },
  { label: 'Mixed / Neither', value: 4 },
  { label: 'Slightly agree', value: 5 },
  { label: 'Agree', value: 6 },
  { label: 'Strongly agree', value: 7 },
];

export default function FlourishingScale() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Simulate loading time for smooth UX
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <section className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="mt-4 text-slate-600">Preparing assessment...</p>
        </div>
      </section>
    );
  }

  const selectedValue = answers[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value) => {
    const nextAnswers = [...answers];
    nextAnswers[currentQuestion] = value;
    setAnswers(nextAnswers);
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (selectedValue === null) return;
    setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handleSubmit = () => {
    if (selectedValue === null) return;
    const score = answers.reduce((sum, value) => sum + (value || 0), 0);
    navigate('/results', {
      state: {
        result: {
          assessmentId: 'flourishing',
          title: 'Flourishing Scale',
          score,
          interpretation: interpretAssessment('flourishing', score),
        },
      },
    });
  };

  return (
    <section className="space-y-8 rounded-[2rem] bg-white p-6 shadow-lg sm:p-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">Flourishing Scale</h1>
        <p className="text-slate-600">
          Answer each statement from 1 to 7 based on how well it describes you today.
        </p>
      </header>

      <div className="rounded-3xl bg-slate-50 p-5">
        <div className="mb-4 flex items-center justify-between text-sm font-medium text-slate-700">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-base font-semibold text-slate-900">{questions[currentQuestion].prompt}</p>
        <div className="mt-6 grid gap-3">
          {options.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-4 rounded-3xl border p-4 transition ${
                selectedValue === option.value
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-slate-200 bg-white hover:border-indigo-300'
              }`}
            >
              <input
                type="radio"
                name={`flourishing-question-${currentQuestion}`}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => handleAnswer(option.value)}
                className="h-4 w-4 accent-indigo-600"
              />
              <div>
                <p className="font-medium text-slate-800">{option.label}</p>
                <p className="text-sm text-slate-500">{option.value}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="inline-flex min-w-[140px] items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        {currentQuestion < questions.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={selectedValue === null}
            className="inline-flex min-w-[140px] items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selectedValue === null}
            className="inline-flex min-w-[140px] items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit Assessment
          </button>
        )}
      </div>

      <p className="text-sm leading-6 text-slate-500">
        This scale is for self-reflection. No responses are stored or shared, and results remain private in your current session.
      </p>
    </section>
  );
}
