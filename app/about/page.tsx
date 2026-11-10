import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About this demo",
  description: "Transparency on real, unverified, and sample data in this prototype",
};

export default function AboutPage() {
  return (
    <div className="w-full max-w-[65ch] space-y-8 py-2">
      {/* Page Title */}
      <div className="border-b border-cowry-hairline pb-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-cowry-ink">
          About this demo
        </h1>
        <p className="text-sm text-cowry-muted mt-1 leading-relaxed">
          Honest disclosure on what is real, what is unverified, and what is sample data in this prototype.
        </p>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Section 1: Real */}
        <section className="border-b border-cowry-hairline pb-6">
          <h2 className="font-serif text-lg font-bold text-cowry-ink mb-2">
            Real
          </h2>
          <p className="text-sm text-cowry-ink leading-relaxed">
            Fares come from the official LAMATA fare list effective <strong>2 March 2026</strong>. These reflect the regulated flat fare pricing for Lagos BRT and standard bus services.
          </p>
        </section>

        {/* Section 2: Unverified */}
        <section className="border-b border-cowry-hairline pb-6">
          <h2 className="font-serif text-lg font-bold text-cowry-ink mb-2">
            Unverified
          </h2>
          <p className="text-sm text-cowry-ink leading-relaxed">
            Stop order along routes, reverse-direction fare symmetry, and Obalende&apos;s terminal infrastructure status are based on initial field observations and have not yet been fully audited on the ground.
          </p>
        </section>

        {/* Section 3: Sample */}
        <section className="pb-2">
          <h2 className="font-serif text-lg font-bold text-cowry-ink mb-2">
            Sample
          </h2>
          <p className="text-sm text-cowry-ink leading-relaxed">
            &ldquo;Buses waiting&rdquo; counts and headway wait estimates are simulated demo numbers created for this prototype, not live telematics. Reports submitted via the report tool are stored locally in browser memory for demonstration purposes.
          </p>
        </section>
      </div>
    </div>
  );
}
