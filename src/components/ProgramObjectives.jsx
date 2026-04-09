import { useState, useEffect, useRef, useCallback } from 'react';

const metrics = [
  {
    id: 'accuracy',
    percentage: 92,
    label: 'Assessment Accuracy',
    description: 'Validated through clinical studies',
    isPrimary: true,
  },
  {
    id: 'completion',
    percentage: 85,
    label: 'User Completion Rate',
    description: 'Students completing full assessments',
    isPrimary: false,
  },
  {
    id: 'satisfaction',
    percentage: 78,
    label: 'User Satisfaction',
    description: 'Based on post-assessment surveys',
    isPrimary: false,
  },
];

function RadialProgress({ percentage, label, description, isPrimary, isAnimating, index }) {
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const size = isPrimary ? 190 : 180;
  const strokeWidth = isPrimary ? 14 : 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  
  const fontSize = isPrimary ? 20 : 18;
  const labelFontSize = isPrimary ? 20 : 18;
  
  useEffect(() => {
    if (isAnimating) {
      const delay = index * 200;
      const duration = 2000;
      const startTime = Date.now() + delay;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed < 0) {
          requestAnimationFrame(animate);
          return;
        }
        
        const progressCalc = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progressCalc, 3);
        const bounceEase = progressCalc < 0.7 
          ? easeOut 
          : easeOut + Math.sin(progressCalc * Math.PI) * 0.1 * (1 - progressCalc);
        
        setProgress(bounceEase * percentage);
        
        if (progressCalc < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setProgress(0);
    }
  }, [isAnimating, percentage, index]);

  const gradientId = `gradient-${index}`;
  
  return (
    <div 
      className="flex flex-col items-center"
      style={{ opacity: isPrimary ? 1 : 0.9 }}
    >
      <div 
        className="relative cursor-pointer transition-all duration-300 ease-in-out"
        style={{
          transform: isHovered ? 'scale(1.05)' : isPressed ? 'scale(0.98)' : 'scale(1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onFocus={(e) => e.currentTarget?.classList.add('ring-2')}
        onBlur={(e) => e.currentTarget?.classList.remove('ring-2')}
        tabIndex={0}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${Math.round(progress)}%`}
      >
        <svg 
          width={size} 
          height={size} 
          className="transition-shadow duration-300"
          style={{
            filter: isHovered ? 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))',
            ...(isPrimary && isAnimating ? { filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.3))' } : {}),
          }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isPrimary ? '#6366f1' : '#818cf8'} />
              <stop offset="100%" stopColor={isPrimary ? '#9333ea' : '#a78bfa'} />
            </linearGradient>
          </defs>
          
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{
              transition: 'stroke-dashoffset 0.1s ease-out',
            }}
          />
        </svg>
        
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ pointerEvents: 'none' }}
        >
          <span 
            className="font-semibold"
            style={{ 
              fontSize: `${fontSize}px`,
              color: '#1f2937',
            }}
          >
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      
      <p 
        className="mt-4 font-semibold text-center"
        style={{ 
          fontSize: `${labelFontSize}px`,
          color: '#1f2937',
        }}
      >
        {label}
      </p>
      <p 
        className="mt-1 text-sm text-center"
        style={{ color: '#6b7280' }}
      >
        {description}
      </p>
      
      <div 
        className="mt-4 w-full max-w-[200px] h-2 rounded-full overflow-hidden"
        style={{ background: '#f3f4f6' }}
      >
        <div 
          className="h-full rounded-full transition-all duration-[2000ms] ease-out"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${isPrimary ? '#6366f1' : '#818cf8'} 0%, ${isPrimary ? '#9333ea' : '#a78bfa'} 100%)`,
          }}
        />
      </div>
    </div>
  );
}

export default function ProgramObjectives() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.5,
      }
    );

    if (sectionRef.current) {
      observerRef.current.observe(sectionRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-10 px-8"
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '40px' }}>
          {metrics.map((metric, index) => (
            <RadialProgress
              key={metric.id}
              percentage={metric.percentage}
              label={metric.label}
              description={metric.description}
              isPrimary={metric.isPrimary}
              isAnimating={isVisible}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}