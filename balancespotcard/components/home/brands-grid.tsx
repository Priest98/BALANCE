'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ShoppingBag } from 'lucide-react';

// Fallback brand colors for when no logo is available
const brandColors: Record<string, string> = {
  amazon: 'from-orange-500 to-yellow-500',
  apple: 'from-gray-600 to-gray-800',
  google_play: 'from-green-500 to-teal-500',
  steam: 'from-blue-600 to-blue-800',
  netflix: 'from-red-600 to-red-800',
  walmart: 'from-blue-500 to-blue-700',
  target: 'from-red-500 to-rose-600',
  bestbuy: 'from-blue-500 to-yellow-400',
  ebay: 'from-blue-500 to-red-500',
  visa: 'from-blue-700 to-blue-900',
  mastercard: 'from-red-500 to-orange-500',
  amex: 'from-sky-500 to-blue-600',
};

const brandInitials: Record<string, string> = {
  amazon: 'AMZ',
  apple: 'APL',
  google_play: 'GP',
  steam: 'STM',
  netflix: 'NFX',
  walmart: 'WMT',
  target: 'TGT',
  bestbuy: 'BBY',
  ebay: 'EBY',
  visa: 'VISA',
  mastercard: 'MC',
  amex: 'AMEX',
};

export function BrandsGrid() {
  const { data: cardTypes = [], isLoading } = useQuery({
    queryKey: ['card-types'],
    queryFn: api.getCardTypes,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="container mx-auto px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-violet-400 mb-4">
          <ShoppingBag className="w-4 h-4" />
          Supported Brands
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          All Major <span className="gradient-text">Gift Card</span> Brands
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Verify gift cards from the world's leading retailers, streaming services, and payment networks.
        </p>
      </motion.div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="glass rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 shimmer"
              />
            ))
          : cardTypes.map((ct, i) => (
              <motion.div
                key={ct.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.08, y: -4 }}
                className="glass rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 cursor-default group transition-all duration-300 hover:border-violet-500/30"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                    brandColors[ct.brand] || 'from-violet-500 to-indigo-600'
                  } flex items-center justify-center text-white text-xs font-bold shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  {brandInitials[ct.brand] || ct.brand.slice(0, 3).toUpperCase()}
                </div>
                <span className="text-xs text-muted-foreground text-center leading-tight px-1">
                  {ct.name.replace(' Gift Card', '')}
                </span>
              </motion.div>
            ))}
      </div>
    </section>
  );
}
