'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Lock, Globe, RefreshCw, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get your verification result in under 3 seconds with our high-performance processing pipeline.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'AES-256-GCM encryption protects your card data. We never store your codes in plain text.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Lock,
    title: 'No Account Required',
    description: 'No registration, no login, no personal data collected. Simply verify and go.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Support for 50+ card brands across all major currencies and regions worldwide.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: RefreshCw,
    title: 'Real-time Updates',
    description: 'Live status updates as your card is being verified. No page refresh needed.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
  {
    icon: BarChart3,
    title: 'Fraud Prevention',
    description: 'Advanced rate limiting and duplicate detection prevent abuse and protect users.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
  },
];

export function Features() {
  return (
    <section className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Why <span className="gradient-text">GiftCard Verify</span>?
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Built with enterprise-grade security and modern technology to give you the most reliable verification experience.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="glass rounded-2xl p-6 transition-all duration-300 hover:border-violet-500/20 group"
          >
            <div className={`inline-flex p-3 rounded-xl ${feature.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <feature.icon className={`w-6 h-6 ${feature.color}`} />
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
