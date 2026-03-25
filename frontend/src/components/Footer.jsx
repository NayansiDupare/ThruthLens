import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-darkCard py-8 mt-12 border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-success" />
            <span className="font-grotesk font-bold text-lg text-white">TruthLens</span>
          </div>
          <p className="text-textMuted text-sm text-center md:text-left">
            Powered by Anthropic Claude AI + Python ML
          </p>
          <div className="flex items-center gap-4 text-sm text-textMuted">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
