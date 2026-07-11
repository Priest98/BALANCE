'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2, CreditCard, Eye, EyeOff, ChevronDown } from 'lucide-react';
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
const PIN_BRANDS = ['visa', 'mastercard', 'amex']; // brands that require PIN

export function VerificationForm() {
  const router = useRouter();
  const [showPin, setShowPin] = useState(false);

  const { data: cardTypes = [], isLoading: loadingTypes } = useQuery({
    queryKey: ['card-types'],
    queryFn: api.getCardTypes,
    staleTime: 5 * 60 * 1000,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { currency: 'USD', amount: 50 },
  });

  const selectedTypeId = watch('cardTypeId');
  const selectedType = cardTypes.find((ct) => ct.id === selectedTypeId);
  const requiresPin = selectedType ? PIN_BRANDS.includes(selectedType.brand) : false;

  const { mutate: submitVerification, isPending } = useMutation({
    mutationFn: api.verify,
    onSuccess: (data) => {
      if (data.duplicate) {
        toast.info('Duplicate request detected — showing existing result');
      } else {
        toast.success('Verification submitted!');
      }
      router.push(`/result/${data.requestId}`);
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
    <div className="glass rounded-2xl p-8 glow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-violet-500/20 rounded-xl">
          <CreditCard className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Verify Gift Card</h2>
          <p className="text-sm text-muted-foreground">Enter your card details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Card Type + Currency row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Card Type <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                {...register('cardTypeId')}
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 pr-10 
                           text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 
                           focus:border-violet-500 transition-all appearance-none cursor-pointer"
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
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            {errors.cardTypeId && (
              <p className="text-xs text-red-400 mt-1">{errors.cardTypeId.message}</p>
            )}
          </div>

          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Currency <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                {...register('currency')}
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 pr-10 
                           text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 
                           focus:border-violet-500 transition-all appearance-none cursor-pointer"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Card Amount <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              {watch('currency') || '$'}
            </span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="10000"
              {...register('amount')}
              placeholder="50.00"
              className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 pl-12 
                         text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 
                         focus:border-violet-500 transition-all"
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-red-400 mt-1">{errors.amount.message}</p>
          )}
        </div>

        {/* Card Code */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Card Code <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            {...register('cardCode')}
            placeholder="e.g. XXXX-XXXX-XXXX-XXXX"
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 
                       text-sm font-mono tracking-wider focus:outline-none focus:ring-2 
                       focus:ring-violet-500/50 focus:border-violet-500 transition-all 
                       uppercase placeholder:uppercase placeholder:tracking-wider"
          />
          {errors.cardCode && (
            <p className="text-xs text-red-400 mt-1">{errors.cardCode.message}</p>
          )}
        </div>

        {/* PIN — shown when required or when card type supports it */}
        <AnimatePresence>
          {requiresPin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                PIN (Optional)
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  {...register('pin')}
                  placeholder="4-8 digits"
                  maxLength={8}
                  className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 pr-12
                             text-sm font-mono focus:outline-none focus:ring-2 
                             focus:ring-violet-500/50 focus:border-violet-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          id="verify-submit-btn"
          className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Verify Card
            </>
          )}
        </button>

        <p className="text-xs text-center text-muted-foreground">
          🔒 Your card details are encrypted and never stored in plain text
        </p>
      </form>
    </div>
  );
}
