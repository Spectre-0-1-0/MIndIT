import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const questions = [
  { prompt: 'I see myself as someone who is reserved.' },
  { prompt: 'I see myself as someone who is generally trusting.' },
  { prompt: 'I see myself as someone who tends to be lazy.' },
  { prompt: 'I see myself as someone who is relaxed, handles stress well.' },
  { prompt: 'I see myself as someone who has few artistic interests.' },
  { prompt: 'I see myself as someone who is outgoing, sociable.' },
  { prompt: 'I see myself as someone who tends to find fault with others.' },
  { prompt: 'I see myself as someone who does a thorough job.' },
  { prompt: 'I see myself as someone who gets nervous easily.' },
  { prompt: 'I see myself as someone who has an active imagination.' },
];

const answerOptions = [
  { value: 1, label: 'Disagree strongly' },
  { value: 2, label: 'Disagree a little' },
  { value: 3, label: 'Neither agree nor disagree' },
  { value: 4, label: 'Agree a little' },
  { value: 5, label: 'Agree strongly' },
];

function WellnessBuddy() {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 mb-4">
      <div className="relative group">
        <div className="absolute inset-0 bg-indigo-400/20 rounded-full blur-2xl animate-pulse group-hover:bg-indigo-400/30 transition-colors" />
        <svg className="relative w-20 h-20 drop-shadow-lg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="#6366f1" fillOpacity="0.1" />
          <circle cx="50" cy="50" r="30" fill="#6366f1" fillOpacity="0.2">
            <animate attributeName="r" values="30;33;30" dur="4s" repeatCount="indefinite" />
          </circle>
          <g>
            <circle cx="42" cy="45" r="3" fill="#4f46e5">
              <animate attributeName="cy" values="45;44;45" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="58" cy="45" r="3" fill="#4f46e5">
              <animate attributeName="cy" values="45;44;45" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>
          <path d="M40 60 Q50 72 60 60" stroke="#4f46e5" strokeWidth="3" fill="transparent" strokeLinecap="round">
            <animate attributeName="d" values="M40 60 Q50 72 60 60;M40 62 Q50 74 60 62;M40 60 Q50 72 60 60" dur="4s" repeatCount="indefinite" />
          </path>
        </svg>
      </div>
      <p className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase opacity-60">Wellness Buddy</p>
    </div>
  );
}

function StepIndicator({ currentStep }) {
  const steps = [
    { id: 'userData', label: 'Info' },
    { id: 'consent', label: 'Consent' },
    { id: 'assessment', label: 'Questions' }
  ];

  return (
    <div className="flex items-center justify-center space-x-4 mb-6 select-none scale-90">
      {steps.map((s, i) => {
        const isActive = currentStep === s.id;
        const isPast = steps.findIndex(step => step.id === currentStep) > i;

        return (
          <div key={s.id} className="flex items-center group">
            <div className={`relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-500 ${
              isActive
                ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-lg scale-110'
                : isPast
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-slate-50 text-slate-300'
            }`}>
              {isPast ? '✓' : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`ml-4 h-0.5 w-6 rounded-full transition-all duration-500 ${
                isPast ? 'bg-indigo-200' : 'bg-slate-100'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function BFI10() {
  const [step, setStep] = useState('userData');
  const [userData, setUserData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    phone: ''
  });
  const [consent, setConsent] = useState(false);
  const [answers, setAnswers] = useState(Array(10).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, currentQuestion]);

  const handleUserDataChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateUserData = () => {
    if (!userData.name.trim() || !userData.rollNumber.trim() || !userData.email.trim()) {
      setError('Please fill in all required fields.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleProceedWithInfo = () => {
    if (validateUserData()) {
      setStep('consent');
    }
  };

  const handleProceedAnonymous = () => {
    setUserData({
      name: 'Anonymous',
      rollNumber: 'N/A',
      email: 'anonymous@mcheck.udaan',
      phone: ''
    });
    setStep('consent');
  };

  const handleSubmitAssessment = async () => {
    if (answers.some(a => a === null)) {
      setError('Please answer all questions.');
      return;
    }

    setIsLoading(true);
    setStep('submitting');

    try {
      const response = await fetch('/api/bfi10/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.rollNumber,
          userInfo: userData,
          consentGiven: consent,
          responses: answers
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Submission failed');

      navigate('/results', {
        state: {
          result: {
            assessmentId: 'bfi10',
            title: 'BFI-10 Personality Profile',
            oceanScores: data.ocean_scores,
            interpretation: data.interpretation,
            userInfo: userData
          }
        }
      });
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to save assessment. Please check your connection.');
      setStep('assessment');
    } finally {
      setIsLoading(false);
    }
  };

  const containerClasses = "relative max-w-2xl mx-auto flex flex-col justify-between overflow-hidden rounded-[2rem] bg-white/80 backdrop-blur-md p-4 sm:p-8 shadow-2xl transition-all duration-700 perspective-1000 transform-gpu asmr-hover border border-white/50";
  const innerCardClasses = "relative z-10 w-full animate-entrance";

  if (step === 'submitting') {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <section className={containerClasses + " min-h-[400px] w-full"}>
          <div className="flex flex-col items-center justify-center flex-1 space-y-6">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600 shadow-glow" />
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Creating Your Profile</h2>
              <p className="text-sm text-slate-500 italic">Generating insights...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex flex-col justify-center py-4 px-4 sm:py-8">
      <StepIndicator currentStep={step} />

      <section className={containerClasses}>
        <div className={innerCardClasses} key={step + (step === 'assessment' ? currentQuestion : '')}>
          {step === 'userData' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">BFI-10 Assessment</h1>
                <p className="text-sm text-slate-500">Brief, scientifically validated personality measurement.</p>
              </div>

              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label htmlFor="full-name" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input id="full-name" value={userData.name} onChange={(e) => handleUserDataChange('name', e.target.value)} placeholder="Name" className="mc-input px-4 py-3 text-sm h-12" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="roll-number" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Roll Number</label>
                    <input id="roll-number" value={userData.rollNumber} onChange={(e) => handleUserDataChange('rollNumber', e.target.value)} placeholder="ID" className="mc-input px-4 py-3 text-sm h-12" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <input id="email" type="email" value={userData.email} onChange={(e) => handleUserDataChange('email', e.target.value)} placeholder="Email" className="mc-input px-4 py-3 text-sm h-12" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone (Opt)</label>
                    <input id="phone" value={userData.phone} onChange={(e) => handleUserDataChange('phone', e.target.value)} placeholder="Phone" className="mc-input px-4 py-3 text-sm h-12" />
                  </div>
                </div>
                {error && <div className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-600 border border-red-100 animate-shake">{error}</div>}
              </div>
            </div>
          )}

          {step === 'consent' && (
            <div className="space-y-4 text-center">
              <WellnessBuddy />
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Privacy & Consent</h1>
              <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                Your data is secure and confidential. We use it for research and administrative purposes only.
              </p>

              <label className="flex items-start gap-3 rounded-2xl border border-slate-100 p-4 cursor-pointer hover:bg-indigo-50/50 transition-all mc-ripple bg-slate-50/20 text-left mt-4">
                <input type="checkbox" id="consent-checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer" />
                <span className="text-xs font-medium text-slate-600 leading-relaxed">
                  I agree to the data collection policy for administrative tracking.
                </span>
              </label>
            </div>
          )}

          {step === 'assessment' && (
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Question {currentQuestion + 1} / {questions.length}</p>
                </div>
                <div className="mc-progress h-2 w-24">
                  <div className="mc-progress__bar" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight tracking-tight min-h-[2.5rem]">{questions[currentQuestion].prompt}</h2>
                <div className="grid gap-2">
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
                      className={`group flex items-center justify-between rounded-xl border p-3 text-left transition-all mc-ripple ${
                        answers[currentQuestion] === opt.value
                          ? 'border-indigo-600 bg-indigo-50 scale-[1.01] shadow-sm'
                          : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 active:scale-95'
                      }`}
                    >
                      <span className={`text-sm font-bold ${answers[currentQuestion] === opt.value ? 'text-indigo-700' : 'text-slate-500'}`}>{opt.label}</span>
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${answers[currentQuestion] === opt.value ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'}`}>
                        {answers[currentQuestion] === opt.value && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative z-10 mt-6 pt-4 border-t border-slate-50">
          {step === 'userData' && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <button onClick={handleProceedAnonymous} className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all h-12">Anonymous</button>
                <button onClick={handleProceedWithInfo} className="flex-1 mc-button mc-ripple asmr-hover h-12 text-xs">Continue</button>
              </div>
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('bfi10AdminEntry', 'true');
                    navigate('/bfi10-admin', { state: { fromAssessmentStart: true } });
                  }}
                  className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                >
                  Admin Access Board
                </button>
              </div>
            </div>
          )}

          {step === 'consent' && (
            <div className="flex gap-3">
              <button onClick={() => setStep('userData')} className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all h-12">Back</button>
              <button onClick={() => setStep('assessment')} disabled={!consent} className="flex-1 mc-button mc-ripple asmr-hover disabled:opacity-40 h-12 text-xs">I Agree</button>
            </div>
          )}

          {step === 'assessment' && (
            <div className="flex items-center justify-between">
              <button disabled={currentQuestion === 0} onClick={() => setCurrentQuestion(c => c - 1)} className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 disabled:opacity-0 transition-all px-2 py-1">← Back</button>
              {currentQuestion === questions.length - 1 && (
                <button onClick={handleSubmitAssessment} disabled={answers.some(a => a === null)} className="mc-button mc-ripple asmr-hover h-10 px-6 text-xs">Complete</button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
