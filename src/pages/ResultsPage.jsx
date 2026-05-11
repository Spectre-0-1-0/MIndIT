import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const UDAAN_EMAIL = 'UDAAN_DOSL_BLR@GITAM.EDU';

function constructUdaanMailto(result, assessmentTitle, interpretation) {
  const userName = result?.userName || result?.name || 'Anonymous User';
  const score = result?.score ?? 'N/A';
  
  const bodyTemplate = `You dont have to edit anything udaan team will reach out to you. Just hit Send

Hello,

This is "${userName}", i had a score of "${score}", on the assessment "${assessmentTitle}"

I am looking for counselling sessions.`;
  
  const subject = 'Hello UDAAN';
  
  const mailtoUrl = `mailto:${UDAAN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyTemplate)}`;
  
  return mailtoUrl;
}

function getDisplayTitle(result) {
  if (result.title) return result.title;
  switch (result.assessmentId) {
    case 'ghq12':
      return 'GHQ-12';
    case 'flourishing-scale':
      return 'Flourishing Scale';
    case 'digital-stress-scale':
    case 'digitalStress':
      return 'Digital Stress Scale';
    case 'pss10':
      return 'PSS-10';
    case 'rses':
      return 'RSES';
    case 'bdi2':
      return 'BDI-II';
    case 'bai':
      return 'BAI';
    case 'bfi10':
      return 'BFI-10 Personality Profile';
    default:
      return 'Assessment';
  }
}

function getDefaultInterpretation(result) {
  const { assessmentId, score, interpretation } = result;

  if (assessmentId === 'bfi10') {
    return {
      title: 'BFI-10 Personality Profile',
      description: 'Your Big Five trait scores are shown below with interpretation for each trait.',
      details: [],
    };
  }

  // If we have a structured interpretation from scoring.js, use it
  if (interpretation && typeof interpretation === 'object') {
    return interpretation;
  }

  // Fallback to old logic for backward compatibility
  if (assessmentId === 'pss10') {
    if (score <= 13) return { title: 'Low Stress', description: 'Below average perceived stress.', details: [] };
    if (score <= 26) return { title: 'Moderate Stress', description: 'Average range.', details: [] };
    return { title: 'High Stress', description: 'Elevated perceived stress.', details: [] };
  }
  if (assessmentId === 'rses') {
    if (score >= 26) return { title: 'High Self-Esteem', description: 'Strong, positive perception.', details: [] };
    if (score >= 15) return { title: 'Normal Self-Esteem', description: 'Average range.', details: [] };
    return { title: 'Low Self-Esteem', description: 'Negative self-evaluation.', details: [] };
  }
  if (assessmentId === 'bdi2') {
    if (score <= 13) return { title: 'Minimal Symptoms', description: 'Minimal depressive symptoms.', details: [] };
    if (score <= 19) return { title: 'Mild Symptoms', description: 'Mild depressive symptoms.', details: [] };
    if (score <= 28) return { title: 'Moderate Symptoms', description: 'Moderate depressive symptoms.', details: [] };
    return { title: 'Severe Symptoms', description: 'Severe depressive symptoms.', details: [] };
  }
  if (assessmentId === 'bai') {
    if (score <= 7) return { title: 'Minimal Anxiety', description: 'Minimal anxiety.', details: [] };
    if (score <= 15) return { title: 'Mild Anxiety', description: 'Mild anxiety.', details: [] };
    if (score <= 25) return { title: 'Moderate Anxiety', description: 'Moderate anxiety.', details: [] };
    return { title: 'Severe Anxiety', description: 'Severe anxiety.', details: [] };
  }
  if (assessmentId === 'ghq12') {
    if (score <= 11) return { title: 'Below threshold', description: 'No significant psychiatric morbidity indicated.', details: [] };
    return { title: 'Possible psychiatric morbidity', description: 'Further assessment may be recommended.', details: [] };
  }
  if (assessmentId === 'flourishing-scale') {
    if (score >= 42) return { title: 'Flourishing', description: 'Flourishing.', details: [] };
    if (score >= 30) return { title: 'Moderate Well-being', description: 'Moderate well-being.', details: [] };
    return { title: 'Needs Support', description: 'Needs support.', details: [] };
  }
  if (assessmentId === 'digital-stress-scale' || assessmentId === 'digitalStress') {
    if (score <= 2) return { title: 'Low Digital Stress', description: 'You are experiencing relatively low digital stress.', details: [] };
    if (score <= 3.5) return { title: 'Moderate Digital Stress', description: 'You are noticing some digital stress, and it may help to build stronger boundaries.', details: [] };
    return { title: 'High Digital Stress', description: 'Digital life may be contributing significantly to your stress.', details: [] };
  }
  return { title: 'Assessment Complete', description: 'No detailed interpretation available.', details: [] };
}

function getDetailText(result) {
  const { assessmentId, score } = result;
  switch (assessmentId) {
    case 'pss10':
      return 'Your PSS-10 score reflects how much stress you have perceived in the last month. Use this score to identify moments when self-care, rest, or support may help you feel more in control.';
    case 'rses':
      return 'The Rosenberg Self-Esteem Scale measures your overall self-regard. Higher scores suggest greater confidence and self-worth, while lower scores indicate areas where compassion and self-support may help.';
    case 'bdi2':
      return 'The BDI-II is a screening tool for depressive symptoms. A higher score may indicate the need for further professional assessment and support, especially if symptoms interfere with daily life.';
    case 'bai':
      return 'The Beck Anxiety Inventory tracks common anxiety symptoms. A higher score suggests more significant anxiety, and it may be helpful to explore calming strategies or professional guidance.';
    case 'ghq12':
      return 'GHQ-12 is a screening measure of current mental distress. It is useful for spotting how you are feeling now, but it is not a substitute for a clinical evaluation.';
    case 'flourishing-scale':
      return 'The Flourishing Scale measures your sense of purpose, relationships, and psychological well-being. Use this insight to celebrate strengths and identify areas to nurture.';
    case 'digital-stress-scale':
    case 'digitalStress':
      return 'The Digital Stress Scale evaluates how online life affects your stress. Consider adjusting habits and boundaries if your result suggests moderate or high digital strain.';
    case 'bfi10':
      return 'The BFI-10 assesses your Big Five personality traits. Each score reflects an average of two items and can help you understand your characteristic tendencies.';
    default:
      return 'This result is provided for informational purposes only. Use it to reflect on your mental wellness and consider supportive next steps.';
  }
}

function generateEmailContent(result, assessmentTitle, interpretation) {
  const subject = `Your MindCheck Assessment Results - ${assessmentTitle}`;

  const body = `
Your MindCheck Assessment Results
================================

Assessment: ${assessmentTitle}

Your Results: ${interpretation?.title || 'Assessment Complete'}
${interpretation?.description || 'Your assessment has been completed.'}

${interpretation?.details && interpretation.details.length > 0 ?
  `Key Points:
${interpretation.details.map(point => `• ${point}`).join('\n')}

` : ''}About This Assessment:
${getDetailText(result)}

Support Resources:
• Student Helpline: Call 1800-123-456 for confidential student support
• Mental Health Support: Text SUPPORT to 80000 or visit your campus counselor
• Emergency Services: If you are in immediate danger, call 911 or your local emergency number
• Trusted Friend: Share this result with someone you trust and ask for support if you feel overwhelmed

Important Disclaimer:
This assessment is not a diagnosis. It is a screening tool designed to help you reflect on your current state. If you have concerns about your mental health, please seek professional support.

Privacy Statement:
Your assessment data was processed entirely in your browser and was not stored on our servers. This email was generated client-side for your convenience.

---
MindCheck - Supporting Student Mental Wellness
`.trim();

  return { subject, body };
}

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const assessmentTitle = result ? getDisplayTitle(result) : 'Assessment Results';
  const interpretation = result ? getDefaultInterpretation(result) : null;
  const emailContent = result ? generateEmailContent(result, assessmentTitle, interpretation) : null;
  const [udaanError, setUdaanError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleRetake = () => {
    navigate('/');
  };

  const handleSendToUdaan = () => {
    try {
      const mailtoUrl = constructUdaanMailto(result, assessmentTitle, interpretation);
      window.location.href = mailtoUrl;
    } catch (err) {
      setUdaanError('Unable to open email client. Please try again or email UDAAN_DOSL_BLR@GITAM.EDU directly.');
    }
  };

  return (
    <section className="space-y-10 rounded-[2rem] bg-slate-50 p-6 sm:p-10">
      <div className="mx-auto max-w-6xl space-y-6 rounded-[2rem] bg-white p-8 shadow-xl">
        <header className="space-y-3">
          <div className="flex justify-center">
            <Logo
              variant="results"
              alt="MindCheck Assessment Results"
              title="Your assessment results"
            />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">Results</p>
          <h1 className="text-3xl font-semibold text-slate-900">{assessmentTitle}</h1>
          <p className="max-w-2xl text-slate-600">
            This page summarizes your assessment result and offers guidance. It is intended for informational use only.
          </p>
        </header>

        {!result ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-lg font-medium text-slate-900">No results available</p>
            <p className="mt-2 text-slate-600">Please complete an assessment first to view your personalized feedback.</p>
            <button
              onClick={handleRetake}
              className="mt-6 inline-flex rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Take an Assessment
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <section className="rounded-[1.5rem] bg-indigo-50 p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-700">Result summary</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{interpretation?.title || 'Assessment Complete'}</p>
                </div>
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-500">What this means</p>
                  <p className="mt-2 text-slate-700">{interpretation?.description || 'Your assessment result has been recorded.'}</p>
                </div>
              </div>
            </section>

            <section className="rounded-[1.5rem] bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">What this means</h2>
              <div className="mt-4 space-y-4">
                <p className="text-slate-700 leading-7">{interpretation?.description || 'Your assessment has been completed.'}</p>
                {interpretation?.details && interpretation.details.length > 0 && (
                  <ul className="space-y-2">
                    {interpretation.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-600">
                        <span className="mt-1 text-indigo-600">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <section className="rounded-[1.5rem] bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">About this assessment</h2>
              <div className="mt-4 space-y-4">
                <p className="text-slate-700 leading-7">{getDetailText(result)}</p>
              </div>
            </section>

            {result.assessmentId === 'bfi10' && result.oceanScores && result.interpretation && (
              <section className="rounded-[1.5rem] bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Your BFI-10 Trait Scores</h2>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {Object.entries(result.oceanScores).map(([trait, score]) => {
                    const traitInfo = result.interpretation[trait] || {};
                    const labelMap = {
                      openness: 'Openness',
                      conscientiousness: 'Conscientiousness',
                      extraversion: 'Extraversion',
                      agreeableness: 'Agreeableness',
                      neuroticism: 'Neuroticism',
                    };
                    return (
                      <div key={trait} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">{labelMap[trait] || trait}</h3>
                            <p className="text-sm text-slate-500">{traitInfo.level || 'Trait score'}</p>
                          </div>
                          <span className="rounded-full bg-indigo-600 px-3 py-1 text-sm font-semibold text-white">{score.toFixed(2)}/5</span>
                        </div>
                        <div className="mt-4 h-3 w-full rounded-full bg-slate-200 overflow-hidden">
                          <div className="h-full bg-indigo-600" style={{ width: `${(score / 5) * 100}%` }} />
                        </div>
                        <p className="mt-4 text-slate-700 leading-relaxed">{traitInfo.description || 'No interpretation available.'}</p>
                        {traitInfo.details && traitInfo.details.length > 0 && (
                          <ul className="mt-4 space-y-2 text-slate-600">
                            {traitInfo.details.map((detail, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="mt-1 text-indigo-600">•</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <section className="rounded-[1.5rem] bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Important disclaimer</h2>
              <p className="mt-4 text-slate-700 leading-7">
                This assessment is not a diagnosis. It is a screening tool designed to help you reflect on your current state. If you have concerns about your mental health, please seek professional support.
              </p>
              <div className="mt-4 rounded-3xl bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  <strong>Privacy & Data Protection:</strong> Your assessment responses and results are processed entirely in your browser and are never stored on our servers. We prioritize your privacy and do not collect, store, or share any personal assessment data.
                </p>
              </div>
              {result.assessmentId === 'bdi2' && result.score > 28 ? (
                <div className="mt-4 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-900">
                  <p className="font-semibold">Urgent note:</p>
                  <p className="mt-2">
                    Your responses indicate some level of suicidal thinking. Please contact a qualified mental health professional or crisis service immediately.
                  </p>
                </div>
              ) : null}
            </section>

            <section className="rounded-[1.5rem] bg-indigo-50 p-8">
              <h2 className="text-2xl font-semibold text-slate-900">Send Results to UDAAN</h2>
              <p className="mt-2 text-slate-600">
                Send your results to UDAAN team. No editing required - just press Send
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleSendToUdaan}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Send Results to UDAAN
                </button>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                This will open your email client with your assessment results pre-filled. The UDAAN team will reach out to you.
              </p>
              {udaanError && (
                <p className="mt-4 text-sm text-rose-600">
                  {udaanError}
                </p>
              )}
            </section>

            <section className="rounded-[1.5rem] bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Reach Out to Us</h2>
              <p className="mt-2 text-slate-600">
                Have questions about your results or need support? This optional form allows you to contact us directly. Your responses are handled by Google Forms and are not stored on our servers.
              </p>
              <div className="mt-6">
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLScrycIDO1HT5ouCYTMjFt-1kFbKgj9o5GCItyFTejJrmYohHw/viewform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Open Contact Form
                </a>
              </div>
              <div className="mt-4 rounded-3xl bg-amber-50 p-4">
                <p className="text-sm text-amber-800">
                  <strong>Privacy Notice:</strong> This form is powered by Google Forms. Google has its own privacy policy regarding data collection and processing. We do not receive or store any information submitted through this form. Your assessment data remains private and is not shared.
                </p>
              </div>
            </section>

            <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleRetake}
                className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Take Another Assessment
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Print Results
              </button>
            </section>
          </div>
        )}
      </div>
    </section>
  );
}
