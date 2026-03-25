import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Link as LinkIcon, Type, Smartphone, Image as ImageIcon, BarChart3, UploadCloud, Cpu, ShieldCheck, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
export default function Landing() {
  const navigate = useNavigate();
  const [count, setCount] = useState(124000);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const inputTypes = [
    { icon: FileText, label: "Text/Article", type: "text" },
    { icon: LinkIcon, label: "URL", type: "url" },
    { icon: Type, label: "Headline", type: "headline" },
    { icon: Smartphone, label: "Social Media Post", type: "social" },
    { icon: ImageIcon, label: "Image/Screenshot", type: "image" },
    { icon: BarChart3, label: "Detailed Report", type: "text" }
  ];

  const steps = [
    { icon: UploadCloud, title: "1. Submit Content", desc: "Paste text, URL, or upload an image." },
    { icon: Cpu, title: "2. AI + ML Analysis", desc: "Our engine processes multiple data points." },
    { icon: ShieldCheck, title: "3. Get Report", desc: "Receive dynamic confidence scores." },
    { icon: MessageSquare, title: "4. Chat with AI", desc: "Discuss findings for deeper context." },
  ];

  return (
    <div className="min-h-screen bg-darkBg text-textMain flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-20 lg:py-32 flex flex-col lg:flex-row items-center justify-between gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 space-y-8 text-center lg:text-left"
        >
          <h1 className="text-5xl lg:text-7xl font-grotesk font-bold leading-tight">
            Don't Share What You Haven't <span className="text-primary">Verified</span> 🔍
          </h1>
          <p className="text-lg lg:text-xl text-textMuted max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            TruthLens uses advanced AI and Machine Learning to detect fake news from articles, URLs, headlines, social media posts and images — in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/analyze" className="px-8 py-4 rounded-full bg-primary hover:bg-blue-600 text-white font-semibold transition-all shadow-lg shadow-primary/20 text-lg flex items-center justify-center gap-2">
              Analyze Now <ShieldCheck className="w-5 h-5"/>
            </Link>
            <a href="#how-it-works" className="px-8 py-4 rounded-full border border-slate-700 hover:border-textMuted hover:bg-white/5 text-white font-semibold transition-all text-lg flex items-center justify-center">
              See How It Works
            </a>
          </div>
          <div className="pt-4 flex items-center justify-center lg:justify-start gap-3 text-textMuted font-medium">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse"></div>
            <span>{count.toLocaleString()} Articles Analyzed</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 relative w-full max-w-lg lg:max-w-none"
        >
          {/* Animated Visual Placeholder */}
          <div className="relative rounded-2xl bg-darkCard border border-slate-700/50 p-6 shadow-2xl overflow-hidden aspect-video flex flex-col justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
            <FileText className="w-20 h-20 text-primary mb-4 animate-bounce" />
            <div className="h-2 w-3/4 bg-slate-700 rounded-full mb-3 overflow-hidden">
               <div className="h-full bg-primary animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
            <div className="h-2 w-1/2 bg-slate-700 rounded-full mb-6"></div>
            <div className="flex gap-4 z-10">
               <div className="bg-success/20 text-success border border-success/30 px-4 py-2 rounded-full font-bold flex items-center gap-2 transform -rotate-6">
                 <ShieldCheck className="w-4 h-4" /> 92% Real
               </div>
               <div className="bg-danger/20 text-danger border border-danger/30 px-4 py-2 rounded-full font-bold flex items-center gap-2 transform rotate-3">
                 Fake Score 8%
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Input Types */}
      <section className="w-full bg-darkCard/50 py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-grotesk font-bold mb-12">Analyze Any Content Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8">
            {inputTypes.map((item, i) => (
              <button 
                key={i}
                onClick={() => navigate('/analyze', { state: { type: item.type }})}
                className="bg-darkCard hover:bg-slate-800 border border-slate-700 hover:border-primary/50 rounded-xl p-6 flex flex-col items-center justify-center gap-4 transition-all group shadow-lg"
              >
                <div className="bg-darkBg p-4 rounded-full group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                  <item.icon className="w-8 h-8" />
                </div>
                <span className="font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="w-full py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-grotesk font-bold text-center mb-16">How TruthLens Works</h2>
        <div className="grid md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-darkBg border-2 border-primary flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-grotesk font-bold text-xl mb-3">{step.title}</h3>
              <p className="text-textMuted">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Strip */}
      <section className="w-full bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 font-grotesk font-bold text-xl md:text-2xl">
          <div className="text-center"><div className="text-4xl mb-2">95%+</div>Accuracy</div>
          <div className="text-center"><div className="text-4xl mb-2">5</div>Input Types</div>
          <div className="text-center"><div className="text-4xl mb-2">⚡</div>Real-time Analysis</div>
          <div className="text-center"><div className="text-4xl mb-2">🤖</div>Powered by Claude AI</div>
        </div>
      </section>
      
      {/* Added simple tailwind animation for the scanning bar */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}} />
    </div>
  );
}
