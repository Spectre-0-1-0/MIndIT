import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { interpretAssessment } from '../../data/scoring';

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
    <div className="flex flex-col items-center justify-center space-y-4 mb-8">
      <div className="relative group">
        <div className="absolute inset-0 bg-indigo-400/20 rounded-full blur-2xl animate-pulse group-hover:bg-indigo-400/30 transition-colors" />
        <svg className="relative w-28 h-28 drop-shadow-xl" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="#6366f1" fillOpacity="0.1" />
          <circle cx="50" cy="50" r="30" fill="#6366f1" fillOpacity="0.2">
            <animate attributeName="r" values="30;33;30" dur="4s" repeatCount="indefinite" />
          </circle>
          {/* Animated Eyes */}
          <g>
            <circle cx="42" cy="45" r="3" fill="#4f46e5">
              <animate attributeName="cy" values="45;44;45" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="58" cy="45" r="3" fill="#4f46e5">
              <animate attributeName="cy" values="45;44;45" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>
          {/* Animated Smile */}
          <path d="M40 60 Q50 72 60 60" stroke="#4f46e5" strokeWidth="3" fill="transparent" strokeLinecap="round">
            <animate attributeName="d" values="M40 60 Q50 72 60 60;M40 62 Q50 74 60 62;M40 60 Q50 72 60 60" dur="4s" repeatCount="indefinite" />
          </path>
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-indigo-600 tracking-wide uppercase opacity-80">Wellness Buddy</p>
        <p className="text-xs text-slate-400">Here to support your journey</p>
      </div>
    </div>
  );
}

function WaveAnimation() {
  return (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0 pointer-events-none opacity-30 select-none">
      <svg className="relative block w-full h-32" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g className="parallax">
          <use href="#gentle-wave" x="48" y="0" fill="rgba(99, 102, 241, 0.4)">
            <animateTransform attributeName="transform" type="translate" from="-90 0" to="85 0" dur="15s" repeatCount="indefinite" />
          </use>
          <use href="#gentle-wave" x="48" y="3" fill="rgba(99, 102, 241, 0.6)">
            <animateTransform attributeName="transform" type="translate" from="-90 0" to="85 0" dur="10s" repeatCount="indefinite" />
          </use>
          <use href="#gentle-wave" x="48" y="5" fill="rgba(99, 102, 241, 0.2)">
            <animateTransform attributeName="transform" type="translate" from="-90 0" to="85 0" dur="20s" repeatCount="indefinite" />
          </use>
        </g>
      </svg>
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
    <div className="flex items-center justify-center space-x-6 mb-10 select-none">
      {steps.map((s, i) => {
        const isActive = currentStep === s.id;
        const isPast = steps.findIndex(step => step.id === currentStep) > i;

        return (
          <div key={s.id} className="flex items-center group">
            <div className={`relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-500 ${
              isActive
                ? 'bg-indigo-600 text-white ring-8 ring-indigo-100 shadow-lg scale-110'
                : isPast
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-slate-50 text-slate-300'
            }`}>
              {isPast ? '✓' : i + 1}
              {isActive && (
                <div className="absolute -inset-1 rounded-full border-2 border-indigo-600/20 animate-ping" />
              )}
            </div>
            <span className={`ml-3 hidden md:block text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
              isActive ? 'text-indigo-600' : 'text-slate-400'
            }`}>
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div className={`ml-6 h-0.5 w-8 rounded-full transition-all duration-500 ${
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

  const containerClasses = "relative min-h-[640px] flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-white p-6 shadow-card hover:shadow-cardHover sm:p-12 transition-all duration-700 perspective-1000 transform-gpu";
  const innerCardClasses = "relative z-10 w-full animate-entrance";

  if (step === 'submitting') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <section className={containerClasses}>
          <div className="flex flex-col items-center justify-center flex-1 space-y-8 animate-entrance">
            <div className="relative">
               <div className="absolute inset-0 bg-indigo-600/10 rounded-full blur-2xl animate-pulse" />
               <div className="h-20 w-20 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600 shadow-glow" />
            </div>
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold text-slate-900">Creating Your Profile</h2>
              <p className="text-slate-500 font-medium italic">Finding the perfect words for your personality...</p>
            </div>
          </div>
          <WaveAnimation />
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <StepIndicator currentStep={step} />

      <section className={containerClasses}>
        <div className={innerCardClasses} key={step + (step === 'assessment' ? currentQuestion : '')}>
          {step === 'userData' && (
            <div className="space-y-8">
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">BFI-10 Assessment</h1>
                <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">A brief, scientifically validated measurement of your personality traits.</p>
              </div>

              <div className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="full-name" className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Full Name</label>
                    <input
                      id="full-name"
                      value={userData.name}
                      onChange={(e) => handleUserDataChange('name', e.target.value)}
                      placeholder="John Doe"
                      className="mc-input px-6 py-4 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="roll-number" className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Roll Number</label>
                    <input
                      id="roll-number"
                      value={userData.rollNumber}
                      onChange={(e) => handleUserDataChange('rollNumber', e.target.value)}
                      placeholder="CS12345"
                      className="mc-input px-6 py-4 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleUserDataChange('email', e.target.value)}
                      placeholder="john@university.edu"
                      className="mc-input px-6 py-4 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-widest">Phone (Optional)</label>
                    <input
                      id="phone"
                      value={userData.phone}
                      onChange={(e) => handleUserDataChange('phone', e.target.value)}
                      placeholder="+1 234 567 890"
                      className="mc-input px-6 py-4 text-base"
                    />
                  </div>
                </div>
                {error && <div className="rounded-2xl bg-red-50 p-5 text-sm font-semibold text-red-600 border border-red-100 animate-shake">{error}</div>}
              </div>
            </div>
          )}

          {step === 'consent' && (
            <div className="space-y-8">
              <WellnessBuddy />
              <div className="space-y-4 text-center md:text-left">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Privacy & Consent</h1>
                <div className="prose prose-slate text-slate-600 text-base leading-relaxed">
                  <p>Your data is precious. We use it for research and administrative purposes with the utmost care:</p>
                  <ul className="list-disc pl-5 space-y-2 mt-4 text-left inline-block">
                    <li>Secure storage & JWT protection</li>
                    <li>Strict confidentiality protocols</li>
                    <li>Right to data deletion at any time</li>
                  </ul>
                </div>
              </div>

              <label className="mt-8 flex items-start gap-5 rounded-3xl border-2 border-slate-100 p-8 cursor-pointer hover:bg-indigo-50/30 hover:border-indigo-100 transition-all mc-ripple bg-slate-50/30">
                <input
                  type="checkbox"
                  id="consent-checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-6 w-6 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                />
                <span className="text-sm md:text-base font-medium text-slate-700 leading-relaxed">
                  I understand and agree to the data collection policy for administrative tracking.
                </span>
              </label>
            </div>
          )}

          {step === 'assessment' && (
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Progress</p>
                    <p className="text-sm font-bold text-slate-400">Question {currentQuestion + 1} of {questions.length}</p>
                  </div>
                  <span className="text-2xl font-black text-indigo-600 opacity-20">{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="mc-progress h-4">
                  <div className="mc-progress__bar shadow-glow" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-2xl md:text-4xl font-bold text-slate-900 leading-[1.2] tracking-tight min-h-[4rem]">{questions[currentQuestion].prompt}</h2>
                <div className="grid gap-4">
                  {answerOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        const newAnswers = [...answers];
                        newAnswers[currentQuestion] = opt.value;
                        setAnswers(newAnswers);
                        if (currentQuestion < questions.length - 1) {
                          setTimeout(() => setCurrentQuestion(c => c + 1), 250);
                        }
                      }}
                      className={`group flex items-center justify-between rounded-[1.5rem] border-2 p-6 text-left transition-all mc-ripple ${
                        answers[currentQuestion] === opt.value
                          ? 'border-indigo-600 bg-indigo-50 transform scale-[1.03] shadow-glow z-20'
                          : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 active:scale-95'
                      }`}
                    >
                      <span className={`text-base md:text-lg font-bold transition-colors ${answers[currentQuestion] === opt.value ? 'text-indigo-700' : 'text-slate-600 group-hover:text-slate-900'}`}>
                        {opt.label}
                      </span>
                      <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        answers[currentQuestion] === opt.value ? 'border-indigo-600 bg-indigo-600 rotate-0 scale-110' : 'border-slate-200 group-hover:border-indigo-300 rotate-90'
                      }`}>
                        {answers[currentQuestion] === opt.value ? (
                          <div className="h-2.5 w-2.5 rounded-full bg-white shadow-inner" />
                        ) : (
                          <div className="h-1 w-1 rounded-full bg-slate-200" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative z-10 mt-12">
          {step === 'userData' && (
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <button
                onClick={handleProceedAnonymous}
                className="flex-1 rounded-full border-2 border-slate-200 py-4 px-8 font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all min-h-[56px] mc-ripple text-base"
              >
                Take Anonymously
              </button>
              <button
                onClick={handleProceedWithInfo}
                className="flex-1 mc-button mc-ripple min-h-[56px] text-base px-8 shadow-glow"
              >
                Continue to Consent
              </button>
            </div>
          )}

          {step === 'consent' && (
            <div className="flex flex-col gap-4 sm:flex-row">
              <button onClick={() => setStep('userData')} className="flex-1 rounded-full border-2 border-slate-200 py-4 px-8 font-bold text-slate-700 hover:bg-slate-50 transition-all min-h-[56px] text-base">Back</button>
              <button
                onClick={() => setStep('assessment')}
                disabled={!consent}
                className="flex-1 mc-button mc-ripple disabled:opacity-40 min-h-[56px] text-base shadow-glow"
              >
                I Agree & Start
              </button>
            </div>
          )}

          {step === 'assessment' && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(c => c - 1)}
                className="group flex items-center gap-2 text-sm md:text-base font-bold text-slate-400 hover:text-indigo-600 disabled:opacity-0 transition-all px-4 py-2"
              >
                <span className="transition-transform group-hover:-translate-x-1">←</span> Previous Question
              </button>
              {currentQuestion === questions.length - 1 && (
                <button
                  onClick={handleSubmitAssessment}
                  disabled={answers.some(a => a === null)}
                  className="mc-button mc-ripple min-h-[56px] px-12 text-base shadow-glow"
                >
                  Complete Assessment
                </button>
              )}
            </div>
          )}
        </div>
        <WaveAnimation />
      </section>
    </div>
  );
}
