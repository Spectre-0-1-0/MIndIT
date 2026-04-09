import { useEffect, useRef, useState } from 'react';

const LinkIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" />
    <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
    <line x1="8" y1="16" x2="16" y2="8" />
  </svg>
);

const ChatIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const HeartIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.5l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);

const ExternalLinkIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const steps = [
  { id: 1, title: 'Connect', Icon: LinkIcon },
  { id: 2, title: 'Chat', Icon: ChatIcon },
  { id: 3, title: 'Heal', Icon: HeartIcon },
];

const YourDOSTIntegration = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(null);

  useEffect(() => {
    if (!sectionRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: [0.5] }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return undefined;

    const animate = window.setTimeout(() => setProgress(100), 100);
    return () => window.clearTimeout(animate);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className="mx-auto w-full max-w-6xl rounded-[20px] bg-white px-6 py-8 shadow-sm sm:px-8 lg:px-10"
    >
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">
          YourDOST Integration
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Premium mental wellness support, step by step.
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600">
          MindCheck now brings YourDOST care into your flow with a guided connection system designed for fast access, meaningful conversations, and lasting recovery.
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center gap-6">
        <div className="relative w-full">
          <div className="pointer-events-none absolute left-5 right-5 top-1/2 hidden h-1 -translate-y-1/2 rounded-full bg-emerald-100 lg:block" />
          <div
            className="pointer-events-none absolute left-5 top-1/2 hidden h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-[1500ms] ease-out lg:block"
            style={{ width: `${progress}%` }}
          />

          <div className="pointer-events-none absolute left-1/2 top-24 bottom-24 hidden w-1 -translate-x-1/2 rounded-full bg-emerald-100 lg:hidden" />
          <div
            className="pointer-events-none absolute left-1/2 top-24 hidden w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-500 transition-all duration-[1500ms] ease-out lg:hidden"
            style={{ height: `${progress}%` }}
          />

          <div className="grid w-full gap-y-8 md:grid-cols-3 md:gap-x-[40px] lg:gap-x-[60px]">
            {steps.map((step, index) => {
              const StepIcon = step.Icon;
              const isActive = activeStep === step.id;

              return (
                <div
                  key={step.title}
                  onMouseEnter={() => setActiveStep(step.id)}
                  onMouseLeave={() => setActiveStep(null)}
                  className={`group relative z-10 flex flex-col items-center gap-4 rounded-[12px] border border-emerald-100 bg-white p-6 text-center shadow-sm transition duration-300 ease-in-out hover:scale-105 hover:shadow-md hover:ring-2 hover:ring-emerald-300 ${
                    isVisible ? 'animate-fade-in' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 shadow-sm transition duration-200 ease-in-out">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <StepIcon
                        className={`h-6 w-6 text-emerald-600 transition duration-200 ease-in-out ${
                          isActive ? 'scale-110 rotate-[5deg] text-emerald-700' : 'group-hover:scale-110 group-hover:rotate-[5deg] group-hover:text-emerald-700'
                        }`}
                      />
                      <span className="text-sm font-bold text-slate-900">{step.id}</span>
                    </div>
                  </div>
                  <span className="text-base font-semibold text-emerald-800">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        <a
          href="https://yourdost.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-[8px] bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition duration-250 ease-in-out hover:scale-[1.03] hover:bg-gradient-to-r hover:from-emerald-600 hover:to-emerald-700 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500 active:scale-[0.98] active:shadow-inner"
        >
          <ExternalLinkIcon className="mr-2 h-4 w-4" />
          Explore YourDOST Support
        </a>
      </div>
    </section>
  );
};

export default YourDOSTIntegration;
