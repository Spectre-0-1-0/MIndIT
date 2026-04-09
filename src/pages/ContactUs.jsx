import { useEffect } from 'react';
import Logo from '../components/Logo';

const CONTACT_INFO = {
  phone: {
    display: '+91-8317384722',
    href: 'tel:8317384722',
    ariaLabel: 'Call UDAAN helpline at 8317384722'
  },
  email: {
    display: 'udaan_dosl_blr@gitam.edu',
    href: 'mailto:udaan_dosl_blr@gitam.edu',
    ariaLabel: 'Send email to udaan_dosl_blr@gitam.edu'
  },
  instagram: {
    display: 'udaan.gitam',
    href: 'https://www.instagram.com/udaan.gitam?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    ariaLabel: 'Visit UDAAN Instagram profile'
  }
};

export default function ContactUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Contact UDAAN | MCheck - A UDAAN Initiative';
    const description = 'Contact the UDAAN Wellness Team at MCheck through phone, email, or Google Form for support and feedback.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-400/10 to-purple-400/10 blur-3xl animate-float-particle"></div>
        <div className="absolute top-1/2 -left-40 h-64 w-64 rounded-full bg-gradient-to-br from-violet-400/10 to-pink-400/10 blur-3xl animate-float-particle animation-delay-200"></div>
      </div>

      <div className="relative space-y-10 rounded-[2rem] bg-gradient-to-br from-indigo-50 via-violet-50 to-white p-6 shadow-xl sm:p-10">
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.35),_transparent_35%)]"></div>
          <div className="relative z-10 text-center space-y-6">
            <div className="flex justify-center">
              <Logo
                variant="contact"
                alt="MCheck - A UDAAN Initiative Contact Support"
                title="MCheck - A UDAAN Initiative Contact Support"
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-200">MCheck - A UDAAN Initiative</p>
              <h1 className="text-4xl font-semibold text-white sm:text-5xl">Contact the UDAAN Wellness Team</h1>
              <p className="mx-auto max-w-2xl text-base text-slate-200 sm:text-lg">
                Connect with UDAAN for support, feedback, and wellbeing resources. Use the Google Form to share your needs directly.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl transition-all duration-300 hover:-translate-y-1">
          <h2 className="text-2xl font-semibold text-slate-900">UDAAN Wellness Team</h2>
          <p className="text-slate-700">Speak directly with the UDAAN team for wellness guidance, counseling support, and campus resources.</p>

          <div className="space-y-5">
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-md">
              <p className="text-xs uppercase tracking-[0.24em] text-indigo-600">Team Lead</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Meghana Musku</p>
              <p className="text-sm text-slate-600">Senior Executive - Wellness</p>
            </div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-md">
              <p className="text-xs uppercase tracking-[0.24em] text-indigo-600">Team Lead</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">Pranav Amarnath</p>
              <p className="text-sm text-slate-600">Senior Executive - Wellness</p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-md">
              <div className="flex items-center gap-3 text-slate-900">
                <span className="text-xl">📞</span>
                <div>
                  <p className="text-sm font-semibold">Wellness Helpline</p>
                  <a
                    href={CONTACT_INFO.phone.href}
                    className="text-lg font-semibold hover:text-indigo-600 hover:underline transition-colors duration-200"
                    aria-label={CONTACT_INFO.phone.ariaLabel}
                  >
                    {CONTACT_INFO.phone.display}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-md">
              <div className="flex items-center gap-3 text-slate-900">
                <span className="text-xl">📧</span>
                <div>
                  <p className="text-sm font-semibold">Email</p>
                  <a
                    href={CONTACT_INFO.email.href}
                    className="text-lg font-semibold hover:text-indigo-600 hover:underline transition-colors duration-200"
                    aria-label={CONTACT_INFO.email.ariaLabel}
                  >
                    {CONTACT_INFO.email.display}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-md">
              <div className="flex items-center gap-3 text-slate-900">
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-sm font-semibold">Address</p>
                  <p className="text-lg font-semibold">GITAM (Deemed to be) University, Bengaluru</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-gradient-to-br from-indigo-50 to-purple-50 p-8 shadow-xl transition-all duration-300 hover:-translate-y-1">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-3">
            <span>📝</span>
            Google Form Feedback
          </h2>
          <p className="text-slate-600 mb-6">Share longer feedback through our external Google Form. We do not store responses on our servers.</p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScrycIDO1HT5ouCYTMjFt-1kFbKgj9o5GCItyFTejJrmYohHw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center gap-3 rounded-full bg-indigo-700 px-8 py-4 text-white shadow-lg transition-all duration-300 hover:bg-indigo-600 hover:shadow-2xl hover:-translate-y-0.5"
          >
            Connect
            <span className="text-xl">↗</span>
          </a>
          <div className="mt-4 rounded-3xl bg-white p-4 text-sm text-slate-700 border border-slate-200">
            <strong>Privacy Notice:</strong> Google Forms handles submission data directly. We do not retain any responses submitted through this external form.
          </div>
        </section>
      </div>
    </div>
  );
}