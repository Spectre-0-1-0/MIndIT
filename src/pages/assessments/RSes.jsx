import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interpretAssessment } from '../../data/scoring';

const questions = [
  {
    prompt: 'On the whole, I am satisfied with myself.',
    reverse: false,
  },
  {
    prompt: 'At times I think I am no good at all.',
    reverse: true,
  },
  {
    prompt: 'I feel that I have a number of good qualities.',
    reverse: false,
  },
  {
    prompt: 'I am able to do things as well as most other people.',
    reverse: false,
  },
  {
    prompt: 'I feel I do not have much to be proud of.',
    reverse: true,
  },
  {
    prompt: 'I certainly feel useless at times.',
    reverse: true,
  },
  {
    prompt: 'I feel that I’m a person of worth, at least on an equal plane with others.',
    reverse: false,
  },
  {
    prompt: 'I wish I could have more respect for myself.',
    reverse: true,
  },
  {
    prompt: 'All in all, I am inclined to feel that I am a failure.',
    reverse: true,
  },
  {
    prompt: 'I take a positive attitude toward myself.',
    reverse: false,
  },
];

const answerOptions = [
  { value: 3, label: 'Strongly Agree' },
  { value: 2, label: 'Agree' },
  { value: 1, label: 'Disagree' },
  { value: 0, label: 'Strongly Disagree' },
];

function reverseScore(value) {
  return 3 - value;
}

export default function RSes() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [error, setError] = useState('');
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
    const next = [...answers];
    next[currentQuestion] = value;
    setAnswers(next);
    setError('');
  };

  const handlePrevious = () => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (selectedValue === null) {
      setError('Please choose an answer before moving on.');
      return;
    }
    setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handleSubmit = () => {
    if (selectedValue === null) {
      setError('Please choose an answer before submitting.');
      return;
    }
    if (answers.some((value) => value === null)) {
      setError('Please answer every question before submitting.');
      return;
    }

    const scoredAnswers = answers.map((value, index) =>
      questions[index].reverse ? reverseScore(value) : value
    );

    const totalScore = scoredAnswers.reduce((sum, value) => sum + value, 0);

    navigate('/results', {
      state: {
        result: {
          assessmentId: 'rses',
          title: 'RSES',
          score: totalScore,
          interpretation: interpretAssessment('rses', totalScore),
        },
      },
    });
  };

  return (
    <section className="space-y-8 rounded-[2rem] bg-white p-6 shadow-lg sm:p-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">Rosenberg Self-Esteem Scale (RSES)</h1>
        <p className="text-slate-600">
          Answer each statement based on how much you agree today. This questionnaire is for private reflection only.
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
          {answerOptions.map((option) => (
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
                name={`rses-question-${currentQuestion}`}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => handleAnswer(option.value)}
                className="h-4 w-4 accent-indigo-600"
              />
              <div>
                <p className="font-medium text-slate-800">{option.label}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

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
            className="inline-flex min-w-[140px] items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex min-w-[140px] items-center justify-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Submit Assessment
          </button>
        )}
      </div>

      <p className="text-sm leading-6 text-slate-500">
        Privacy notice: This questionnaire is for self-awareness only. No responses are stored or shared, and results remain private in this browser session.
      </p>
    </section>
  );
}
