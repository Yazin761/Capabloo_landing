import { NavBar } from "@/components/NavBar";
import { VideoHero } from "@/components/VideoHero";
import { AnimatedSection } from "@/components/AnimatedSection";
import { StatCard } from "@/components/StatCard";
import { Award, ShieldCheck, Target, Wind, Zap } from "lucide-react";

const MARQUEE_ITEMS = [
  "3D Printed Prosthetics", "Smart Grip Assist", "Rehabilitation Tech",
  "Human-Centered Design", "MedTech Innovation", "Affordable Care",
  "Clinical Solutions", "Ergonomic Devices", "India MedTech",
  "3D Printed Prosthetics", "Smart Grip Assist", "Rehabilitation Tech",
  "Human-Centered Design", "MedTech Innovation", "Affordable Care",
  "Clinical Solutions", "Ergonomic Devices", "India MedTech",
];

export default function Home() {
  return (
    <main className="site">
      <NavBar />

      {/* Hero text */}
      <section id="home" className="hero-text-section">
        <AnimatedSection direction="up" delay={0}>
          <p className="hero-tagline">Rebuilding Abilities</p>
        </AnimatedSection>
        <AnimatedSection direction="up" delay={100}>
          <h1 className="hero-main-heading">
            Innovative rehabilitation devices
            <span>for comfort, confidence, and independence.</span>
          </h1>
        </AnimatedSection>
        <AnimatedSection direction="up" delay={200}>
          <p className="hero-main-copy">
            From custom 3D printed prosthetics to smart grip assist systems — Capabloo
            MedTech creates affordable, practical tools that improve daily life.
          </p>
        </AnimatedSection>
        <AnimatedSection direction="up" delay={300}>
          <div className="hero-actions">
            <a href="#about" className="hero-cta">Explore Capabloo</a>
          </div>
        </AnimatedSection>
        <AnimatedSection direction="zoom" delay={420}>
          <div className="hero-highlights">
            <span>3D Printed Prosthetics</span>
            <span>Smart Grip Assist</span>
            <span>Human-Centered MedTech</span>
          </div>
        </AnimatedSection>
      </section>

      <VideoHero />

      {/* Scrolling marquee strip */}
      <div className="marquee-section" aria-hidden>
        <div className="marquee-track">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="section-divider" />

      {/* 01 — About */}
      <AnimatedSection id="about" className="fw-section" direction="up">
        <div className="section-header">
          <span className="section-ghost-num">01</span>
          <span className="section-header-label">Who We Are</span>
        </div>
        <div className="two-col">
          <h2>About Capabloo MedTech</h2>
          <div>
            <p style={{ marginBottom: "1.5rem" }}>
              Capabloo develops user-focused rehabilitation devices that are affordable,
              reliable, and easy to use for patients and clinicians worldwide.
            </p>
            <div className="vision-quote-block">
              <p className="vision-quote">
                &ldquo;Every design we create carries a life forward.&rdquo;
              </p>
            </div>
            <p style={{ marginTop: "1.5rem" }}>
              We engineer solutions that combine clinical insights, ergonomic design, and
              modern manufacturing to rebuild human ability with dignity.
            </p>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="feature-grid" style={{ marginTop: "3.5rem" }}>
          {[
            { icon: Target, title: "Precision Fit", desc: "Patient-specific geometry ensures maximum comfort and clinical alignment for every user." },
            { icon: Zap, title: "Lightweight Build", desc: "Advanced materials keep devices strong yet feather-light for active daily routines." },
            { icon: Wind, title: "Smart Ventilation", desc: "Integrated airflow channels reduce heat and moisture — India's first in its class." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="feature-card">
              <span className="feature-icon" aria-hidden>
                <Icon size={30} strokeWidth={2} />
              </span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <div className="section-divider" />

      {/* 02 — Products */}
      <section id="products" className="fw-section">
        <AnimatedSection direction="up">
          <div className="section-header">
            <span className="section-ghost-num">02</span>
            <span className="section-header-label">What We Build</span>
          </div>
          <h2>Our Products</h2>
          <p>Precision-engineered rehabilitation tools designed for real lives.</p>
        </AnimatedSection>

        <div className="browser-grid">
          {[
            {
              num: "01", title: "3D Printed Prosthetics", tag: "Flagship",
              desc: "Customized prosthetic stump sockets designed with precise scanning, reduced pain points, and faster lightweight fabrication."
            },
            {
              num: "02", title: "Grip Assist Device", tag: "Smart",
              desc: "Smart ergonomic support for stroke and Parkinson's patients, improving grip stability and day-to-day independence."
            },
            {
              num: "03", title: "Built-In Ventilation Socket", tag: "Innovative",
              desc: "India's first advanced 3D printed socket concept with integrated airflow for greater comfort during long wear sessions."
            },
          ].map(({ num, title, tag, desc }, i) => (
            <AnimatedSection key={num} direction="up" delay={i * 100}>
              <article className="browser-card">
                <div className="browser-bar">
                  <span className="browser-dot browser-dot-r" />
                  <span className="browser-dot browser-dot-y" />
                  <span className="browser-dot browser-dot-g" />
                  <div className="browser-bar-url" />
                </div>
                <div className="browser-body">
                  <span className="browser-card-num">PRODUCT — {num}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                  <span className="card-tag">{tag}</span>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* Mid-page brand film */}
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

      {/* 03 — Technology */}
      <AnimatedSection id="services" className="fw-section" direction="up">
        <div className="section-header">
          <span className="section-ghost-num">03</span>
          <span className="section-header-label">Our Technology</span>
        </div>
        <h2>How We Build It</h2>
        <p>The technologies that power every Capabloo device.</p>

        <div className="tech-grid">
          {[
            {
              num: "T-01", title: "3D Scanning & Modeling", badge: "Precision",
              desc: "Patient anatomy captured and converted into optimized socket geometry, reducing fitting time by over 60%."
            },
            {
              num: "T-02", title: "Additive Manufacturing", badge: "Fabrication",
              desc: "Fused deposition modeling with clinical-grade polymers for devices that are strong, light, and customizable."
            },
            {
              num: "T-03", title: "Airflow Engineering", badge: "Comfort",
              desc: "Purpose-built internal channels remove heat and moisture, pioneering a new comfort standard in Indian prosthetics."
            },
            {
              num: "T-04", title: "Sensor-Assisted Grip", badge: "Smart",
              desc: "Resistive feedback technology helps patients rebuild grip confidence through guided pressure response."
            },
            {
              num: "T-05", title: "Clinical Data Integration", badge: "Research",
              desc: "Device performance is continuously refined through anonymized patient outcome data and therapist feedback loops."
            },
            {
              num: "T-06", title: "Ergonomic Validation", badge: "Tested",
              desc: "Every design passes biomechanical stress testing and real-world wear trials before clinical deployment."
            },
          ].map(({ num, title, badge, desc }, i) => (
            <AnimatedSection key={num} direction="up" delay={i * 80}>
              <div className="tech-card">
                <span className="tech-num">{num}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
                <span className="tech-badge">{badge}</span>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </AnimatedSection>

      {/* Testimonial / mission banner */}
      <AnimatedSection direction="zoom">
        <div className="testimonial-section">
          <div className="testimonial-inner">
            <p className="testimonial-quote">
              Building technology that gives people back their <em>freedom to move</em>,
              their <em>confidence to act</em>, and their <em>dignity to live</em>.
            </p>
            <div className="testimonial-author">
              Capabloo MedTech — Mission Statement
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* 04 — Services */}
      <AnimatedSection id="impact" className="fw-section" direction="up">
        <div className="section-header">
          <span className="section-ghost-num">04</span>
          <span className="section-header-label">What We Do</span>
        </div>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:"2rem", flexWrap:"wrap", marginBottom:"0.5rem" }}>
          <h2 style={{ margin:0 }}>Services</h2>
          <p className="section-desc" style={{ maxWidth:"44ch", marginBottom:0 }}>
            We work with hospitals, physio centers, and care teams to deliver
            personalized rehabilitation from assessment to deployment.
          </p>
        </div>
        <div className="process-grid">
          {[
            ["01","Clinical Assessment Support","Need-based design using patient movement and comfort data."],
            ["02","Custom Device Design","Patient-specific geometry and fit optimization with 3D workflows."],
            ["03","Rapid Prototyping","From scan to wearable prototype in days, not weeks."],
            ["04","Rehab Integration","Solutions aligned with therapeutic programs for real outcomes."],
            ["05","Ventilation Engineering","Airflow channels reduce heat and moisture during wear."],
            ["06","Ongoing Clinical Support","Iterative refinement based on patient feedback and outcomes."],
          ].map(([num, title, desc]) => (
            <div key={num} className="process-grid-item">
              <span className="process-grid-num">{num}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <div className="section-divider" />

      {/* 05 — Impact stats */}
      <AnimatedSection direction="up" className="fw-section">
        <div className="section-header">
          <span className="section-ghost-num">05</span>
          <span className="section-header-label">Our Impact</span>
        </div>
        <h2>Impact &amp; Vision</h2>
        <div className="stats-grid">
          <StatCard value="01" label="India's first advanced 3D printed socket with integrated airflow concept." delay={0} />
          <StatCard value="03+" label="Clinical and physiotherapy ecosystem collaborators actively partnered." delay={150} />
          <StatCard value="100%" label="Focused on affordable and patient-centric medtech innovation." delay={300} />
          <StatCard value="∞" label="Lives we aim to improve through accessible, dignified rehabilitation." delay={450} />
        </div>
      </AnimatedSection>

      {/* 06 — Contact CTA */}
      <AnimatedSection id="contact" className="cta-section" direction="up">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <span className="section-ghost-num">06</span>
          <span style={{ fontSize: "0.68rem", fontWeight: 500, color: "var(--fg-mid)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Get In Touch</span>
        </div>
        <h2>Partner with<br />Capabloo.</h2>
        <p>
          Collaborate with us for patient-centric devices and rehabilitation
          solutions built for real-world outcomes.
        </p>
        <div className="cta-links">
          <a href="mailto:contact@capabloo.com" className="cta-btn primary">contact@capabloo.com</a>
          <a href="https://www.capabloo.com" target="_blank" rel="noreferrer" className="cta-btn secondary">www.capabloo.com ↗</a>
        </div>
      </AnimatedSection>

      <AnimatedSection direction="up" className="iso-section">
        <div className="iso-badge-head">
          <ShieldCheck size={20} />
          <span>Certified Quality System</span>
        </div>
        <h3>ISO 13485 Certified</h3>
        <p>
          Capabloo MedTech operates under an ISO 13485 certified quality
          management framework for medical device design and development.
        </p>
        <div className="iso-meta">
          <span>
            <Award size={15} />
            Certificate No: CAP-ISO-13485-2026
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
        <p>© {new Date().getFullYear()} Capabloo MedTech. All rights reserved.</p>
        <div className="site-footer-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </footer>
    </main>
  );
}
