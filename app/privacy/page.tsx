"use client";

import { motion } from "framer-motion";

const G: React.CSSProperties = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid var(--glass-border)",
  boxShadow: "var(--glass-shadow)",
};

export default function PrivacyPage() {
  return (
    <div className="desktop-page-inner" style={{ minHeight: "100vh", padding: "80px 20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: "36px", fontWeight: 900, color: "var(--foreground)", letterSpacing: "-1px", marginBottom: "8px" }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "40px" }}>Last updated: May 06, 2025</p>

          <div style={{ ...G, borderRadius: "28px", padding: "48px", color: "var(--foreground)", lineHeight: 1.8 }}>
            <section style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px", color: "var(--accent)" }}>1. Introduction</h2>
              <p style={{ color: "var(--muted)" }}>
                At Foodipa, we respect your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our platform, ensuring compliance with global data protection standards such as GDPR and CCPA.
              </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px", color: "var(--accent)" }}>2. Data We Collect</h2>
              <p style={{ color: "var(--muted)", marginBottom: "16px" }}>We process several categories of personal data:</p>
              <ul style={{ color: "var(--muted)", paddingLeft: "20px" }}>
                <li><strong>Identity Data:</strong> Name, username, and profile image.</li>
                <li><strong>Contact Data:</strong> Email address and social media handles.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, and device identifiers.</li>
                <li><strong>Usage Data:</strong> AI prompt history, saved recipes, and interaction patterns.</li>
                <li><strong>Location Data:</strong> Geolocation coordinates for the &quot;Food Finder&quot; feature (collected with consent).</li>
              </ul>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px", color: "var(--accent)" }}>3. AI Data Processing</h2>
              <p style={{ color: "var(--muted)" }}>
                When you use our AI features (The Lab, Food Scanner), your inputs may be processed to generate responses. We do not use your personal identifiers to train public AI models. Your prompt history is stored securely to provide you with a persistent culinary log.
              </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px", color: "var(--accent)" }}>4. How We Use Your Data</h2>
              <p style={{ color: "var(--muted)" }}>
                We use your data to: Provide and maintain the Service; Personalize your culinary recommendations; Process your AI requests; Notify you about updates; and fulfill legal obligations.
              </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px", color: "var(--accent)" }}>5. Data Sharing and Disclosure</h2>
              <p style={{ color: "var(--muted)" }}>
                We do not sell your personal data. We may share information with:
              </p>
              <ul style={{ color: "var(--muted)", paddingLeft: "20px" }}>
                <li>Third-party service providers (Cloud storage, AI infrastructure).</li>
                <li>Legal authorities when required by law.</li>
                <li>In connection with a business merger or acquisition.</li>
              </ul>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px", color: "var(--accent)" }}>6. Your Rights and Choices</h2>
              <p style={{ color: "var(--muted)", marginBottom: "16px" }}>Depending on your location, you may have the following rights:</p>
              <ul style={{ color: "var(--muted)", paddingLeft: "20px" }}>
                <li><strong>Access:</strong> Request a copy of your data.</li>
                <li><strong>Deletion:</strong> Request that we erase your personal information.</li>
                <li><strong>Correction:</strong> Update inaccurate data.</li>
                <li><strong>Portability:</strong> Transfer your data to another service.</li>
              </ul>
            </section>

            <section style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px", color: "var(--accent)" }}>7. Security</h2>
              <p style={{ color: "var(--muted)" }}>
                We implement robust administrative and technical security measures, including end-to-end encryption and secure database protocols, to prevent unauthorized access or disclosure of your information.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "16px", color: "var(--accent)" }}>8. Contact Information</h2>
              <p style={{ color: "var(--muted)" }}>
                For any privacy-related inquiries or to exercise your rights, please contact our Data Protection Officer at privacy@foodipa.com.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
