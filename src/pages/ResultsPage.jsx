import { useLocation, useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';

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
    default:
      return 'Assessment';
  }
}

function getDefaultInterpretation(result) {
  const { assessmentId, score, interpretation } = result;

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
      return (
        <p className="text-slate-700 leading-7">
          Your PSS-10 score reflects how much stress you have perceived in the last month. Use this score to identify moments when self-care, rest, or support may help you feel more in control.
        </p>
      );
    case 'rses':
      return (
        <p className="text-slate-700 leading-7">
          The Rosenberg Self-Esteem Scale measures your overall self-regard. Higher scores suggest greater confidence and self-worth, while lower scores indicate areas where compassion and self-support may help.
        </p>
      );
    case 'bdi2':
      return (
        <p className="text-slate-700 leading-7">
          The BDI-II is a screening tool for depressive symptoms. A higher score may indicate the need for further professional assessment and support, especially if symptoms interfere with daily life.
        </p>
      );
    case 'bai':
      return (
        <p className="text-slate-700 leading-7">
          The Beck Anxiety Inventory tracks common anxiety symptoms. A higher score suggests more significant anxiety, and it may be helpful to explore calming strategies or professional guidance.
        </p>
      );
    case 'ghq12':
      return (
        <p className="text-slate-700 leading-7">
          GHQ-12 is a screening measure of current mental distress. It is useful for spotting how you are feeling now, but it is not a substitute for a clinical evaluation.
        </p>
      );
    case 'flourishing-scale':
      return (
        <p className="text-slate-700 leading-7">
          The Flourishing Scale measures your sense of purpose, relationships, and psychological well-being. Use this insight to celebrate strengths and identify areas to nurture.
        </p>
      );
    case 'digital-stress-scale':
    case 'digitalStress':
      return (
        <p className="text-slate-700 leading-7">
          The Digital Stress Scale evaluates how online life affects your stress. Consider adjusting habits and boundaries if your result suggests moderate or high digital strain.
        </p>
      );
    default:
      return (
        <p className="text-slate-700 leading-7">
          This result is provided for informational purposes only. Use it to reflect on your mental wellness and consider supportive next steps.
        </p>
      );
  }
}

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;
  const assessmentTitle = result ? getDisplayTitle(result) : 'Assessment Results';
  const interpretation = result ? getDefaultInterpretation(result) : null;

  const handlePrint = () => {
    window.print();
  };

  const handleRetake = () => {
    navigate('/');
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
              <div className="mt-4 space-y-4">{getDetailText(result)}</div>
            </section>

            <section className="rounded-[1.5rem] bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Important disclaimer</h2>
              <p className="mt-4 text-slate-700 leading-7">
                This assessment is not a diagnosis. It is a screening tool designed to help you reflect on your current state. If you have concerns about your mental health, please seek professional support.
              </p>
              {result.assessmentId === 'bdi2' && result.score > 28 ? (
                <div className="mt-4 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-rose-900">
                  <p className="font-semibold">Urgent note:</p>
                  <p className="mt-2">
                    Your responses indicate some level of suicidal thinking. Please contact a qualified mental health professional or crisis service immediately.
                  </p>
                </div>
              ) : null}
            </section>

            <section className="rounded-[1.5rem] bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Support resources</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="font-semibold text-slate-900">Student helpline</p>
                  <p className="mt-2 text-slate-600">Call <span className="font-semibold">1800-123-456</span> for confidential student support.</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="font-semibold text-slate-900">Mental health support</p>
                  <p className="mt-2 text-slate-600">Text <span className="font-semibold">SUPPORT</span> to <span className="font-semibold">80000</span> or visit your campus counselor.</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="font-semibold text-slate-900">Emergency services</p>
                  <p className="mt-2 text-slate-600">If you are in immediate danger, call <span className="font-semibold">911</span> or your local emergency number.</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="font-semibold text-slate-900">Trusted friend</p>
                  <p className="mt-2 text-slate-600">Share this result with someone you trust and ask for support if you feel overwhelmed.</p>
                </div>
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
