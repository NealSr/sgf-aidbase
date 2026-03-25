import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-2xl">
        <h1
          className="text-3xl font-bold tracking-tight mb-8"
          style={{ color: "var(--foreground)" }}
        >
          About SGF AidBase
        </h1>

        {/* What is SGF AidBase? */}
        <Section title="What is SGF AidBase?">
          <p>
            SGF AidBase is a free community resource navigator for
            Springfield, MO. People describe what they need in their own
            words, and the app connects them with local organizations that can
            help — instantly.
          </p>
          <p>
            We built this around the Four Walls — the four things every person
            needs before anything else: food, shelter, utilities, and
            transportation.
          </p>
        </Section>

        {/* How it works */}
        <Section title="How it works">
          <p>
            Type what you need in the search bar. Our AI understands your
            words and matches you with the right category of help. Every
            listing includes the address, phone number, hours, and
            eligibility — everything you need to take the next step.
          </p>
          <p>
            You can also browse by category or turn off AI matching and search
            directly.
          </p>
        </Section>

        {/* Who built this? */}
        <Section title="Who built this?">
          <p>
            SGF AidBase was built by Ctrl+Aid during Springfield Tech Week
            2026.
          </p>
          <p>
            We used Traction Studio AI by Codefi to validate the problem,
            Claude by Anthropic to architect and build the solution, and
            feedback from Springfield librarians and community organizations to
            make sure we got it right.
          </p>
        </Section>

        {/* Credits & Acknowledgments */}
        <Section title="Credits &amp; Acknowledgments">
          <p>
            This tool is powered by the incredible network of nonprofits in
            Springfield who do the real work every day. We just help people
            find them.
          </p>
          <p>
            Special thanks to the Springfield-Greene County Library District
            for research assistance.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <CreditLink href="https://codefiworks.com" label="Codefi" />
            <CreditLink href="https://www.anthropic.com" label="Anthropic" />
            <CreditLink
              href="https://sgftechcouncil.com"
              label="Springfield Tech Council"
            />
          </div>
        </Section>

        {/* Data Accuracy */}
        <Section title="Data Accuracy">
          <p>
            Every resource listing was sourced from organization websites, the
            Springfield Public Library&apos;s resource directory, and direct
            outreach. We take accuracy seriously — but information changes.
            Always verify details directly with the organization.
          </p>
          <p>
            Found an error?{" "}
            <Link
              href="/feedback"
              className="underline font-medium"
              style={{ color: "var(--accent)" }}
            >
              Submit a correction on our feedback page.
            </Link>
          </p>
        </Section>

        {/* Crisis Resources */}
        <div
          className="rounded-2xl border p-6"
          style={{
            background: "var(--warm-bg)",
            borderColor: "var(--card-border)",
          }}
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: "var(--foreground)" }}
          >
            Crisis Resources
          </h2>
          <ul className="flex flex-col gap-2">
            <CrisisLine
              emoji="🚨"
              label="If you are in immediate danger, call"
            >
              <a
                href="tel:911"
                className="underline font-semibold"
                style={{ color: "var(--accent)" }}
              >
                911
              </a>
            </CrisisLine>
            <CrisisLine
              emoji="💛"
              label="Suicide &amp; Crisis Lifeline: call or text"
            >
              <a
                href="tel:988"
                className="underline font-semibold"
                style={{ color: "var(--accent)" }}
              >
                988
              </a>
            </CrisisLine>
            <CrisisLine
              emoji="💜"
              label="National Domestic Violence Hotline:"
            >
              <a
                href="tel:1-800-799-7233"
                className="underline font-semibold"
                style={{ color: "var(--accent)" }}
              >
                1-800-799-7233
              </a>
            </CrisisLine>
            <CrisisLine emoji="🧡" label="Child Abuse &amp; Neglect:">
              <a
                href="tel:1-800-392-3738"
                className="underline font-semibold"
                style={{ color: "var(--accent)" }}
              >
                1-800-392-3738
              </a>
            </CrisisLine>
            <CrisisLine emoji="📞" label="211 Missouri: dial">
              <a
                href="tel:211"
                className="underline font-semibold"
                style={{ color: "var(--accent)" }}
              >
                211
              </a>{" "}
              for statewide assistance
            </CrisisLine>
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Reusable content section with a heading and styled card */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border p-6 mb-4"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      <h2
        className="text-xl font-semibold mb-3"
        style={{ color: "var(--foreground)" }}
      >
        {title}
      </h2>
      <div
        className="flex flex-col gap-3 text-base"
        style={{ color: "var(--muted)" }}
      >
        {children}
      </div>
    </div>
  );
}

/** External credit link styled as a pill */
function CreditLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-medium px-4 py-2 rounded-full border transition-colors"
      style={{
        borderColor: "var(--card-border)",
        color: "var(--accent)",
        background: "var(--warm-bg)",
      }}
    >
      {label} ↗
    </a>
  );
}

/** Single crisis resource line with emoji and clickable phone number */
function CrisisLine({
  emoji,
  label,
  children,
}: {
  emoji: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="text-sm" style={{ color: "var(--foreground)" }}>
      {emoji} {label} {children}
    </li>
  );
}
