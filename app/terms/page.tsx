"use client";

import { motion } from "framer-motion";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

export default function TermsPage() {
  return (
    <div className="desktop-page-inner" style={{ minHeight: "100vh", padding: "80px 20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: "36px", fontWeight: 900, color: "var(--foreground)", letterSpacing: "-1px", marginBottom: "8px" }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "40px" }}>Last updated: May 06, 2025</p>

          <div style={{ ...G, borderRadius: "28px", padding: "48px", color: "var(--foreground)", lineHeight: 1.8 }}>
            <section style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px", color: "var(--accent)" }}>1. Acceptance of Terms</h2>
              <p style={{ color: "var(--muted)" }}>
                By accessing or using the Foodipa platform (&quot;the Service&quot;), you agree to be legally bound by these Terms of Service and all policies incorporated by reference. If you do not agree to all of these terms, do not use the Service.
              </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px", color: "var(--accent)" }}>2. Eligibility and Account</h2>
              <p style={{ color: "var(--muted)" }}>
                You must be at least 18 years of age to use the Service. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px", color: "var(--accent)" }}>3. Intellectual Property Rights</h2>
              <p style={{ color: "var(--muted)" }}>
                The Service and its original content, features, and functionality are owned by Foodipa and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px", color: "var(--accent)" }}>4. AI Content and Culinary Disclaimers</h2>
              <p style={{ color: "var(--muted)", marginBottom: "16px" }}>
                Foodipa provides AI-generated recipes, ingredient substitutes, and nutritional insights. These outputs are for informational purposes only.
              </p>
              <ul style={{ color: "var(--muted)", paddingLeft: "20px" }}>
                <li>We do not guarantee the accuracy, safety, or nutritional validity of AI-generated content.</li>
                <li>Users are responsible for verifying ingredients against their own allergies or dietary restrictions.</li>
                <li>Culinary techniques and results are the sole responsibility of the user.</li>
              </ul>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px", color: "var(--accent)" }}>5. Prohibited Conduct</h2>
              <p style={{ color: "var(--muted)" }}>
                You agree not to use the Service for any unlawful purpose or in any way that interrupts, damages, or impairs the Service. Prohibited activities include, but are not limited to, data mining, scraping, or any attempt to reverse engineer the Service&apos;s underlying technology.
              </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px", color: "var(--accent)" }}>6. Limitation of Liability</h2>
              <p style={{ color: "var(--muted)" }}>
                In no event shall Foodipa, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, or other intangible losses, resulting from your access to or use of the Service.
              </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px", color: "var(--accent)" }}>7. Indemnification</h2>
              <p style={{ color: "var(--muted)" }}>
                You agree to defend, indemnify, and hold harmless Foodipa and its affiliates from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses arising from your use of and access to the Service.
              </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px", color: "var(--accent)" }}>8. Governing Law</h2>
              <p style={{ color: "var(--muted)" }}>
                These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which Foodipa is registered, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px", color: "var(--accent)" }}>9. Changes to Terms</h2>
              <p style={{ color: "var(--muted)" }}>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
