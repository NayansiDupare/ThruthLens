import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, CheckCircle, HelpCircle, Download, Share2, AlertTriangle, ExternalLink } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { motion } from 'framer-motion';
import { NewsContext } from '../context/NewsContext';
import ConfidenceMeter from '../components/ConfidenceMeter';
import ChatBot from '../components/ChatBot';

export default function Results() {
  const { analysisResult, analyzedContent } = useContext(NewsContext);
  const navigate = useNavigate();

  if (!analysisResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-grotesk font-bold mb-4">No Analysis Found</h2>
        <button onClick={() => navigate('/analyze')} className="text-primary hover:underline">
          Go back to Analyzer
        </button>
      </div>
    );
  }

  const {
    verdict,
    confidence_score,
    ml_score,
    ai_score,
    source_score,
    ai_explanation,
    red_flags,
    source_credibility,
    content_analysis,
    similar_verified_news,
    recommendation
  } = analysisResult;

  // Banner styles based on verdict
  let bannerColor = "bg-warning";
  let bannerIcon = <HelpCircle className="w-8 h-8 text-white" />;
  let verdictText = "UNCERTAIN";
  
  if (verdict.includes("FAKE")) {
    bannerColor = "bg-danger";
    bannerIcon = <ShieldAlert className="w-8 h-8 text-white" />;
    verdictText = "LIKELY FAKE";
  } else if (verdict.includes("REAL")) {
    bannerColor = "bg-success";
    bannerIcon = <CheckCircle className="w-8 h-8 text-white" />;
    verdictText = "LIKELY REAL";
  }

  // Highlight keywords helper
  const renderHighlightedText = (text) => {
    // This is a simple replacer. In a full system, Claude would provide exact offsets,
    // or we'd use regex for known emotion/flag words.
    // For now, we apply basic bolding to standard explanation for visual structure.
    return <p className="text-slate-300 leading-relaxed">{text}</p>;
  };

  const handleDownloadPDF = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/report/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisResult)
      });
      
      if (!response.ok) throw new Error("Failed to generate PDF");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'truthlens_report.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF report.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pb-20 relative"
    >
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <button onClick={() => navigate('/analyze')} className="flex items-center gap-2 text-textMuted hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Analyze Another
        </button>
      </div>

      {/* Verdict Banner */}
      <div className={`w-full ${bannerColor} py-8 mb-8 shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {bannerIcon}
            <div>
              <h1 className="text-3xl md:text-4xl font-grotesk font-bold text-white tracking-wide">
                {verdictText}
              </h1>
              <p className="text-white/80 font-medium mt-1">Confidence Score: {confidence_score}%</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30 text-white text-center">
            <p className="text-sm opacity-90 mb-1">Recommendation</p>
            <p className="font-bold text-lg">{recommendation}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Analysis) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section A: AI Explanation */}
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-darkCard rounded-2xl p-6 lg:p-8 border border-slate-700 shadow-xl"
          >
            <h2 className="text-2xl font-grotesk font-bold mb-4 border-b border-slate-700 pb-4">AI Analysis</h2>
            {renderHighlightedText(ai_explanation)}
            
            {red_flags && red_flags.length > 0 && (
              <div className="mt-6 bg-danger/10 border border-danger/30 rounded-xl p-5">
                <h3 className="font-bold text-danger mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Key Red Flags
                </h3>
                <ul className="space-y-2">
                  {red_flags.map((flag, i) => (
                    <li key={i} className="text-danger/90 flex gap-2 items-start">
                      <span className="mt-1">•</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.section>

          {/* Section B: Content Analysis Metrics */}
          <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-darkCard rounded-2xl p-6 lg:p-8 border border-slate-700 shadow-xl"
          >
            <h2 className="text-xl font-grotesk font-bold mb-6 border-b border-slate-700 pb-4">Language & Content Structure</h2>
            
            <div className="w-full h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                  { subject: 'Emotion', score: content_analysis.emotional_language_score, fullMark: 100 },
                  { subject: 'Clickbait', score: content_analysis.clickbait_score, fullMark: 100 },
                  { subject: 'Quality', score: content_analysis.writing_quality_score, fullMark: 100 },
                  { subject: 'Facts', score: content_analysis.factual_claim_density, fullMark: 100 }
                ]}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }}
                    itemStyle={{ color: '#3b82f6' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex gap-4 justify-center">
              <span className={`px-4 py-2 rounded-full text-xs font-bold border ${content_analysis.has_citations ? 'bg-success/20 border-success text-success' : 'bg-danger/20 border-danger text-danger'}`}>
                {content_analysis.has_citations ? '✓ Contains Citations' : '✗ Lacks Citations'}
              </span>
              <span className={`px-4 py-2 rounded-full text-xs font-bold border ${content_analysis.has_statistics ? 'bg-success/20 border-success text-success' : 'bg-danger/20 border-danger text-danger'}`}>
                {content_analysis.has_statistics ? '✓ Uses Statistics' : '✗ Lacks Statistics'}
              </span>
            </div>
          </motion.section>

          {/* Section D: Similar Verified News */}
          {similar_verified_news && similar_verified_news.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-darkCard rounded-2xl p-6 lg:p-8 border border-slate-700 shadow-xl"
            >
              <h2 className="text-xl font-grotesk font-bold mb-6 border-b border-slate-700 pb-4">Similar Verified Coverage</h2>
              <div className="space-y-4">
                {similar_verified_news.map((news, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors gap-4">
                    <div>
                      <h3 className="font-bold text-textMain mb-1">{news.headline}</h3>
                      <div className="flex items-center gap-3 text-sm text-textMuted">
                        <span className="flex items-center gap-1 text-success">
                          <CheckCircle className="w-4 h-4" /> {news.source}
                        </span>
                        <span>•</span>
                        <span>{news.date}</span>
                      </div>
                    </div>
                    <a href={news.url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-darkBg border border-slate-600 hover:border-primary hover:text-primary transition-colors whitespace-nowrap text-sm">
                      Read <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

        </div>

        {/* Right Column (Scores & Source) */}
        <div className="space-y-8">
          
          {/* Main Scores Card */}
          <motion.section 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="bg-darkCard rounded-2xl p-6 border border-slate-700 shadow-xl flex flex-col items-center"
          >
             <h2 className="text-lg font-grotesk font-bold mb-6 w-full text-center border-b border-slate-700 pb-4">Aggregate Confidence</h2>
             <ConfidenceMeter score={confidence_score} label="Overall Score" />
             
             <div className="w-full grid grid-cols-2 gap-4 mt-8">
               <div className="bg-darkBg p-3 rounded-xl border border-slate-700 text-center">
                 <p className="text-xs text-textMuted uppercase mb-1">ML Score</p>
                 <p className="text-xl font-bold text-primary">{ml_score}%</p>
               </div>
               <div className="bg-darkBg p-3 rounded-xl border border-slate-700 text-center">
                 <p className="text-xs text-textMuted uppercase mb-1">Source Score</p>
                 <p className={`text-xl font-bold ${source_score > 60 ? 'text-success' : source_score < 40 ? 'text-danger' : 'text-warning'}`}>{source_score}%</p>
               </div>
               <div className="col-span-2 bg-darkBg p-3 rounded-xl border border-slate-700 text-center">
                 <p className="text-xs text-textMuted uppercase mb-1">Claude AI Score</p>
                 <p className="text-xl font-bold text-primary">{ai_score}%</p>
               </div>
             </div>
          </motion.section>

          {/* Source Credibility */}
          <motion.section 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.3 }}
             className="bg-darkCard rounded-2xl p-6 border border-slate-700 shadow-xl"
          >
             <h2 className="text-lg font-grotesk font-bold mb-4 border-b border-slate-700 pb-4">Source Credibility</h2>
             
             <div className="mb-4">
               <p className="text-xs text-textMuted uppercase tracking-wider mb-1">Domain Evaluated</p>
               <p className="text-lg font-bold text-white break-all">{source_credibility.domain}</p>
             </div>

             {source_credibility.is_known_fake_site && (
               <div className="bg-danger/20 border border-danger p-3 rounded-lg mb-4 text-danger text-sm font-bold flex gap-2 items-center">
                 <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                 KNOWN MISINFORMATION DOMAIN
               </div>
             )}

             <div className="space-y-3 text-sm">
               <div className="flex justify-between border-b border-slate-700/50 pb-2">
                 <span className="text-slate-400">Credibility Rating</span>
                 <span className="font-bold text-white flex gap-1">
                   {Array.from({length: 5}).map((_, i) => (
                     <span key={i} className={i < Math.floor(source_credibility.credibility_rating) ? 'text-warning' : 'text-slate-600'}>★</span>
                   ))}
                 </span>
               </div>
               <div className="flex justify-between border-b border-slate-700/50 pb-2">
                 <span className="text-slate-400">Verdict</span>
                 <span className={`font-bold ${source_credibility.credibility_rating > 3 ? 'text-success' : 'text-danger'}`}>{source_credibility.verdict}</span>
               </div>
               <div className="flex justify-between border-b border-slate-700/50 pb-2">
                 <span className="text-slate-400">Domain Age</span>
                 <span className="font-bold text-white">{source_credibility.domain_age_years} years</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-slate-400">Connection</span>
                 <span className="font-bold text-white uppercase">{source_credibility.has_https ? 'HTTPS - Secure' : 'HTTP - Insecure'}</span>
               </div>
             </div>
          </motion.section>

          {/* Export Actions */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-primary/10 rounded-2xl p-6 border border-primary/30"
          >
            <h2 className="text-lg font-grotesk font-bold mb-4 text-primary">Export & Share</h2>
            <div className="flex flex-col gap-3">
              <button onClick={handleDownloadPDF} className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-blue-600 text-white rounded-xl font-bold transition-colors">
                <Download className="w-5 h-5" /> Download PDF Report
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-darkBg border border-slate-600 hover:border-slate-400 text-white rounded-xl font-bold transition-colors">
                <Share2 className="w-5 h-5" /> Share Link
              </button>
            </div>
          </motion.section>

        </div>
      </div>

      {/* AI Chatbot Overlay */}
      <ChatBot articleContext={analyzedContent} analysisResults={analysisResult} />
    </motion.div>
  );
}

