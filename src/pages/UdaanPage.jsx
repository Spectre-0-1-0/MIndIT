import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function UdaanPage() {
  return (
    <div className="space-y-10 rounded-[2rem] bg-gradient-to-br from-indigo-50 via-violet-50 to-white p-6 shadow-xl sm:p-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <div className="flex justify-center lg:justify-start">
            <Logo
              variant="udaan"
              alt="UDAAN Initiative - Student Mental Wellness Program"
              title="UDAAN: Student Mental Wellness in Action"
            />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">UDAAN Initiative</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            UDAAN: Student Mental Wellness in Action
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-700">
            UDAAN is a campus-led mental wellness program built to help students strengthen awareness, access support, and grow with confidence. It combines practical learning, peer connection, and wellbeing activities designed for student life.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600"
            >
              Explore programs
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-indigo-200 bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              Connect with UDAAN team
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700 p-8 text-white shadow-2xl">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 top-20 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4 rounded-3xl bg-white/10 p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl">🌿</div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-100">Student Wellness</p>
                <p className="text-lg font-semibold">A welcoming program for every learner.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-100">Peer Circle</p>
                <p className="text-base">Safe spaces for shared stories, guided conversations, and positive connection.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-100">Skill-building</p>
                <p className="text-base">Hands-on workshops that teach stress resilience and emotional awareness.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        {[
          {
            title: 'Awareness',
            copy: 'Build understanding of mental wellness, recognize signs of stress, and learn how to respond with care.',
          },
          {
            title: 'Support',
            copy: 'Connect with peers, mentors, and safe spaces so no student feels isolated in their wellbeing journey.',
          },
          {
            title: 'Growth',
            copy: 'Develop resilience, healthy habits, and confidence through practical programs and ongoing encouragement.',
          },
        ].map((pillar) => (
          <article
            key={pillar.title}
            className="rounded-[2rem] border border-indigo-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">{pillar.title}</p>
            <p className="mt-4 text-slate-700">{pillar.copy}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-indigo-700">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">✨</div>
            <h2 className="text-2xl font-semibold">Programs Offered</h2>
          </div>

          <ul className="mt-8 space-y-5 text-slate-700">
            <li className="flex gap-3 rounded-3xl border border-indigo-100 bg-indigo-50 p-5">
              <span className="mt-1 text-xl text-indigo-700">•</span>
              <div>
                <p className="font-semibold text-slate-900">Mental Health First Aid Training for Students</p>
                <p className="mt-1 text-sm text-slate-600">Learn how to spot distress, support peers, and connect others with campus resources.</p>
              </div>
            </li>
            <li className="flex gap-3 rounded-3xl border border-indigo-100 bg-indigo-50 p-5">
              <span className="mt-1 text-xl text-indigo-700">•</span>
              <div>
                <p className="font-semibold text-slate-900">Peer Support Circles</p>
                <p className="mt-1 text-sm text-slate-600">Regular gatherings for listening, encouragement, and community-led wellbeing.</p>
              </div>
            </li>
            <li className="flex gap-3 rounded-3xl border border-indigo-100 bg-indigo-50 p-5">
              <span className="mt-1 text-xl text-indigo-700">•</span>
              <div>
                <p className="font-semibold text-slate-900">Workshops on Stress Management and Resilience</p>
                <p className="mt-1 text-sm text-slate-600">Interactive sessions to build practical coping skills for campus life.</p>
              </div>
            </li>
            <li className="flex gap-3 rounded-3xl border border-indigo-100 bg-indigo-50 p-5">
              <span className="mt-1 text-xl text-indigo-700">•</span>
              <div>
                <p className="font-semibold text-slate-900">Wellness Challenges and Activities</p>
                <p className="mt-1 text-sm text-slate-600">Engaging initiatives designed to make wellbeing fun, motivating, and community-driven.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="rounded-[2rem] bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-700 p-8 text-white shadow-2xl">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white/10 p-6">
              <h3 className="text-lg font-semibold">Why UDAAN Works</h3>
              <p className="mt-3 text-sm leading-6 text-indigo-100">
                It combines education, community, and active self-care so students can learn and grow in a supportive environment.
              </p>
            </div>
            <div className="grid gap-4">
              {['Collaborative', 'Evidence-Based', 'Student-Focused'].map((label) => (
                <div key={label} className="rounded-3xl bg-white/10 p-4">
                  <p className="text-sm uppercase tracking-[0.24em] text-indigo-100">{label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl bg-white/10 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-indigo-100">Ready to get involved?</p>
              <p className="mt-3 text-base leading-7 text-indigo-100/90">
                UDAAN brings student voices and mental health support together through learning, listening, and action.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-indigo-900/5 p-8 text-slate-900 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Join the movement</p>
            <h2 className="text-3xl font-semibold sm:text-4xl">Be part of a campus community that lifts everyone up.</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full bg-indigo-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
              Discover assessments
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-indigo-200 bg-white px-6 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              Reach out for support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
