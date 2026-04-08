import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interpretAssessment } from '../../data/scoring';

const questions = [
  {
    prompt: 'Numbness or tingling',
  },
  {
    prompt: 'Feeling hot',
  },
  {
    prompt: 'Wobbliness in legs',
  },
  {
    prompt: 'Unable to relax',
  },
  {
    prompt: 'Fear of the worst happening',
  },
  {
    prompt: 'Dizzy or lightheaded',
  },
  {
    prompt: 'Heart pounding or racing',
  },
  {
    prompt: 'Unsteady',
  },
  {
    prompt: 'Terrified',
  },
  {
    prompt: 'Nervous',
  },
  {
    prompt: 'Feelings of choking',
  },
  {
    prompt: 'Hands trembling',
  },
  {
    prompt: 'Shaky',
  },
  {
    prompt: 'Fear of losing control',
  },
  {
    prompt: 'Difficulty breathing',
  },
  {
    prompt: 'Fear of dying',
  },
  {
    prompt: 'Scared',
  },
  {
    prompt: 'Indigestion or discomfort in abdomen',
  },
  {
    prompt: 'Faint',
  },
  {
    prompt: 'Face flushed',
  },
  {
    prompt: 'Sweating (not due to heat)',
  },
];

const answerOptions = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Mildly (it did not bother me much)' },
  { value: 2, label: 'Moderately (it was very unpleasant, but I could stand it)' },
  { value: 3, label: 'Severely (I could barely stand it)' },
];

export default function Bai() {
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
      setError('Please select an answer before moving on.');
      return;
    }
    setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handleSubmit = () => {
    if (selectedValue === null) {
      setError('Please select an answer before submitting.');
      return;
    }
    if (answers.some((value) => value === null)) {
      setError('Please answer all questions before submitting.');
      return;
    }

    const totalScore = answers.reduce((sum, value) => sum + value, 0);

    navigate('/results', {
      state: {
        assessmentId: 'bai',
        title: 'BAI',
        score: totalScore,
        interpretation: interpretAssessment('bai', totalScore),
      },
    });
  };

  return (
    <section className="space-y-8 rounded-[2rem] bg-white p-6 shadow-lg sm:p-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">Beck Anxiety Inventory (BAI)</h1>
        <p className="text-slate-600">
          Answer each item based on how much it has bothered you in the past week. This is a self-assessment only.
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
                name={`bai-question-${currentQuestion}`}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => handleAnswer(option.value)}
                className="h-4 w-4 accent-indigo-600"
              />
              <div>
                <p className="font-medium text-slate-800">{option.label}</p>
                <p className="text-sm text-slate-500">Score: {option.value}</p>
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
        Privacy notice: This questionnaire is for self-awareness only. No answers are stored or shared, and results remain private in your browser session.
      </p>
    </section>
  );
}
