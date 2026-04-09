import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import YourDOSTIntegration from '../components/YourDOSTIntegration';
import ProgramObjectives from '../components/ProgramObjectives';

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
    display: '@udaan.gitam',
    href: 'https://www.instagram.com/udaan.gitam?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    ariaLabel: 'Visit UDAAN Instagram profile'
  }
};

export default function UdaanPage() {
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const services = [
    {
      title: 'Mental Health First Aid Training',
      description: 'Learn how to spot distress, support peers, and connect others with campus resources.',
      details: 'Comprehensive 8-hour training program covering mental health awareness, stigma reduction, and practical intervention skills.',
      icon: '🚑',
      category: 'Training'
    },
    {
      title: 'Peer Support Circles',
      description: 'Regular gatherings for listening, encouragement, and community-led wellbeing.',
      details: 'Weekly facilitated sessions where students share experiences, learn coping strategies, and build supportive relationships.',
      icon: '🤝',
      category: 'Support'
    },
    {
      title: 'Stress Management Workshops',
      description: 'Interactive sessions to build practical coping skills for campus life.',
      details: 'Hands-on workshops covering mindfulness, time management, healthy boundaries, and resilience-building techniques.',
      icon: '🧘',
      category: 'Workshop'
    },
    {
      title: 'Wellness Challenges & Activities',
      description: 'Engaging initiatives designed to make wellbeing fun, motivating, and community-driven.',
      details: 'Monthly themed challenges, group activities, and wellness competitions that promote healthy habits and social connection.',
      icon: '🎯',
      category: 'Activity'
    }
  ];



  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 h-64 w-64 rounded-full bg-gradient-to-br from-violet-400/20 to-pink-400/20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/4 h-72 w-72 rounded-full bg-gradient-to-br from-purple-400/20 to-indigo-400/20 blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative space-y-10 rounded-[2rem] bg-gradient-to-br from-indigo-50 via-violet-50 to-white p-6 shadow-xl sm:p-10">
        {/* Interactive Header Section */}
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 p-8 text-white shadow-2xl">
          {/* Floating particles */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 h-2 w-2 rounded-full bg-white/30 animate-bounce delay-100"></div>
            <div className="absolute top-20 right-20 h-1 w-1 rounded-full bg-white/40 animate-bounce delay-300"></div>
            <div className="absolute bottom-20 left-1/4 h-1.5 w-1.5 rounded-full bg-white/35 animate-bounce delay-500"></div>
            <div className="absolute top-1/3 right-10 h-1 w-1 rounded-full bg-white/45 animate-bounce delay-700"></div>
          </div>

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <div className="flex justify-center lg:justify-start">
                <Logo
                  variant="udaan"
                  alt="UDAAN Initiative - Student Mental Wellness Program"
                  title="UDAAN: Student Mental Wellness in Action"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white animate-fade-in">UDAAN Initiative</p>
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl animate-fade-in delay-200">
                  UDAAN: Student Mental Wellness in Action
                </h1>
                <p className="text-indigo-100 animate-fade-in delay-400">
                  Mental Health & Well-being Initiative
                </p>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-indigo-100 animate-fade-in delay-600">
                UDAAN is a campus-led mental wellness program built to help students strengthen awareness, access support, and grow with confidence. It combines practical learning, peer connection, and wellbeing activities designed for student life.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row animate-fade-in delay-800">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-white/30 hover:scale-105"
                >
                  Explore programs
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 hover:scale-105"
                >
                  Connect with UDAAN team
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-white/10 backdrop-blur-sm p-8 shadow-2xl">
              <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -left-10 top-20 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4 rounded-3xl bg-white/20 backdrop-blur-sm p-4 hover:bg-white/30 transition-colors">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/30 text-2xl animate-bounce">🌿</div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-indigo-100">Student Wellness</p>
                    <p className="text-lg font-semibold">A welcoming program for every learner.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-3xl bg-white/20 backdrop-blur-sm p-5 hover:bg-white/30 transition-colors">
                    <p className="text-sm uppercase tracking-[0.2em] text-indigo-100">Peer Circle</p>
                    <p className="text-base">Safe spaces for shared stories, guided conversations, and positive connection.</p>
                  </div>
                  <div className="rounded-3xl bg-white/20 backdrop-blur-sm p-5 hover:bg-white/30 transition-colors">
                    <p className="text-sm uppercase tracking-[0.2em] text-indigo-100">Skill-building</p>
                    <p className="text-base">Hands-on workshops that teach stress resilience and emotional awareness.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission Cards */}
        <section className="grid gap-8 lg:grid-cols-2">
          <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-white shadow-xl transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl group-hover:animate-bounce">
                  🎯
                </div>
                <h3 className="text-2xl font-semibold">Our Vision</h3>
              </div>
              <p className="text-lg leading-8 text-indigo-100">
                To create a campus culture where mental wellness is normalized, supported, and integrated into every aspect of student life, fostering resilient and thriving individuals.
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-purple-600 to-violet-600 p-8 text-white shadow-xl transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl group-hover:animate-bounce">
                  🚀
                </div>
                <h3 className="text-2xl font-semibold">Our Mission</h3>
              </div>
              <p className="text-lg leading-8 text-indigo-100">
                To empower students with knowledge, skills, and supportive communities that promote mental wellness, reduce stigma, and build resilience for academic and personal success.
              </p>
            </div>
          </div>
        </section>

        {/* Objectives Dashboard */}
        <ProgramObjectives />

        {/* Services Accordion */}
        <section className="rounded-[2rem] bg-white p-8 shadow-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">Our Services</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive programs designed to support every aspect of student mental wellness
            </p>
          </div>

          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      service.category === 'Training' ? 'bg-red-100 text-red-600' :
                      service.category === 'Support' ? 'bg-green-100 text-green-600' :
                      service.category === 'Workshop' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <span className="text-xl">{service.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{service.title}</h3>
                      <p className="text-slate-600">{service.description}</p>
                    </div>
                  </div>
                  <div className={`transform transition-transform duration-300 ${activeAccordion === index ? 'rotate-180' : ''}`}>
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  activeAccordion === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-6">
                    <p className="text-slate-700 leading-7">{service.details}</p>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-4 ${
                      service.category === 'Training' ? 'bg-red-100 text-red-800' :
                      service.category === 'Support' ? 'bg-green-100 text-green-800' :
                      service.category === 'Workshop' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {service.category}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <YourDOSTIntegration />

        {/* Program Highlights Timeline */}
        <section className="rounded-[2rem] bg-white p-8 shadow-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">Program Highlights</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Key milestones and achievements in our journey to support student mental wellness
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-400 to-purple-400"></div>
            <div className="space-y-8">
              {[
                {
                  year: '2024',
                  title: 'Program Launch',
                  description: 'UDAAN officially launched with 500+ participating students across campus.',
                  badges: ['Launch', 'Community']
                },
                {
                  year: '2024',
                  title: 'Mental Health First Aid Training',
                  description: 'Trained 200+ students as mental health first aiders for peer support.',
                  badges: ['Training', 'Peer-Led']
                },
                {
                  year: '2024',
                  title: 'YourDOST Partnership',
                  description: 'Integrated professional counseling services for comprehensive support.',
                  badges: ['Partnership', 'Professional']
                }
              ].map((highlight, index) => (
                <div key={index} className="relative flex items-start gap-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-lg">
                    {highlight.year}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{highlight.title}</h3>
                    <p className="text-slate-600 mb-4">{highlight.description}</p>
                    <div className="flex gap-2">
                      {highlight.badges.map((badge, badgeIndex) => (
                        <span key={badgeIndex} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* Contact Info Module */}
        <section className="rounded-[2rem] bg-white p-4 md:p-8 shadow-xl">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2 md:mb-4">Get Involved</h2>
            <p className="text-sm md:text-lg text-slate-600 max-w-2xl mx-auto">
              Join the UDAAN community and be part of the movement for student mental wellness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 rounded-xl md:rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex h-10 md:h-12 w-10 md:w-12 items-center justify-center rounded-xl bg-indigo-100 text-lg md:text-2xl">
                  📧
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Email Us</h3>
                  <a
                    href={CONTACT_INFO.email.href}
                    className="text-sm md:text-base text-slate-600 hover:text-indigo-600 hover:underline transition-colors duration-200 cursor-pointer"
                    aria-label={CONTACT_INFO.email.ariaLabel}
                  >
                    {CONTACT_INFO.email.display}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 rounded-xl md:rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex h-10 md:h-12 w-10 md:w-12 items-center justify-center rounded-xl bg-green-100 text-lg md:text-2xl">
                  📞
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Call Us</h3>
                  <a
                    href={CONTACT_INFO.phone.href}
                    className="text-sm md:text-base text-slate-600 hover:text-indigo-600 hover:underline transition-colors duration-200 cursor-pointer"
                    aria-label={CONTACT_INFO.phone.ariaLabel}
                  >
                    {CONTACT_INFO.phone.display}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 rounded-xl md:rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex h-10 md:h-12 w-10 md:w-12 items-center justify-center rounded-xl bg-purple-100 text-lg md:text-2xl">
                  📱
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Follow Us</h3>
                  <a
                    href={CONTACT_INFO.instagram.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm md:text-base text-slate-600 hover:text-indigo-600 hover:underline transition-colors duration-200 cursor-pointer"
                    aria-label={CONTACT_INFO.instagram.ariaLabel}
                  >
                    {CONTACT_INFO.instagram.display}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl md:rounded-2xl p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-3 md:mb-4">Quick Actions</h3>
              <div className="flex flex-col md:space-y-3 gap-3">
                <Link
                  to="/"
                  className="block w-full text-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors min-h-[48px]"
                >
                  Take an Assessment
                </Link>
                <Link
                  to="/contact"
                  className="block w-full text-center px-6 py-3 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors min-h-[48px]"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
