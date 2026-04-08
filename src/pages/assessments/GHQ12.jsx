import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interpretAssessment } from '../../data/scoring';

const questions = [
  {
    text: "Been able to concentrate on what you're doing?",
    options: [
      { label: 'Better', value: 0 },
      { label: 'Same as usual', value: 1 },
      { label: 'Less than usual', value: 2 },
      { label: 'Much less than usual', value: 3 },
    ],
  },
  {
    text: 'Lost much sleep over worry?',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'No more', value: 1 },
      { label: 'Rather more', value: 2 },
      { label: 'Much more', value: 3 },
    ],
  },
  {
    text: 'Felt you were playing a useful part in things?',
    options: [
      { label: 'More so', value: 0 },
      { label: 'Same', value: 1 },
      { label: 'Less useful', value: 2 },
      { label: 'Much less useful', value: 3 },
    ],
  },
  {
    text: 'Felt capable of making decisions?',
    options: [
      { label: 'More so', value: 0 },
      { label: 'Same', value: 1 },
      { label: 'Less so', value: 2 },
      { label: 'Much less capable', value: 3 },
    ],
  },
  {
    text: 'Felt constantly under strain?',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'No more', value: 1 },
      { label: 'Rather more', value: 2 },
      { label: 'Much more', value: 3 },
    ],
  },
  {
    text: 'Felt you couldn\'t overcome your difficulties?',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'No more', value: 1 },
      { label: 'Rather more', value: 2 },
      { label: 'Much more', value: 3 },
    ],
  },
  {
    text: 'Been able to enjoy your normal day-to-day activities?',
    options: [
      { label: 'More so', value: 0 },
      { label: 'Same', value: 1 },
      { label: 'Less so', value: 2 },
      { label: 'Much less', value: 3 },
    ],
  },
  {
    text: 'Been able to face up to your problems?',
    options: [
      { label: 'More so', value: 0 },
      { label: 'Same', value: 1 },
      { label: 'Less so', value: 2 },
      { label: 'Much less able', value: 3 },
    ],
  },
  {
    text: 'Been feeling unhappy and depressed?',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'No more', value: 1 },
      { label: 'Rather more', value: 2 },
      { label: 'Much more', value: 3 },
    ],
  },
  {
    text: 'Been losing confidence in yourself?',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'No more', value: 1 },
      { label: 'Rather more', value: 2 },
      { label: 'Much more', value: 3 },
    ],
  },
  {
    text: 'Been thinking of yourself as a worthless person?',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'No more', value: 1 },
      { label: 'Rather more', value: 2 },
      { label: 'Much more', value: 3 },
    ],
  },
  {
    text: 'Been feeling reasonably happy, all things considered?',
    options: [
      { label: 'More so', value: 0 },
      { label: 'Same', value: 1 },
      { label: 'Less so', value: 2 },
      { label: 'Much less', value: 3 },
    ],
  },
];

export default function GHQ12() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [score, setScore] = useState(null);
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

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = Number(value);
    setAnswers(newAnswers);
  };

  const submit = (event) => {
    event.preventDefault();
    if (answers.some(answer => answer === null)) {
      alert('Please answer all questions before submitting.');
      return;
    }
    const total = answers.reduce((sum, value) => sum + value, 0);
    setScore(total);
    navigate('/results', {
      state: {
        result: {
          assessmentId: 'ghq12',
          title: 'GHQ-12',
          score: total,
          interpretation: interpretAssessment('ghq12', total),
        },
      },
    });
  };

  return (
    <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">GHQ-12 Assessment</h1>
        <p className="text-slate-600">A general screening of current mental well-being.</p>
      </header>

      <form onSubmit={submit} className="space-y-5">
        {questions.map((question, index) => (
          <div key={question.text} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-medium text-slate-900">{index + 1}. {question.text}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {question.options.map((option) => (
                <label key={option.value} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm transition hover:border-slate-300">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option.value}
                    checked={answers[index] === option.value}
                    onChange={() => handleChange(index, option.value)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700">
          Submit GHQ-12
        </button>
      </form>
    </section>
  );
}
