'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'Is this service free to use?',
    a: 'Yes, GiftCard Verify is completely free for consumers. Simply enter your card details and get instant results.',
  },
  {
    q: 'How is my card information protected?',
    a: 'Your card code and PIN are encrypted using AES-256-GCM encryption before being processed. We never store your data in plain text, and encryption keys are managed securely server-side.',
  },
  {
    q: 'How long does verification take?',
    a: 'Most verifications complete within 1–3 seconds. In rare cases of high load, it may take up to 30 seconds. You\'ll see a real-time status update on the result page.',
  },
  {
    q: 'What card brands do you support?',
    a: 'We support all major gift card brands including Amazon, Apple, Google Play, Steam, Netflix, Walmart, Target, Best Buy, eBay, Visa, Mastercard, and American Express. More brands are added regularly.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No account is required. There is no registration, no login, and no personal information collected. Simply enter your card details and verify.',
  },
  {
    q: 'What if my card shows as invalid?',
    a: 'An invalid result could mean the card code was entered incorrectly, the card has already been fully used, or the card has expired. Double-check your card details and try again.',
  },
  {
    q: 'Can I verify the same card multiple times?',
    a: 'To prevent abuse, duplicate submissions within 5 minutes will return the cached result from your first submission. You can verify again after the cooldown period.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-violet-400 mb-4">
          <HelpCircle className="w-4 h-4" />
          FAQ
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Everything you need to know about our gift card verification service.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={`glass rounded-2xl overflow-hidden transition-all duration-300 ${
              openIndex === i ? 'border-violet-500/30' : ''
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 group"
              id={`faq-${i}`}
            >
              <span className="font-medium text-sm md:text-base group-hover:text-violet-400 transition-colors">
                {faq.q}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                  openIndex === i ? 'rotate-180 text-violet-400' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
