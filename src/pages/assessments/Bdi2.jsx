import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interpretAssessment } from '../../data/scoring';

const questions = [
  {
    prompt: 'Sadness',
    options: [
      { value: 0, label: "I do not feel sad." },
      { value: 1, label: 'I feel sad much of the time.' },
      { value: 2, label: 'I am sad all the time.' },
      { value: 3, label: "I am so sad or unhappy that I can't stand it." },
    ],
  },
  {
    prompt: 'Pessimism',
    options: [
      { value: 0, label: 'I am not particularly discouraged about the future.' },
      { value: 1, label: 'I feel discouraged about the future.' },
      { value: 2, label: 'I feel I have nothing to look forward to.' },
      { value: 3, label: 'I feel the future is hopeless and that things cannot improve.' },
    ],
  },
  {
    prompt: 'Past Failure',
    options: [
      { value: 0, label: 'I do not feel like a failure.' },
      { value: 1, label: 'I have failed more than the average person.' },
      { value: 2, label: 'As I look back on my life, all I can see is a lot of failures.' },
      { value: 3, label: 'I feel I am a complete failure as a person.' },
    ],
  },
  {
    prompt: 'Loss of Pleasure',
    options: [
      { value: 0, label: 'I get as much pleasure as I ever did from the things I enjoy.' },
      { value: 1, label: "I don't enjoy things as much as I used to." },
      { value: 2, label: 'I get very little pleasure from the things I used to enjoy.' },
      { value: 3, label: "I can't get any pleasure from the things I used to enjoy." },
    ],
  },
  {
    prompt: 'Guilty Feelings',
    options: [
      { value: 0, label: "I don't feel particularly guilty." },
      { value: 1, label: 'I feel guilty a good part of the time.' },
      { value: 2, label: 'I feel quite guilty most of the time.' },
      { value: 3, label: 'I feel guilty all the time.' },
    ],
  },
  {
    prompt: 'Punishment Feelings',
    options: [
      { value: 0, label: "I don't feel I am being punished." },
      { value: 1, label: 'I feel I may be punished.' },
      { value: 2, label: 'I expect to be punished.' },
      { value: 3, label: 'I feel I am being punished.' },
    ],
  },
  {
    prompt: 'Self-Dislike',
    options: [
      { value: 0, label: 'I feel the same about myself as ever.' },
      { value: 1, label: 'I have lost confidence in myself.' },
      { value: 2, label: 'I am disappointed in myself.' },
      { value: 3, label: 'I dislike myself.' },
    ],
  },
  {
    prompt: 'Self-Criticalness',
    options: [
      { value: 0, label: "I don't criticize or blame myself more than usual." },
      { value: 1, label: 'I am more critical of myself than I used to be.' },
      { value: 2, label: 'I criticize myself for all of my faults.' },
      { value: 3, label: 'I blame myself for everything bad that happens.' },
    ],
  },
  {
    prompt: 'Suicidal Thoughts or Wishes',
    options: [
      { value: 0, label: "I don't have any thoughts of killing myself." },
      { value: 1, label: 'I have thoughts of killing myself, but I would not carry them out.' },
      { value: 2, label: 'I would like to kill myself.' },
      { value: 3, label: 'I would kill myself if I had the chance.' },
    ],
  },
  {
    prompt: 'Crying',
    options: [
      { value: 0, label: "I don't cry any more than usual." },
      { value: 1, label: 'I cry more now than I used to.' },
      { value: 2, label: 'I cry all the time now.' },
      { value: 3, label: "I used to be able to cry, but now I can't cry even though I want to." },
    ],
  },
  {
    prompt: 'Agitation',
    options: [
      { value: 0, label: 'I am no more restless or wound up than usual.' },
      { value: 1, label: 'I feel more restless or wound up than usual.' },
      { value: 2, label: "I am so restless or agitated that it's hard to stay still." },
      { value: 3, label: 'I am so restless or agitated that I have to keep moving or doing something.' },
    ],
  },
  {
    prompt: 'Loss of Interest',
    options: [
      { value: 0, label: 'I have not lost interest in other people or activities.' },
      { value: 1, label: 'I am less interested in other people or things than I used to be.' },
      { value: 2, label: 'I have lost most of my interest in other people or things.' },
      { value: 3, label: 'I have lost all of my interest in other people or things.' },
    ],
  },
  {
    prompt: 'Indecisiveness',
    options: [
      { value: 0, label: 'I make decisions about as well as I ever could.' },
      { value: 1, label: 'I put off making decisions more than I used to.' },
      { value: 2, label: 'I have greater difficulty in making decisions more than I used to.' },
      { value: 3, label: "I can't make decisions at all anymore." },
    ],
  },
  {
    prompt: 'Worthlessness',
    options: [
      { value: 0, label: 'I do not feel I am worthless.' },
      { value: 1, label: "I don't consider myself as worthwhile and useful as I used to." },
      { value: 2, label: 'I feel more worthless as compared to others.' },
      { value: 3, label: 'I feel utterly worthless.' },
    ],
  },
  {
    prompt: 'Loss of Energy',
    options: [
      { value: 0, label: 'I have as much energy as ever.' },
      { value: 1, label: 'I have less energy than I used to have.' },
      { value: 2, label: 'I get tired easily and have to rest more.' },
      { value: 3, label: 'I am too tired to do anything.' },
    ],
  },
  {
    prompt: 'Changes in Sleeping Pattern',
    options: [
      { value: 0, label: "I haven't experienced any change in my sleeping pattern." },
      { value: 1, label: 'I sleep somewhat more than usual / somewhat less than usual.' },
      { value: 2, label: 'I sleep a lot more than usual / a lot less than usual.' },
      { value: 3, label: 'I sleep most of the day / wake up 1-2 hours early and cannot get back to sleep.' },
    ],
  },
  {
    prompt: 'Irritability',
    options: [
      { value: 0, label: 'I am no more irritable than usual.' },
      { value: 1, label: 'I am more irritable than usual.' },
      { value: 2, label: 'I am much more irritable than usual.' },
      { value: 3, label: 'I am irritable all the time.' },
    ],
  },
  {
    prompt: 'Changes in Appetite',
    options: [
      { value: 0, label: 'There has been no change in my appetite.' },
      { value: 1, label: 'My appetite is somewhat less / somewhat greater than usual.' },
      { value: 2, label: 'My appetite is much less / much greater than usual.' },
      { value: 3, label: 'I have no appetite at all / I crave food all the time.' },
    ],
  },
  {
    prompt: 'Concentration Difficulty',
    options: [
      { value: 0, label: 'I can concentrate as well as ever.' },
      { value: 1, label: "I can't concentrate as well as usual." },
      { value: 2, label: "It's hard to keep my mind on anything." },
      { value: 3, label: "I find I can't concentrate on anything." },
    ],
  },
  {
    prompt: 'Tiredness or Fatigue',
    options: [
      { value: 0, label: 'I am no more tired or fatigued than usual.' },
      { value: 1, label: 'I get more tired or fatigued more easily than usual.' },
      { value: 2, label: 'I am too tired or fatigued to do a lot of the things I used to do.' },
      { value: 3, label: 'I am too tired or fatigued to do most of the things I used to do.' },
    ],
  },
  {
    prompt: 'Loss of Interest in Sex',
    options: [
      { value: 0, label: 'I have not noticed any recent change in my interest in sex.' },
      { value: 1, label: 'I am less interested in sex than I used to be.' },
      { value: 2, label: 'I am much less interested in sex now.' },
      { value: 3, label: 'I have lost interest in sex entirely.' },
    ],
  },
];

export default function Bdi2() {
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
      setError('Please select an answer before continuing.');
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
    const requiresAttentionNote = answers[8] > 0;

    navigate('/results', {
      state: {
        result: {
          assessmentId: 'bdi2',
          title: 'BDI-II',
          score: totalScore,
          interpretation: interpretAssessment('bdi2', totalScore),
          requiresAttention: requiresAttentionNote,
        },
      },
    });
  };

  return (
    <section className="space-y-8 rounded-[2rem] bg-white p-6 shadow-lg sm:p-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">BDI-II</h1>
        <p className="text-slate-600">
          Complete the Beck Depression Inventory-II for a private self-check. Your answers are not stored.
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
          {questions[currentQuestion].options.map((option) => (
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
                name={`bdi2-question-${currentQuestion}`}
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
        Privacy notice: This questionnaire is for self-awareness only. Answers are not stored or shared, and results stay private in your browser session.
      </p>
    </section>
  );
}
