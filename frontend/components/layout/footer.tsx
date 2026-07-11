import Link from 'next/link';
import { CreditCard, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="p-1.5 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">
                GiftCard<span className="gradient-text">Verify</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Secure, instant gift card verification for consumers and businesses. 
              Powered by enterprise-grade encryption and real-time processing.
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5 text-violet-400" />
              <span>AES-256-GCM Encrypted</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/#verify" className="hover:text-foreground transition-colors">Verify a Card</Link></li>
              <li><Link href="/#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="/#faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} GiftCard Verify. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            For authorized use only. Unauthorized card checking is prohibited.
          </p>
        </div>
      </div>
    </footer>
  );
}
