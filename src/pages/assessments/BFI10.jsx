import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { calculateBFI10Score, interpretBFI10 } from '../../data/scoring';

const API_BASE = import.meta.env.VITE_API_URL || '';

const questions = [
  { id: 1, prompt: 'Is outgoing, sociable', trait: 'E', reverse: false },
  { id: 2, prompt: 'Is considerate and kind to almost everyone', trait: 'A', reverse: false },
  { id: 3, prompt: 'Tends to be lazy', trait: 'C', reverse: true },
  { id: 4, prompt: 'Is generally trusting', trait: 'A', reverse: false },
  { id: 5, prompt: 'Tends to be depressed, blue', trait: 'N', reverse: false },
  { id: 6, prompt: 'Is original, comes up with new ideas', trait: 'O', reverse: false },
  { id: 7, prompt: 'Is calm, emotionally stable', trait: 'N', reverse: true },
  { id: 8, prompt: 'Is thorough, organized', trait: 'C', reverse: false },
  { id: 9, prompt: 'Is anxious, easily upset', trait: 'N', reverse: false },
  { id: 10, prompt: 'Has an active imagination', trait: 'O', reverse: false },
];

const answerOptions = [
  { value: 1, label: 'Disagree strongly' },
  { value: 2, label: 'Disagree a little' },
  { value: 3, label: 'Neither agree nor disagree' },
  { value: 4, label: 'Agree a little' },
  { value: 5, label: 'Agree strongly' },
];

const traitNames = {
  O: 'Openness',
  C: 'Conscientiousness',
  E: 'Extraversion',
  A: 'Agreeableness',
  N: 'Neuroticism',
};

export default function BFI10() {
  const [step, setStep] = useState('userData'); // 'userData', 'consent', 'assessment', 'submitting', 'results'
  const [userData, setUserData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    phone: '',
    department: '',
    academicYear: '',
  });
  const [anonymous, setAnonymous] = useState(false);
  const [consent, setConsent] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, currentQuestion]);

  const handleUserDataChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateUserData = () => {
    if (anonymous) return true;
    if (!userData.name.trim() || !userData.rollNumber.trim() || !userData.email.trim()) {
      setError('Please fill in all required fields.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleProceedWithInfo = () => {
    if (validateUserData()) setStep('consent');
  };

  const handleProceedAnonymous = () => {
    setAnonymous(true);
    setStep('consent');
  };

  const handleSubmitAssessment = async (e) => {
    e.preventDefault();
    if (answers.some(a => a === null)) {
      setError('Please answer all questions.');
      return;
    }

    setStep('submitting');
    setIsLoading(true);

    try {
      const oceanScores = calculateBFI10Score(answers);
      const interpretation = interpretBFI10(oceanScores);

      const submissionData = {
        userID: anonymous ? `anon_${Date.now()}` : userData.rollNumber || `user_${Date.now()}`,
        timestamp: new Date().toISOString(),
        anonymous,
        userInfo: anonymous ? null : {
          fullName: userData.name,
          rollNumber: userData.rollNumber,
          email: userData.email,
          phone: userData.phone || null,
          department: userData.department || null,
          academicYear: userData.academicYear || null
        },
        consentGiven: consent,
        responses: answers,
        oceanScores,
        interpretation
      };

      const response = await fetch(`${API_BASE}/api/bfi10/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setResults(submissionData);
      setStep('results');
    } catch (err) {
      console.error("Submission error:", err);
      setError('Failed to save assessment. Please check your connection.');
      setStep('assessment');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'results' && results) {
    return (
      <section className="space-y-8 rounded-[2rem] bg-white p-6 shadow-lg sm:p-10">
        <header className="space-y-3 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Your Personality Profile</h1>
          <p className="text-slate-600">BFI-10 Assessment Results</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(results.oceanScores).map(([trait, score]) => {
            const traitInfo = results.interpretation[trait] || {};
            return (
              <div key={trait} className="rounded-3xl border border-slate-100 bg-slate-50/50 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 capitalize">{trait}</h3>
                  <span className="text-sm font-black text-indigo-600">{score.toFixed(2)}/5</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${(score/5)*100}%` }} />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{traitInfo.description || traitInfo}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button onClick={() => window.print()} className="flex-1 rounded-full border-2 border-slate-200 py-4 font-bold text-slate-700 hover:bg-slate-50">Print Results</button>
          <button onClick={() => navigate('/')} className="flex-1 rounded-full bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700">Return Home</button>
        </div>
      </section>
    );
  }

  if (step === 'submitting') {
    return (
      <section className="min-h-[400px] flex flex-col items-center justify-center space-y-6 rounded-[2rem] bg-white p-6 shadow-lg">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Saving Results</h2>
          <p className="text-slate-500">Your profile is being generated...</p>
        </div>
      </section>
    );
  }

  if (step === 'assessment') {
    const q = questions[currentQuestion];
    return (
      <section className="space-y-8 rounded-[2rem] bg-white p-6 shadow-lg sm:p-10">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">{q.prompt}</h2>
          <div className="grid gap-3">
            {answerOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => {
                  const newAnswers = [...answers];
                  newAnswers[currentQuestion] = opt.value;
                  setAnswers(newAnswers);
                  if (currentQuestion < questions.length - 1) {
                    setTimeout(() => setCurrentQuestion(c => c + 1), 200);
                  }
                }}
                className={`group flex items-center justify-between rounded-2xl border-2 p-5 text-left transition-all ${
                  answers[currentQuestion] === opt.value
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                <span className={`font-semibold ${answers[currentQuestion] === opt.value ? 'text-indigo-700' : 'text-slate-600'}`}>
                  {opt.label}
                </span>
                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  answers[currentQuestion] === opt.value ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'
                }`}>
                  {answers[currentQuestion] === opt.value && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <button
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(c => c - 1)}
            className="text-sm font-bold text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-all"
          >
            ← Previous Question
          </button>
          {currentQuestion === questions.length - 1 && (
            <button
              onClick={handleSubmitAssessment}
              disabled={answers.some(a => a === null)}
              className="rounded-full bg-indigo-600 px-10 py-4 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              Complete Assessment
            </button>
          )}
        </div>
      </section>
    );
  }

  if (step === 'consent') {
    return (
      <section className="space-y-8 rounded-[2rem] bg-white p-6 shadow-lg sm:p-10">
        <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl">📝</div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-slate-900">Privacy & Consent</h1>
          <div className="prose prose-slate text-slate-600">
            <p>Your data will be used for research and administrative purposes only. We ensure that:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Your personal information is stored securely.</li>
              <li>Responses are kept confidential.</li>
              <li>You can request data deletion at any time.</li>
            </ul>
          </div>
        </div>

        <label className="flex items-start gap-4 rounded-2xl border-2 border-slate-100 p-6 cursor-pointer hover:bg-slate-50 transition-colors">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-slate-700 leading-relaxed">
            I understand and agree to the data collection policy for administrative tracking.
          </span>
        </label>

        <div className="flex flex-col gap-4 sm:flex-row">
          <button onClick={() => setStep('userData')} className="flex-1 rounded-full border-2 border-slate-200 py-4 font-bold text-slate-700 hover:bg-slate-50 transition-all">Back</button>
          <button
            onClick={() => setStep('assessment')}
            disabled={!consent}
            className="flex-1 rounded-full bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-all"
          >
            I Agree & Start
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8 rounded-[2rem] bg-white p-6 shadow-lg sm:p-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">BFI-10 Personality Assessment</h1>
        <p className="text-slate-500 leading-relaxed">A brief, scientifically validated measurement of your Big Five personality traits.</p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Full Name</label>
            <input
              value={userData.name}
              onChange={(e) => handleUserDataChange('name', e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-5 py-4 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Roll Number</label>
            <input
              value={userData.rollNumber}
              onChange={(e) => handleUserDataChange('rollNumber', e.target.value)}
              placeholder="CS12345"
              className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-5 py-4 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => handleUserDataChange('email', e.target.value)}
              placeholder="john@university.edu"
              className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-5 py-4 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wider">Phone (Optional)</label>
            <input
              value={userData.phone}
              onChange={(e) => handleUserDataChange('phone', e.target.value)}
              placeholder="+1 234 567 890"
              className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 px-5 py-4 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
            />
          </div>
        </div>

        {error && <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100">{error}</div>}

        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
          <button
            onClick={handleProceedAnonymous}
            className="flex-1 rounded-full border-2 border-slate-200 py-4 font-bold text-slate-700 hover:bg-slate-50 transition-all"
          >
            Take Anonymously
          </button>
          <button
            onClick={handleProceedWithInfo}
            className="flex-1 rounded-full bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
          >
            Continue to Consent
          </button>
        </div>
      </div>
    </section>
  );
}
