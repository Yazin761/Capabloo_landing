import Image from "next/image";
import { NavBar } from "@/components/NavBar";
import { VideoHero } from "@/components/VideoHero";
import { AnimatedSection } from "@/components/AnimatedSection";
import { StatCard } from "@/components/StatCard";
import { Award, ShieldCheck, Target, Wind, Zap } from "lucide-react";
import { InstagramIcon, LinkedInIcon } from "@/components/ui/social-icons";

const SOCIAL_LINKS = [
  {
    label: "Capabloo on Instagram",
    href: "https://www.instagram.com/capabloo_com?igsh=MXFwZ3Q3aDR3ZTZ5OA%3D%3D&utm_source=qr",
    icon: InstagramIcon,
  },
  {
    label: "Capabloo on LinkedIn",
    href: "https://www.linkedin.com/company/capabloomedtech/",
    icon: LinkedInIcon,
  },
] as const;

const PRODUCTS = [
  {
    num: "01",
    title: "3D Printed Prosthetics",
    tag: "Flagship",
    image: "/products/prosthetics-product.png",
    imageAlt:
      "Capabloo 3D printed prosthetic socket — custom fit and built-in ventilation",
    detail: [
      "India’s first advanced socket with built-in airflow.",
      "Custom fit from scan — lighter, less pain, better mobility.",
    ],
  },
  {
    num: "02",
    title: "Grip Assist Device",
    tag: "Smart",
    image: "/products/grip-assist-product.png",
    imageAlt: "Capabloo Grip Assist device",
    detail: [
      "Ergonomic support for steadier grip and daily control.",
      "For stroke recovery, Parkinson’s care, and reduced hand strength.",
    ],
  },
];

const MARQUEE_ITEMS = [
  "3D Printed Prosthetics",
  "Smart Grip Assist",
  "Rehabilitation Tech",
  "MedTech Innovation",
  "Affordable Care",
  "Clinical Solutions",
  "India MedTech",
  "Human-Centered Design",
];

export default function Home() {
  return (
    <main className="site">
      <NavBar />

      <section id="home" className="hero-text-section">
        <AnimatedSection direction="up" delay={0}>
          <p className="hero-tagline">Rebuilding Abilities</p>
        </AnimatedSection>
        <AnimatedSection direction="up" delay={100}>
          <h1 className="hero-main-heading">
            Rehabilitation devices
            <span>for comfort, confidence, and independence.</span>
          </h1>
        </AnimatedSection>
        <AnimatedSection direction="up" delay={200}>
          <p className="hero-main-copy">
            Custom prosthetics and smart grip assist — affordable tools built for
            daily life.
          </p>
        </AnimatedSection>
        <AnimatedSection direction="up" delay={300}>
          <div className="hero-actions">
            <a href="#products" className="hero-cta">
              Explore products
            </a>
          </div>
        </AnimatedSection>
        <AnimatedSection direction="up" delay={420}>
          <div className="hero-scroll-down" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 4v12M4 11l6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </AnimatedSection>
      </section>

      <VideoHero />

      <div className="marquee-section" aria-hidden>
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="section-divider" />

      <AnimatedSection id="about" className="fw-section" direction="up">
        <div className="section-header">
          <span className="section-ghost-num">01</span>
          <span className="section-header-label">About</span>
        </div>
        <div className="two-col">
          <h2>Capabloo MedTech</h2>
          <div>
            <p>
              User-focused rehabilitation devices that are affordable, reliable,
              and easy to use — from scan to fit, with dignity at the center.
            </p>
            <p className="vision-quote" style={{ marginTop: "1.25rem" }}>
              &ldquo;Every design we create carries a life forward.&rdquo;
            </p>
          </div>
        </div>

        <div className="feature-grid" style={{ marginTop: "2.5rem" }}>
          {[
            {
              icon: Target,
              title: "Precision Fit",
              desc: "Patient-specific geometry for comfort and clinical alignment.",
            },
            {
              icon: Zap,
              title: "Lightweight Build",
              desc: "Strong materials, low weight for active daily use.",
            },
            {
              icon: Wind,
              title: "Smart Ventilation",
              desc: "Integrated airflow for cooler, longer wear.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="feature-card">
              <span className="feature-icon" aria-hidden>
                <Icon size={28} strokeWidth={2} />
              </span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <div className="section-divider" />

      <section id="products" className="fw-section">
        <AnimatedSection direction="up">
          <div className="section-header">
            <span className="section-ghost-num">02</span>
            <span className="section-header-label">Products</span>
          </div>
          <h2>What we build</h2>
        </AnimatedSection>

        <div className="browser-grid browser-grid--products">
          {PRODUCTS.map(({ num, title, tag, image, imageAlt, detail }, i) => (
            <AnimatedSection
              key={num}
              className="product-card-wrap"
              direction="up"
              delay={i * 80}
            >
              <article className="product-card">
                <div className="product-card__media">
                  <Image
                    src={image}
                    alt={imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="product-card__img"
                    priority={i === 0}
                  />
                </div>
                <div className="product-card__body product-card__body--minimal">
                  <span className="browser-card-num">PRODUCT — {num}</span>
                  <h3>{title}</h3>
                  <div className="product-card__detail">
                    {detail.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                  <span className="card-tag">{tag}</span>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      <section className="mid-video-section">
        <div className="mid-video-shell">
          <video
            className="mid-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source
              src="/video/9c545c16f5b38aa63732f16e5dad074c_1777900678%20(1)%20(1).mp4"
              type="video/mp4"
            />
          </video>
          <div className="mid-video-overlay" />
        </div>
      </section>

      <section id="services" className="fw-section">
        <div className="section-header">
          <span className="section-ghost-num">03</span>
          <span className="section-header-label">Technology</span>
        </div>
        <h2>How we build it</h2>

        <div className="tech-grid tech-grid--compact tech-grid--four">
          {[
            {
              num: "T-01",
              title: "3D Scanning & Modeling",
              badge: "Precision",
              desc: "Anatomy captured and optimized for faster, better fits.",
            },
            {
              num: "T-02",
              title: "Additive Manufacturing",
              badge: "Fabrication",
              desc: "Clinical-grade polymers — strong, light, customizable.",
            },
            {
              num: "T-03",
              title: "Airflow Engineering",
              badge: "Comfort",
              desc: "Channels that reduce heat and moisture during wear.",
            },
            {
              num: "T-04",
              title: "Sensor-Assisted Grip",
              badge: "Smart",
              desc: "Guided feedback to rebuild grip confidence.",
            },
          ].map(({ num, title, badge, desc }) => (
            <div key={num} className="tech-card">
              <span className="tech-num">{num}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
              <span className="tech-badge">{badge}</span>
            </div>
          ))}
        </div>

        <div id="impact" className="fw-section__follow">
          <div className="section-header">
            <span className="section-ghost-num">04</span>
            <span className="section-header-label">Services & impact</span>
          </div>
          <h2>What we deliver</h2>
          <p className="section-desc">
            From clinical assessment to deployment — with hospitals and care teams.
          </p>

          <div className="process-grid process-grid--compact process-grid--four">
            {[
              ["01", "Assessment & design", "Need-based fit from movement and comfort data."],
              ["02", "Rapid prototyping", "Scan to wearable prototype in days."],
              ["03", "Rehab integration", "Aligned with therapeutic programs."],
              ["04", "Clinical support", "Iterative refinement from real outcomes."],
            ].map(([num, title, desc]) => (
              <div key={num} className="process-grid-item">
                <span className="process-grid-num">{num}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>

          <div className="stats-grid stats-grid--three">
            <StatCard
              value="01"
              label="India's first 3D printed socket with integrated airflow concept."
              delay={0}
            />
            <StatCard
              value="03+"
              label="Clinical and physiotherapy partners."
              delay={120}
            />
            <StatCard
              value="100%"
              label="Patient-centric, affordable medtech focus."
              delay={240}
            />
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <AnimatedSection id="contact" className="cta-section" direction="up">
        <div className="section-header" style={{ justifyContent: "center", border: "none", marginBottom: "1rem" }}>
          <span className="section-ghost-num">05</span>
          <span className="section-header-label">Contact</span>
        </div>
        <h2>Partner with Capabloo</h2>
        <p>Clinical partnerships and device inquiries welcome.</p>
        <div className="cta-links">
          <a href="mailto:contact@capabloo.com" className="cta-btn primary">
            contact@capabloo.com
          </a>
          <a
            href="https://www.capabloo.com"
            target="_blank"
            rel="noreferrer"
            className="cta-btn secondary"
          >
            capabloo.com ↗
          </a>
        </div>
      </AnimatedSection>

      <AnimatedSection direction="up" className="iso-section">
        <div className="iso-badge-head">
          <ShieldCheck size={20} />
          <span>Certified Quality System</span>
        </div>
        <h3>ISO 9001 Certified</h3>
        <p>
          Capabloo MedTech operates under an ISO 9001 certified quality
          management framework for medical device design and development.
        </p>
        <div className="iso-meta">
          <span>
            <Award size={15} />
            Certificate No: CAP-ISO-9001-2026
          </span>
          <span>Status: Active</span>
        </div>
        <a
          href="/certificates/capabloo-iso.pdf"
          target="_blank"
          rel="noreferrer"
          className="iso-cta"
        >
          View Certificate
        </a>
      </AnimatedSection>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Capabloo MedTech</p>
        <div className="site-footer-right">
          <div className="site-footer-social" aria-label="Social media">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer-social__link"
                aria-label={label}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
          <div className="site-footer-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#products">Products</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
