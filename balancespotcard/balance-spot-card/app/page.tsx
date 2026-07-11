'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { VerificationForm } from '@/components/verification/verification-form';
import { BrandsGrid } from '@/components/home/brands-grid';
import { Features } from '@/components/home/features';
import { FAQ } from '@/components/home/faq';
import { Shield, Zap, Lock, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background gradient-bg relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />

      {/* Glow orbs */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-24 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-violet-400 mb-8"
            >
              <Shield className="w-4 h-4" />
              <span>Secure & Instant Verification</span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
              Verify Your{' '}
              <span className="gradient-text">Gift Card</span>
              <br />
              Instantly & Securely
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Check your gift card balance in seconds. Supports all major brands with
              enterprise-grade security and real-time results.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-16">
              {[
                { label: 'Cards Verified', value: '2M+' },
                { label: 'Brands Supported', value: '50+' },
                { label: 'Uptime', value: '99.9%' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Verification Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            id="verify"
            className="max-w-2xl mx-auto"
          >
            <VerificationForm />
          </motion.div>
        </section>

        {/* Trust badges */}
        <section className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
          >
            {[
              { icon: Lock, label: '256-bit Encryption' },
              { icon: Shield, label: 'SOC 2 Compliant' },
              { icon: Zap, label: 'Results in < 3 seconds' },
              { icon: CheckCircle2, label: 'No Account Required' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-violet-400" />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Brands */}
        <BrandsGrid />

        {/* Features */}
        <Features />

        {/* FAQ */}
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}
