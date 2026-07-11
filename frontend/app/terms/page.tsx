import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'GiftCard Verify Terms of Service.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background gradient-bg">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-10">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="glass rounded-2xl p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By using GiftCard Verify ("the Service"), you agree to these Terms of Service. If you do not agree, 
                please discontinue use of the Service immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Permitted Use</h2>
              <p className="text-muted-foreground leading-relaxed">
                GiftCard Verify is intended for the legitimate verification of gift cards that you own or have 
                been authorized to verify. You may use the Service to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-3">
                <li>Check the balance of gift cards you legally own</li>
                <li>Verify the validity of gift cards before use</li>
                <li>Confirm a gift card received as a gift</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Prohibited Use</h2>
              <p className="text-muted-foreground leading-relaxed">You may NOT use the Service to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-3">
                <li>Verify gift cards that you do not own or are not authorized to check</li>
                <li>Attempt to guess, brute-force, or enumerate card codes</li>
                <li>Engage in any fraudulent activity or gift card fraud</li>
                <li>Use automated scripts or bots to submit verification requests</li>
                <li>Circumvent or attempt to bypass rate limiting or fraud prevention measures</li>
                <li>Resell or commercialize access to the Service without written permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Service is provided "as is" without warranties of any kind. We do not guarantee the accuracy, 
                completeness, or timeliness of verification results. Verification results depend on the availability 
                and accuracy of third-party provider systems.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                GiftCard Verify shall not be liable for any indirect, incidental, special, or consequential damages 
                arising from your use of the Service, including but not limited to financial losses resulting from 
                reliance on verification results.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Rate Limiting and Fair Use</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to limit or terminate access to users who abuse the Service, submit excessive 
                requests, or violate these Terms. Rate limits are enforced to ensure fair access for all users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update these Terms at any time. Continued use of the Service after changes constitutes 
                acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms, contact{' '}
                <a href="mailto:legal@giftcardverify.com" className="text-violet-400 hover:underline">
                  legal@giftcardverify.com
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
