import Logo from '../components/Logo';

export default function ContactUs() {
  return (
    <div className="space-y-10 rounded-[2rem] bg-gradient-to-br from-indigo-50 via-violet-50 to-white p-6 shadow-xl sm:p-10">
      <section className="space-y-4 rounded-[2rem] bg-white p-8 shadow-sm sm:p-10">
        <div className="space-y-3">
          <div className="flex justify-center">
            <Logo
              variant="contact"
              alt="MindCheck Contact Support"
              title="Get in touch with MindCheck"
            />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Contact Us</p>
          <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">Reach out anytime for support or feedback.</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-600">
            Whether you have a question about MindCheck, want to share feedback, or need help connecting with resources, we are here to listen.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6 rounded-[1.75rem] border border-indigo-100 bg-indigo-50 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Contact Information</h2>
            <p className="text-slate-700">You can reach us by email, visit our campus resources center, or use the emergency contacts below if you need immediate help.</p>

            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">Email</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">hello@mindcheck.example</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-indigo-600">Address</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">123 Campus Wellness Drive, Suite 200, Your City, State</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Send us a message</h2>
            <p className="mt-2 text-slate-600">Fill out the form and we’ll respond within 1-2 business days.</p>

            <form className="mt-8 space-y-5">
              <label className="block text-sm font-semibold text-slate-900">
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-900">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-900">
                Message
                <textarea
                  name="message"
                  rows="6"
                  placeholder="Tell us how we can help..."
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-600"
              >
                Submit message
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-600">Emergency Resources</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">If you or someone else is at risk, get help immediately.</h2>
            <p className="mt-3 max-w-2xl text-slate-700">
              These resources are for crisis situations and should be used when urgent support is needed.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <article className="rounded-[1.75rem] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-lg font-semibold">National Suicide Prevention Lifeline</h3>
            </div>
            <p className="mt-4 text-slate-700 text-xl font-semibold">988</p>
          </article>

          <article className="rounded-[1.75rem] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-lg font-semibold">Crisis Text Line</h3>
            </div>
            <p className="mt-4 text-slate-700 text-xl font-semibold">Text HOME to 741741</p>
          </article>

          <article className="rounded-[1.75rem] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-rose-600">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-lg font-semibold">Local Emergency Services</h3>
            </div>
            <p className="mt-4 text-slate-700 text-xl font-semibold">911</p>
          </article>
        </div>
      </section>
    </div>
  );
}
