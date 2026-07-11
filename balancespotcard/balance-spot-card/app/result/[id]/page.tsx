'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { api, type VerificationResult } from '@/lib/api';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  ArrowLeft,
  CreditCard,
  AlertTriangle,
  RefreshCw,
  Calendar,
  DollarSign,
} from 'lucide-react';

const cardStatusConfig = {
  ACTIVE: { label: 'Active', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  USED: { label: 'Already Used', color: 'text-orange-400', bg: 'bg-orange-500/10' },
  EXPIRED: { label: 'Expired', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  INVALID: { label: 'Invalid', color: 'text-red-400', bg: 'bg-red-500/10' },
  BLOCKED: { label: 'Blocked', color: 'text-red-400', bg: 'bg-red-500/10' },
  UNKNOWN: { label: 'Unknown', color: 'text-gray-400', bg: 'bg-gray-500/10' },
};

export default function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['verification-result', id],
    queryFn: () => api.getVerificationResult(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Poll every 2 seconds while pending/processing
      if (status === 'PENDING' || status === 'PROCESSING') return 2000;
      return false;
    },
    retry: 3,
  });

  if (isLoading) return <ResultSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-background gradient-bg flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Request Not Found</h2>
          <p className="text-muted-foreground mb-6">This verification request does not exist or has expired.</p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const isPending = data.status === 'PENDING' || data.status === 'PROCESSING';
  const isCompleted = data.status === 'COMPLETED';
  const isFailed = data.status === 'FAILED';
  const isValid = data.result?.valid === true;
  const statusConfig = data.result ? cardStatusConfig[data.result.cardStatus] : null;

  return (
    <div className="min-h-screen bg-background gradient-bg relative overflow-hidden">
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <Navbar />

      <main className="relative z-10 container mx-auto px-4 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Verification
          </Link>

          {/* Status Header */}
          <div className="glass rounded-2xl p-8 mb-6 glow-sm">
            <AnimatePresence mode="wait">
              {isPending && (
                <motion.div
                  key="pending"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-6"
                >
                  <div className="relative mx-auto w-20 h-20 mb-6">
                    <div className="w-20 h-20 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
                    <CreditCard className="w-8 h-8 text-violet-400 absolute inset-0 m-auto" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Verifying Your Card</h2>
                  <p className="text-muted-foreground">
                    {data.status === 'PENDING' ? 'Your request is queued...' : 'Checking with provider...'}
                  </p>
                  <div className="mt-4 flex justify-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {isCompleted && isValid && (
                <motion.div
                  key="valid"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2 text-emerald-400">Card Verified!</h2>
                  <p className="text-muted-foreground">Your gift card is valid and active.</p>

                  {/* Balance */}
                  {data.result?.balance !== null && data.result?.balance !== undefined && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mt-8 p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20"
                    >
                      <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                      <p className="text-4xl font-bold text-emerald-400">
                        {data.result.currency}{' '}
                        {Number(data.result.balance).toFixed(2)}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {isCompleted && !isValid && (
                <motion.div
                  key="invalid"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-red-400">Verification Failed</h2>
                  {statusConfig && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  )}
                </motion.div>
              )}

              {isFailed && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4"
                >
                  <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10 text-orange-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Processing Error</h2>
                  <p className="text-muted-foreground">Unable to process your request. Please try again.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 space-y-4"
          >
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Request Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Card Type</p>
                <p className="text-sm font-medium">{data.cardType?.name || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Card Amount</p>
                <p className="text-sm font-medium">
                  {data.currency} {Number(data.amount).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                  isCompleted && isValid ? 'text-emerald-400' :
                  isCompleted && !isValid ? 'text-red-400' :
                  isFailed ? 'text-orange-400' : 'text-violet-400'
                }`}>
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {isCompleted && isValid && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {isCompleted && !isValid && <XCircle className="w-3.5 h-3.5" />}
                  {isFailed && <AlertTriangle className="w-3.5 h-3.5" />}
                  {data.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                <p className="text-sm font-medium">
                  {new Date(data.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Request ID</p>
                <p className="text-xs font-mono text-muted-foreground truncate" title={data.requestId}>
                  {data.requestId}
                </p>
              </div>
              {data.result?.verifiedAt && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Verified At</p>
                  <p className="text-sm font-medium">
                    {new Date(data.result.verifiedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 mt-6"
          >
            <Link href="/" className="flex-1 btn-primary text-center py-3">
              Verify Another Card
            </Link>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-28 pb-20">
        <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="glass rounded-2xl p-8 h-64" />
          <div className="glass rounded-2xl p-6 h-48" />
        </div>
      </div>
    </div>
  );
}
