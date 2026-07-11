import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'GiftCard Verify Privacy Policy — how we handle your data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background gradient-bg">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="glass rounded-2xl p-8 space-y-8 prose prose-invert max-w-none">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                When you use GiftCard Verify, we collect the following information to provide our verification service:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-3">
                <li>Gift card type, currency, and face value (used for verification context)</li>
                <li>Gift card code and optional PIN (encrypted with AES-256-GCM before storage)</li>
                <li>IP address and approximate geographic location (for fraud prevention and rate limiting)</li>
                <li>Browser user agent string (for bot detection)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">We use collected information to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-3">
                <li>Process your gift card verification request</li>
                <li>Prevent fraud, duplicate submissions, and abuse</li>
                <li>Maintain audit logs for security compliance</li>
                <li>Improve service reliability and performance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">3. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We take data security seriously. All gift card codes and PINs are encrypted using AES-256-GCM encryption 
                before being stored in our database. Encryption keys are managed separately and never stored alongside 
                encrypted data. We never store your card credentials in plain text at any point.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">4. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                Verification requests and results are retained for 90 days for audit and compliance purposes, 
                after which they are automatically deleted. Audit logs are retained for 12 months.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">5. Third-Party Providers</h2>
              <p className="text-muted-foreground leading-relaxed">
                To perform gift card verification, we may transmit encrypted card data to authorized verification 
                providers. These providers are bound by strict data processing agreements and are prohibited from 
                using your data for any purpose other than verification.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">6. No Account Required</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not collect any personally identifiable information (PII) such as names, email addresses, 
                or phone numbers. No account is required and no cookies are used for tracking purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">7. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                For privacy-related questions, contact us at{' '}
                <a href="mailto:privacy@giftcardverify.com" className="text-violet-400 hover:underline">
                  privacy@giftcardverify.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
