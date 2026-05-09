import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateBFI10Score, interpretBFI10 } from '../../data/scoring';

const bfi10Questions = [
  {
    text: 'I am reserved.',
    trait: 'Extraversion',
    reverse: true,
  },
  {
    text: 'I am generally trusting.',
    trait: 'Agreeableness',
    reverse: false,
  },
  {
    text: 'I tend to be disorganized.',
    trait: 'Conscientiousness',
    reverse: true,
  },
  {
    text: 'I am depressed, blue.',
    trait: 'Neuroticism',
    reverse: false,
  },
  {
    text: 'I am original, come up with new ideas.',
    trait: 'Openness',
    reverse: false,
  },
  {
    text: 'I am reserved.',
    trait: 'Extraversion',
    reverse: true,
  },
  {
    text: 'I am considerate and kind to almost everyone.',
    trait: 'Agreeableness',
    reverse: false,
  },
  {
    text: 'I do a thorough job.',
    trait: 'Conscientiousness',
    reverse: false,
  },
  {
    text: 'I am worried, uneasy.',
    trait: 'Neuroticism',
    reverse: false,
  },
  {
    text: 'I am open to new experiences, complex.',
    trait: 'Openness',
    reverse: false,
  },
];

export default function BFI10() {
  // User Info State
  const [formStep, setFormStep] = useState('info'); // 'info', 'consent', 'assessment', 'submitting', 'results'
  const [anonymous, setAnonymous] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    rollNumber: '',
    email: '',
    phone: '',
    department: '',
    academicYear: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [consent, setConsent] = useState(false);
  const [answers, setAnswers] = useState(Array(bfi10Questions.length).fill(null));
  const [results, setResults] = useState(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => phone === '' || /^[0-9\s\-\+\(\)]{10,}$/.test(phone);

  const validateUserInfo = () => {
    const errors = {};
    if (!userInfo.fullName.trim()) errors.fullName = 'Full name is required';
    if (!userInfo.rollNumber.trim()) errors.rollNumber = 'Roll number/ID is required';
    if (!userInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(userInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (userInfo.phone && !validatePhone(userInfo.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    return errors;
  };

  const handleUserInfoChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value,
    }));
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleProceedAnonymous = () => {
    setAnonymous(true);
    setFormStep('consent');
  };

  const handleProceedWithInfo = () => {
    const errors = validateUserInfo();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormStep('consent');
  };

  const handleConsentAgree = () => {
    if (!consent) {
      alert('Please agree to the consent statement before proceeding.');
      return;
    }
    setFormStep('assessment');
  };

  const handleBackToInfo = () => {
    setFormStep('info');
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = Number(value);
    setAnswers(newAnswers);
  };

  const handleSubmitAssessment = async (e) => {
    e.preventDefault();
    if (answers.some(answer => answer === null)) {
      alert('Please answer all questions before submitting.');
      return;
    }

    // Show loading state
    setFormStep('submitting');

    try {
      const oxygenScores = calculateBFI10Score(answers);
      const interpretation = interpretBFI10(oxygenScores);

      const submissionData = {
        userID: sessionId,
        timestamp: new Date().toISOString(),
        anonymous,
        userInfo: anonymous ? null : userInfo,
        consentGiven: consent,
        responses: answers,
        oceanScores,
        interpretation,
      };

      // Send to backend API
      const response = await fetch('http://localhost:3001/api/bfi10-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to save submission');
      }

      const result = await response.json();
      console.log('Submission saved:', result);

      // Store locally for results display (fallback)
      setResults(submissionData);
      setFormStep('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('Failed to save your assessment. Please check your internet connection and try again.');
      setFormStep('assessment'); // Return to assessment step
    }
  };

  const handleDownloadResults = () => {
    const content = `
BFI-10 Assessment Results
${new Date(results.timestamp).toLocaleString()}

${!results.anonymous ? `
PERSONAL INFORMATION
Name: ${results.userInfo.fullName}
Roll Number: ${results.userInfo.rollNumber}
Email: ${results.userInfo.email}
${results.userInfo.phone ? `Phone: ${results.userInfo.phone}` : ''}
${results.userInfo.department ? `Department: ${results.userInfo.department}` : ''}
${results.userInfo.academicYear ? `Academic Year: ${results.userInfo.academicYear}` : ''}

PRIVACY CONFIRMATION
✅ Assessment recorded with personal information
✅ Consent provided for data collection and administrative tracking
` : `
ANONYMOUS SUBMISSION
🔒 Assessment recorded anonymously
🔒 No personal information collected
✅ Understanding confirmed for anonymous data collection
`}

OCEAN PERSONALITY TRAITS
Openness: ${results.oceanScores.openness.toFixed(2)} (Range: 1-5)
Conscientiousness: ${results.oceanScores.conscientiousness.toFixed(2)} (Range: 1-5)
Extraversion: ${results.oceanScores.extraversion.toFixed(2)} (Range: 1-5)
Agreeableness: ${results.oceanScores.agreeableness.toFixed(2)} (Range: 1-5)
Neuroticism: ${results.oceanScores.neuroticism.toFixed(2)} (Range: 1-5)

TRAIT INTERPRETATIONS
${Object.entries(results.interpretation).map(([trait, info]) => `
${trait.toUpperCase()}
Score: ${info.score.toFixed(2)}/5
Level: ${info.level}
Description: ${info.description}
`).join('\n')}

---
This assessment is for self-awareness purposes only and is not a clinical diagnosis.
    `;

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', `BFI10_Results_${new Date().getTime()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // STEP 1: USER INFORMATION FORM
  if (formStep === 'info') {
    return (
      <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <header className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-slate-900">BFI-10 Assessment</h1>
              <p className="text-slate-600">
                A brief personality assessment based on the Big Five model. Before starting, please provide your information for administrative tracking (or proceed anonymously).
              </p>
            </div>
            <button
              onClick={() => navigate('/bfi10-admin')}
              className="text-xs text-slate-500 hover:text-slate-700 underline ml-4 whitespace-nowrap"
            >
              Admin Access
            </button>
          </div>
        </header>

        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 space-y-2">
          <h2 className="font-semibold text-indigo-900">📋 Privacy Notice</h2>
          <p className="text-sm text-indigo-800">
            Your data will be securely stored and used only for administrative and research purposes. You have the option to complete this assessment anonymously without providing personal information.
          </p>
        </div>

        <form className="space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-900">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={userInfo.fullName}
              onChange={(e) => handleUserInfoChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              className={`w-full rounded-lg border px-4 py-2 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 ${
                formErrors.fullName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {formErrors.fullName && <p className="text-sm text-red-600">{formErrors.fullName}</p>}
          </div>

          {/* Roll Number */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-900">
              Roll Number/ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={userInfo.rollNumber}
              onChange={(e) => handleUserInfoChange('rollNumber', e.target.value)}
              placeholder="Enter your roll number or ID"
              className={`w-full rounded-lg border px-4 py-2 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 ${
                formErrors.rollNumber
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {formErrors.rollNumber && <p className="text-sm text-red-600">{formErrors.rollNumber}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-900">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) => handleUserInfoChange('email', e.target.value)}
              placeholder="Enter your email address"
              className={`w-full rounded-lg border px-4 py-2 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 ${
                formErrors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {formErrors.email && <p className="text-sm text-red-600">{formErrors.email}</p>}
          </div>

          {/* Phone (Optional) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-900">Phone Number (Optional)</label>
            <input
              type="tel"
              value={userInfo.phone}
              onChange={(e) => handleUserInfoChange('phone', e.target.value)}
              placeholder="Enter your phone number"
              className={`w-full rounded-lg border px-4 py-2 text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 ${
                formErrors.phone
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {formErrors.phone && <p className="text-sm text-red-600">{formErrors.phone}</p>}
          </div>

          {/* Department (Optional) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-900">Department/Course (Optional)</label>
            <input
              type="text"
              value={userInfo.department}
              onChange={(e) => handleUserInfoChange('department', e.target.value)}
              placeholder="e.g., Computer Science, Psychology"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Academic Year (Optional) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-900">Academic Year (Optional)</label>
            <input
              type="text"
              value={userInfo.academicYear}
              onChange={(e) => handleUserInfoChange('academicYear', e.target.value)}
              placeholder="e.g., 1st Year, 2024-2025"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={handleProceedWithInfo}
              className="flex-1 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Continue with Information
            </button>
            <button
              type="button"
              onClick={handleProceedAnonymous}
              className="flex-1 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              Proceed Anonymously
            </button>
          </div>
        </form>
      </section>
    );
  }

  // STEP 2: CONSENT AGREEMENT
  if (formStep === 'consent') {
    return (
      <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <header className="space-y-3">
          <h1 className="text-2xl font-semibold text-slate-900">Consent Agreement</h1>
          <p className="text-slate-600">Please read and agree to the following before proceeding with the assessment.</p>
        </header>

        {/* IDENTIFIED SUBMISSION MODE PRIVACY NOTICE */}
        {!anonymous && (
          <div className="space-y-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
            <h2 className="font-semibold text-indigo-900">📝 DATA COLLECTION & PRIVACY NOTICE</h2>
            <div className="space-y-3 text-sm text-indigo-800">
              <p>
                <strong>What we collect:</strong> We collect your survey responses along with your personal information (name, roll number, email, phone) for administrative tracking and research purposes.
              </p>
              <p>
                <strong>How we use it:</strong> Your data will be used solely for assessment analysis, administrative records, and research activities. Your information will not be shared with third parties.
              </p>
              <p>
                <strong>Data security:</strong> All data is stored securely and kept confidential. Personal information is encrypted and protected.
              </p>
              <p>
                <strong>Data retention:</strong> Assessment records will be retained for 2 years unless you request earlier deletion.
              </p>
              <p>
                <strong>Your rights:</strong> You can request deletion of your data at any time by contacting the administration.
              </p>
              <p>
                <strong>Disclaimer:</strong> This assessment is for self-awareness and educational purposes only. It is not a clinical diagnosis. Results should not replace professional mental health evaluation.
              </p>
            </div>
          </div>
        )}

        {/* ANONYMOUS SUBMISSION MODE PRIVACY NOTICE */}
        {anonymous && (
          <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="font-semibold text-amber-900">🔒 ANONYMOUS MODE PRIVACY NOTICE</h2>
            <div className="space-y-3 text-sm text-amber-800">
              <p>
                <strong>No personal data collection:</strong> In anonymous mode, we collect ONLY your survey responses. No personal information (name, roll number, email, phone) will be collected or stored.
              </p>
              <p>
                <strong>Data usage:</strong> Your anonymous responses will be used for aggregate analysis and research purposes only. No individual identification is possible.
              </p>
              <p>
                <strong>Data security:</strong> Even in anonymous mode, your responses are stored securely with appropriate protections.
              </p>
              <p>
                <strong>Data retention:</strong> Anonymous assessment records will be retained for research purposes for 2 years.
              </p>
              <p>
                <strong>Your rights:</strong> Since no personal information is collected, there is no personally identifiable data to delete. However, you can contact administration with concerns.
              </p>
              <p>
                <strong>Disclaimer:</strong> This assessment is for self-awareness and educational purposes only. It is not a clinical diagnosis. Results should not replace professional mental health evaluation.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-900">
              {!anonymous
                ? "I agree to have my assessment results recorded for administrative purposes and understand how my data will be used and protected."
                : "I understand that only my responses will be collected anonymously"
              }
            </span>
          </label>
        </div>

        {!anonymous && (
          <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-4">
            <p className="text-sm text-indigo-900">
              <strong>Your Information:</strong> {userInfo.fullName} ({userInfo.rollNumber}) - {userInfo.email}
            </p>
          </div>
        )}

        {anonymous && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm text-amber-900">
              🔒 <strong>Anonymous Mode:</strong> Your responses will not be linked to any personal information.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <button
            type="button"
            onClick={handleConsentAgree}
            disabled={!consent}
            className={`flex-1 rounded-full px-6 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              consent
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            {!anonymous ? 'I Agree & Continue' : 'I Understand & Continue'}
          </button>
          <button
            type="button"
            onClick={handleBackToInfo}
            className="flex-1 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            Back
          </button>
        </div>
      </section>
    );
  }

  // STEP 3: ASSESSMENT QUESTIONS
  if (formStep === 'assessment') {
    return (
      <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold text-slate-900">BFI-10 Assessment</h1>
          <p className="text-slate-600">
            Rate each statement on a scale from Strongly Disagree (1) to Strongly Agree (5).
          </p>
        </header>

        <form onSubmit={handleSubmitAssessment} className="space-y-5">
          {bfi10Questions.map((question, index) => (
            <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-medium text-slate-900">
                {index + 1}. {question.text} {question.reverse && <span className="text-xs text-amber-600">(reversed)</span>}
              </p>
              <p className="mt-1 text-xs text-slate-600">Trait: {question.trait}</p>
              <div className="mt-3 grid gap-3 grid-cols-5">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="inline-flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2 text-slate-700 shadow-sm transition hover:border-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={value}
                      checked={answers[index] === value}
                      onChange={() => handleAnswerChange(index, value)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                    />
                    <span className="text-xs font-medium">{value}</span>
                  </label>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>Strongly Disagree</span>
                <span>Strongly Agree</span>
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="inline-flex rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit Assessment
          </button>
        </form>
      </section>
    );
  }

  // STEP 3.5: SUBMITTING
  if (formStep === 'submitting') {
    return (
      <section className="space-y-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Submitting Your Assessment</h2>
          <p className="text-slate-600">Please wait while we save your responses...</p>
        </div>
      </section>
    );
  }

  // STEP 4: RESULTS
  if (formStep === 'results' && results) {
    return (
      <section className="space-y-6">
        {/* Results Header */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-indigo-700 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Your BFI-10 Results</h1>
          <p className="mt-2 text-indigo-100">Big Five Personality Assessment</p>
          <p className="mt-4 text-sm text-indigo-200">
            {new Date(results.timestamp).toLocaleDateString()} at{' '}
            {new Date(results.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          {results.anonymous && <p className="mt-2 text-sm text-indigo-200">🔒 Anonymous Submission</p>}
        </div>

        {/* OCEAN Scores */}
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">OCEAN Personality Traits</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(results.oceanScores).map(([trait, score]) => {
              const info = results.interpretation[trait];
              const percentage = (score / 5) * 100;

              return (
                <div key={trait} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 capitalize">
                      {trait === 'openness' && '🎨'}
                      {trait === 'conscientiousness' && '✓'}
                      {trait === 'extraversion' && '🎤'}
                      {trait === 'agreeableness' && '🤝'}
                      {trait === 'neuroticism' && '😰'} {trait.replace(/_/g, ' ')}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">{info.description}</p>
                  </div>

                  {/* Score Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700">{score.toFixed(2)}/5</span>
                      <span className="text-xs font-medium text-slate-600">{info.level}</span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trait Details */}
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Detailed Interpretations</h2>
          <div className="space-y-6">
            {Object.entries(results.interpretation).map(([trait, info]) => (
              <div key={trait} className="rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 capitalize mb-2">
                  {trait.replace(/_/g, ' ')}
                </h3>
                <p className="text-slate-700 mb-3">{info.description}</p>
                <ul className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <li key={idx} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-indigo-600">•</span> {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5">
          <p className="text-sm text-amber-900">
            <strong>⚠️ Disclaimer:</strong> This assessment is for self-awareness and educational purposes only. It is not a clinical diagnosis and should not be used as a substitute for professional mental health evaluation or advice.
          </p>
        </div>

        {/* Privacy Confirmation */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Privacy & Data Collection Confirmation</h2>

          {!results.anonymous ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-700">
                <span className="text-lg">✅</span>
                <span className="font-medium">Your assessment was recorded with personal information</span>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-2">
                <h3 className="font-medium text-slate-900">Collected Personal Information:</h3>
                <div className="grid gap-1 text-sm text-slate-700">
                  <div><strong>Name:</strong> {results.userInfo.fullName}</div>
                  <div><strong>Roll Number:</strong> {results.userInfo.rollNumber}</div>
                  <div><strong>Email:</strong> {results.userInfo.email}</div>
                  {results.userInfo.phone && <div><strong>Phone:</strong> {results.userInfo.phone}</div>}
                  {results.userInfo.department && <div><strong>Department:</strong> {results.userInfo.department}</div>}
                  {results.userInfo.academicYear && <div><strong>Academic Year:</strong> {results.userInfo.academicYear}</div>}
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-700">
                <span className="text-lg">✅</span>
                <span className="text-sm">You provided consent for data collection and administrative tracking</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-700">
                <span className="text-lg">🔒</span>
                <span className="font-medium">Your assessment was recorded anonymously</span>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <p className="text-sm text-slate-700">
                  <strong>No personal information was collected.</strong> Only your survey responses have been stored for research purposes.
                </p>
              </div>
              <div className="flex items-center gap-2 text-blue-700">
                <span className="text-lg">✅</span>
                <span className="text-sm">You confirmed understanding of anonymous data collection</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleDownloadResults}
            className="flex-1 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            📥 Download Results
          </button>
          <button
            onClick={handleBackToHome}
            className="flex-1 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            Back to Home
          </button>
        </div>
      </section>
    );
  }

  return null;
}
