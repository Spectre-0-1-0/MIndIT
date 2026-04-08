import { useEffect, useState } from 'react';
import AssessmentCard from '../components/AssessmentCard';
import Logo from '../components/Logo';

const assessments = [
  {
    id: 'ghq12',
    title: 'GHQ-12',
    description: 'A short screening for current emotional distress and coping.',
    time: '8',
    icon: '🧠',
  },
  {
    id: 'flourishing-scale',
    title: 'Flourishing Scale',
    description: 'Assess your sense of purpose, relationships, and positive functioning.',
    time: '7',
    icon: '🌱',
  },
  {
    id: 'digital-stress-scale',
    title: 'Digital Stress Scale',
    description: 'Explore how digital life and device use affect your stress levels.',
    time: '6',
    icon: '📱',
  },
  {
    id: 'pss10',
    title: 'PSS-10',
    description: 'Measure how much stress you have felt over the last month.',
    time: '10',
    icon: '⚖️',
  },
  {
    id: 'rses',
    title: 'RSES',
    description: 'Evaluate your self-esteem and inner resilience quietly and privately.',
    time: '5',
    icon: '💪',
  },
  {
    id: 'bdi2',
    title: 'BDI-II',
    description: 'A self-rating scale for depressive symptoms and mood awareness.',
    time: '9',
    icon: '💭',
  },
  {
    id: 'bai',
    title: 'BAI',
    description: 'Check your current anxiety symptoms with a brief questionnaire.',
    time: '8',
    icon: '🌊',
  },
];

function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 bg-gradient-to-r from-brand-500/20 to-brandPurple-500/20 rounded-full animate-float-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${4 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll('.assessment-card');
    cards.forEach((card) => observer.observe(card));

    // Stagger animation for cards
    const timer = setTimeout(() => {
      setVisibleCards(Array.from({ length: assessments.length }, (_, i) => i));
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="space-y-16">
      <section className="relative rounded-[3rem] bg-gradient-to-br from-indigo-50 via-violet-50 to-white px-6 py-20 text-center shadow-2xl overflow-hidden">
        <FloatingParticles />
        <div className="relative z-10 mx-auto max-w-4xl space-y-8">
          <div className="flex justify-center">
            <Logo
              variant="hero"
              alt="MindCheck - Mental Health Assessment Platform"
              title="Welcome to MindCheck"
              className="animate-fade-in"
            />
          </div>
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600 animate-slide-down">
              Student Mental Health Assessment
            </p>
            <h1 className="text-5xl font-semibold leading-tight text-slate-900 sm:text-6xl animate-fade-in animation-delay-200">
              Your mental wellness
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                journey starts here
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-8 text-slate-600 animate-slide-up animation-delay-400">
              Confidential self-assessment tools for students who want to reflect on wellness without login, tracking, or data storage.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-slide-up animation-delay-600">
            <button className="mc-button mc-ripple">
              Start Your Assessment
            </button>
            <button className="inline-flex items-center justify-center rounded-full border-2 border-indigo-200 bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition duration-150 ease-soft hover:bg-indigo-50 hover:border-indigo-300 mc-ripple">
              Learn More
            </button>
          </div>
        </div>

        {/* Animated geometric shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full animate-float-particle animation-delay-1000" />
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg rotate-45 animate-float-particle animation-delay-1500" />
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-br from-indigo-500/15 to-violet-500/15 rounded-full animate-pulse-glow" />
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
              Available Assessments
            </p>
            <h2 className="mt-3 text-4xl font-semibold text-slate-900 sm:text-5xl">
              Choose your path to
              <span className="block text-indigo-600">better understanding</span>
            </h2>
          </div>
          <p className="max-w-xl text-lg leading-7 text-slate-600">
            Select any assessment below to begin a short, private reflection exercise designed for student mental health awareness.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-3">
          {assessments.map(({ id, title, description, time, icon }, index) => (
            <div
              key={id}
              className={`assessment-card opacity-0 ${visibleCards.includes(index) ? 'animate-stagger-fade' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <AssessmentCard
                id={id}
                title={title}
                description={description}
                time={time}
                icon={icon}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[3rem] bg-gradient-to-br from-indigo-50 via-purple-50 to-white p-8 shadow-xl sm:p-12">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="text-center space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">
              About MindCheck
            </p>
            <h2 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
              Built for privacy, clarity, and
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                student well-being
              </span>
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6 text-lg leading-8 text-slate-700">
              <p>
                MindCheck is a privacy-first platform that helps students reflect on their mental health. All assessments are self-guided and designed to support awareness without requiring authentication or data storage.
              </p>
              <p>
                Your responses stay in your browser session only. We do not save, share, or track your answers, so you can explore your emotional wellness with confidence and calm.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="mc-badge-glow">Privacy First</span>
                <span className="mc-badge-glow">No Data Storage</span>
                <span className="mc-badge-glow">Student Focused</span>
              </div>
            </div>

            <div className="mc-glass-panel p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl text-white shadow-lg">
                    🛡️
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">Your Privacy Matters</h3>
                    <p className="text-slate-600">All data stays local to your device</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-2xl text-white shadow-lg">
                    🌟
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">Evidence-Based</h3>
                    <p className="text-slate-600">Clinically validated assessment tools</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 text-2xl text-white shadow-lg">
                    🤝
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">Support Resources</h3>
                    <p className="text-slate-600">Connected to campus wellness services</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
