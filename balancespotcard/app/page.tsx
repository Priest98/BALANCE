'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { VerificationForm } from '@/components/verification/verification-form';
import { CheckCircle2, Shield, Lock, Star } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[#0b162c] overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
              {/* Left Text */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="flex-1 text-center lg:text-left z-10"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Verify Any Card <br className="hidden lg:block" />
                  With Confidence
                </h1>
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                  Quickly and securely check your card balance. Our advanced system supports multiple card types and provides instant, accurate results.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                  <Link href="#verify" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-center">
                    Check balance
                  </Link>
                  <Link href="#features" className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-center border border-gray-700">
                    Learn More
                  </Link>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>Instant Results</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span>Bank-level Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-green-500" />
                    <span>Privacy Guaranteed</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Image */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="flex-1 relative z-10 w-full max-w-lg lg:max-w-none"
              >
                <Image
                  src="/images/up.jpeg"
                  alt="Stacked Gift Cards"
                  width={600}
                  height={500}
                  className="w-full h-auto drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </div>
          </div>
          
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/20 to-transparent pointer-events-none" />
        </section>

        {/* Verification Form Section */}
        <section id="verify" className="py-24 bg-[#081020] relative">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <VerificationForm />
            </motion.div>
          </div>
        </section>

        {/* Features / Efficiency Section */}
        <section id="features" className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Left Image */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex-1 w-full max-w-lg mx-auto lg:max-w-none"
              >
                <Image
                  src="/images/down.jpeg"
                  alt="Efficient Verification"
                  width={600}
                  height={500}
                  className="w-full h-auto"
                />
              </motion.div>

              {/* Right Text & Cards */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  An efficient solution to verify all cards data
                </h2>
                <p className="text-gray-600 mb-10 text-lg">
                  Our platform is built to process verification requests instantly while maintaining the highest security standards. Don't let uncertainty hold you back—verify with confidence.
                </p>

                <div className="space-y-6">
                  {/* Feature Card 1 */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      <ZapIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Algorithm</h3>
                      <p className="text-gray-600">
                        Our intelligent routing ensures your card is verified against the correct brand database in milliseconds.
                      </p>
                    </div>
                  </div>

                  {/* Feature Card 2 */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-start">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Secure</h3>
                      <p className="text-gray-600">
                        All transactions are encrypted with AES-256 bank-level security. We never store your sensitive card information.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 bg-[#0b162c]">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-blue-400 font-semibold mb-2">TESTIMONIALS</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">
              What People Are Saying
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#122240] p-8 rounded-2xl border border-white/5"
              >
                <div className="flex text-yellow-400 mb-6">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-gray-300 text-lg mb-8 italic">
                  "This service saved me so much time! I had a stack of old gift cards and was able to check the balances for all of them in minutes. Extremely easy to use."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center font-bold text-white text-xl">
                    S
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Sarah Jenkins</h4>
                    <p className="text-gray-400 text-sm">Verified User</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-[#122240] p-8 rounded-2xl border border-white/5"
              >
                <div className="flex text-yellow-400 mb-6">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <p className="text-gray-300 text-lg mb-8 italic">
                  "I was worried about security, but seeing that they don't store the card details gave me peace of mind. The verification was instant. Highly recommended."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center font-bold text-white text-xl">
                    M
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">Michael Chen</h4>
                    <p className="text-gray-400 text-sm">Verified User</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Privacy Section */}
        <section id="privacy" className="py-24 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">
              Your Privacy Is Our Priority
            </h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row"
            >
              <div className="p-12 md:w-1/2 text-left flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Bank-Level Encryption</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We use industry-standard AES-256 encryption to transmit your data safely. We NEVER store your full card number or PIN. Our systems are regularly audited to ensure maximum security.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    No data retention
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    End-to-end encryption
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    SOC 2 Compliant infrastructure
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 bg-blue-50 p-8 flex items-center justify-center">
                <Image
                  src="/images/vault.png"
                  alt="Security Vault"
                  width={300}
                  height={300}
                  className="w-full max-w-[300px] h-auto drop-shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

// Inline Zap icon to avoid missing import
function ZapIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
