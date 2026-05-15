import { Link } from 'react-router-dom';

export default function AssessmentCard({ id, title, description, time, icon }) {
  return (
    <Link
      to={`/assessment/${id}`}
      className="mc-card asmr-hover group block cursor-pointer overflow-hidden"
      role="button"
      tabIndex={0}
    >
      <div className="p-4 md:p-8">
        <div className="flex items-start justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl md:text-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors duration-200">
                {title}
              </h3>
              <p className="text-sm text-slate-500 mt-1">{time} minutes</p>
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <p className="text-sm md:text-base text-slate-600 leading-6 md:leading-7 mb-4 md:mb-6 group-hover:text-slate-700 transition-colors duration-200">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <span className="mc-badge">Self-guided</span>
          <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700 transition-colors">
            Start now →
          </span>
        </div>
      </div>

      {/* Hover overlay effect */}
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-indigo-600/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-indigo-600/5 transition-all duration-500 pointer-events-none" />

      {/* Animated border */}
      <div className="absolute inset-0 rounded-[2rem] border-2 border-transparent group-hover:border-indigo-200 transition-colors duration-300" />
    </Link>
  );
}
