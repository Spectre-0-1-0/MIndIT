import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interpretAssessment } from '../../data/scoring';

const questions = [
  'Been able to concentrate on what you’re doing?',
  'Lost much sleep over worry?',
  'Felt that you were playing a useful part in things?',
  'Felt capable of making decisions about things?',
  'Felt constantly under strain?',
  'Felt you couldn’t overcome your difficulties?',
  'Been able to enjoy your normal day-to-day activities?',
  'Been able to face up to your problems?',
  'Been feeling unhappy or depressed?',
  'Been losing confidence in yourself?',
  'Been thinking of yourself as a worthless person?',
  'Been feeling reasonably happy, all things considered?',
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
          <div key={question} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="font-medium text-slate-900">{index + 1}. {question}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {[0, 1].map((value) => (
                <label key={value} className="inline-flex items-center gap-2 text-slate-700">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={value}
                    checked={answers[index] === value}
                    onChange={() => handleChange(index, value)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900"
                  />
                  {value === 0 ? 'Not at all' : 'More than usual'}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className="inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700">
          Submit GHQ-12
        </button>
      </form>
      {score !== null ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
          <strong>Local score:</strong> {score}
        </div>
      ) : null}
    </section>
  );
}
