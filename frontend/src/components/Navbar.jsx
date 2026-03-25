import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-darkBg/90 backdrop-blur-md border-b border-darkCard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <Search className="w-6 h-6 text-primary" />
            <span className="font-grotesk font-bold text-xl text-textMain tracking-wide">
              TruthLens
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-textMuted hover:text-white transition-colors">
              Home
            </Link>
            <a href="#how-it-works" className="text-sm font-medium text-textMuted hover:text-white transition-colors">
              How It Works
            </a>
            <Link to="/about" className="text-sm font-medium text-textMuted hover:text-white transition-colors">
              About
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              to="/analyze"
              className="px-5 py-2 rounded-full bg-primary hover:bg-blue-600 text-white font-medium text-sm transition-all transform hover:scale-105 shadow-lg shadow-primary/30"
            >
              Start Analyzing
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
