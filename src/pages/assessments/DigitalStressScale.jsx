import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interpretAssessment } from '../../data/scoring';

const questions = [
  {
    prompt: 'My friends expect me to be constantly available online.',
    category: 'Availability Stress',
  },
  {
    prompt: 'On top of the other things I must do, keeping up with notifications is a chore.',
    category: 'Connection Overload',
  },
  {
    prompt: 'I am nervous about how people will respond to my posts and photos.',
    category: 'Approval Anxiety',
  },
  {
    prompt: 'I feel socially unavailable when I do not have my phone.',
    category: 'Online Vigilance',
  },
  {
    prompt: 'I fear my friends are having more rewarding experiences than me.',
    category: 'Fear of Missing Out',
  },
  {
    prompt: 'I have to check too many notifications.',
    category: 'Connection Overload',
  },
  {
    prompt: 'I must have my phone with me to know what is going on.',
    category: 'Online Vigilance',
  },
  {
    prompt: 'For my friends, it is important that I am constantly available online.',
    category: 'Availability Stress',
  },
  {
    prompt: 'I feel anxious about how others will respond when I share a new photo on social media.',
    category: 'Approval Anxiety',
  },
  {
    prompt: 'I fear that others have more rewarding experiences than me.',
    category: 'Fear of Missing Out',
  },
  {
    prompt: 'I feel overwhelmed with the flow of messages/notifications on my phone.',
    category: 'Connection Overload',
  },
  {
    prompt: 'I feel lost or "naked" without my phone.',
    category: 'Online Vigilance',
  },
  {
    prompt: 'I get worried when I find out my friends are having fun without me.',
    category: 'Fear of Missing Out',
  },
  {
    prompt: 'It feels like there is always a reminder – like a flashing light or buzz – that there is some other message I need to attend to.',
    category: 'Connection Overload',
  },
  {
    prompt: 'I am constantly checking my phone for messages/notifications.',
    category: 'Online Vigilance',
  },
  {
    prompt: 'Most of my friends approve of me being constantly available online.',
    category: 'Availability Stress',
  },
  {
    prompt: 'I feel nervous after I share a post or photo to see how others responded to it.',
    category: 'Approval Anxiety',
  },
  {
    prompt: 'I feel a social obligation to be constantly available online.',
    category: 'Availability Stress',
  },
  {
    prompt: 'I feel stress because I must sift through a lot of unimportant notifications to get to the important ones.',
    category: 'Connection Overload',
  },
  {
    prompt: 'I put a lot of effort into composing messages and posts I share online.',
    category: 'Approval Anxiety',
  },
  {
    prompt: 'I get anxious when I don’t know what my friends are up to.',
    category: 'Fear of Missing Out',
  },
  {
    prompt: 'I put a lot of effort into finding or creating a photo that others will approve of when I post it online.',
    category: 'Approval Anxiety',
  },
  {
    prompt: 'I spend too much time responding to notifications/messages.',
    category: 'Connection Overload',
  },
  {
    prompt: 'I feel nervous about how others will respond when I post new updates on social media.',
    category: 'Approval Anxiety',
  },
];

const answerOptions = [
  { value: 1, label: 'Never' },
  { value: 2, label: 'Rarely' },
  { value: 3, label: 'Sometimes' },
  { value: 4, label: 'Often' },
  { value: 5, label: 'Always' },
];

export default function DigitalStressScale() {
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
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQuestion] = value;
      return next;
    });
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
      setError('Please answer every question before submitting.');
      return;
    }

    const subscaleAverages = {
      availabilityStress: [0, 7, 15, 17].reduce((sum, idx) => sum + answers[idx], 0) / 4,
      approvalAnxiety: [2, 8, 16, 19, 21, 23].reduce((sum, idx) => sum + answers[idx], 0) / 6,
      fearOfMissingOut: [4, 9, 12, 20].reduce((sum, idx) => sum + answers[idx], 0) / 4,
      connectionOverload: [1, 5, 10, 13, 18, 22].reduce((sum, idx) => sum + answers[idx], 0) / 6,
      onlineVigilance: [3, 6, 11, 14].reduce((sum, idx) => sum + answers[idx], 0) / 4,
    };

    const overallAverage = answers.reduce((total, value) => total + value, 0) / answers.length;

    navigate('/results', {
      state: {
        assessmentId: 'digitalStress',
        title: 'Digital Stress Scale',
        score: Number(overallAverage.toFixed(2)),
        interpretation: interpretAssessment('digitalStress', subscaleAverages),
        subscaleResults: subscaleAverages,
      },
    });
  };

  return (
    <section className="space-y-8 rounded-[2rem] bg-white p-6 shadow-lg sm:p-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">Digital Stress Scale</h1>
        <p className="text-slate-600">
          Rate each statement from 1 to 5 based on how often it applies. This assessment calculates average subscale scores for digital stress.
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
        <p className="text-base font-semibold text-slate-900">
          {questions[currentQuestion].prompt}
        </p>
        <p className="mt-2 text-sm font-medium text-indigo-700">
          {questions[currentQuestion].category}
        </p>

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
                name={`digital-stress-question-${currentQuestion}`}
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
        Privacy notice: This questionnaire is for self-awareness only. Answers are not stored or shared, and results remain private in your current session.
      </p>
    </section>
  );
}
