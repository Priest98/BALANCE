import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#0b162c] border-t border-white/5 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="inline-block mb-4">
              <span className="font-bold text-2xl text-white">
                Balance Spot Card
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              An efficient solution to verify all cards data. Check your card balance securely and instantly.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Contact
            </Link>
            <Link href="/terms" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Privacy Policy
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center md:text-left">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Balance Spot Card. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
