import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileText, Link as LinkIcon, Type, Smartphone, Image as ImageIcon, Search, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { NewsContext } from '../context/NewsContext';
import FileUpload from '../components/FileUpload';

export default function Analyze() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAnalysisResult, setAnalyzedContent, setIsAnalyzing } = useContext(NewsContext);
  
  const [activeTab, setActiveTab] = useState('text');
  const [inputText, setInputText] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [inputHeadline, setInputHeadline] = useState('');
  const [inputPlatform, setInputPlatform] = useState('twitter');
  const [inputImage, setInputImage] = useState(null);
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  
  const tabs = [
    { id: 'text', icon: FileText, label: 'Text Article' },
    { id: 'url', icon: LinkIcon, label: 'URL' },
    { id: 'headline', icon: Type, label: 'Headline' },
    { id: 'social', icon: Smartphone, label: 'Social Post' },
    { id: 'image', icon: ImageIcon, label: 'Image' },
  ];

  useEffect(() => {
    if (location.state?.type) {
      setActiveTab(location.state.type);
    }
  }, [location]);

  const validateInput = () => {
    setError('');
    if (activeTab === 'text' && inputText.length < 100) return 'Please enter at least 100 characters for accurate analysis.';
    if (activeTab === 'url' && !inputUrl.startsWith('http')) return 'Please enter a valid URL starting with http:// or https://';
    if (activeTab === 'headline' && !inputHeadline) return 'Please enter a headline.';
    if (activeTab === 'social' && !inputText) return 'Please enter the social media post content.';
    if (activeTab === 'image' && !inputImage) return 'Please upload an image.';
    return null;
  };

  const handleAnalyze = async () => {
    const errorMsg = validateInput();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    setLocalLoading(true);
    setIsAnalyzing(true);
    setLoadingStep('Extracting content...');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      let endpoint = `/api/analyze/${activeTab}`;
      let fetchBody;
      let fetchHeaders = {};

      let contextContent = '';

      if (activeTab === 'image') {
        const formData = new FormData();
        formData.append('file', inputImage);
        fetchBody = formData;
        contextContent = `Image: ${inputImage.name}`;
      } else {
        fetchHeaders['Content-Type'] = 'application/json';
        if (activeTab === 'text') {
          fetchBody = JSON.stringify({ text: inputText });
          contextContent = inputText.substring(0, 200) + '...';
        } else if (activeTab === 'url') {
          fetchBody = JSON.stringify({ url: inputUrl });
          contextContent = inputUrl;
        } else if (activeTab === 'headline') {
          fetchBody = JSON.stringify({ headline: inputHeadline });
          contextContent = inputHeadline;
        } else if (activeTab === 'social') {
          fetchBody = JSON.stringify({ post_text: inputText, platform: inputPlatform });
          contextContent = `[${inputPlatform}] ${inputText.substring(0, 150)}...`;
        }
      }

      setAnalyzedContent(contextContent);

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: fetchHeaders,
        body: fetchBody,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let completeResult = null;
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            const dataStr = line.trim().substring(6);
            try {
              const data = JSON.parse(dataStr);
              if (data.status !== 'complete') {
                setLoadingStep(data.message + '...');
              } else {
                completeResult = data.result;
              }
            } catch(e) {
              console.error('Error parsing chunk', e);
            }
          }
        }
      }

      if (completeResult) {
        setAnalysisResult(completeResult);
        navigate('/results');
      } else {
        throw new Error("Did not receive complete result from stream");
      }
      
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please check if the backend is running.');
    } finally {
      setLocalLoading(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8 lg:py-16 min-h-screen"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl font-grotesk font-bold mb-4">Analyze Content</h1>
        <p className="text-textMuted">Select the type of content you want to verify and provide the input below.</p>
      </div>
      
      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-700/50 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-primary text-primary bg-primary/5' 
                : 'border-transparent text-textMuted hover:text-textMain hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-darkCard rounded-2xl p-6 lg:p-8 border border-slate-700/50 shadow-xl mb-8">
        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-lg flex items-start gap-3 text-danger">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {activeTab === 'text' && (
          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="text-sm font-medium text-textMuted">Paste the full news article here...</label>
              <button 
                onClick={() => setInputText("BREAKING: Scientists have discovered that eating chocolate every day leads to a 500% increase in brain capacity and makes you immune to all known viruses, according to a recent unverified blog post from real-health-truths.com. You must share this immediately to save lives!")}
                className="text-xs text-primary hover:underline"
              >
                Use Sample Article
              </button>
            </div>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-64 bg-darkBg border border-slate-700 rounded-xl p-4 text-textMain focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
              placeholder="Paste article text here..."
            />
            <div className="text-right mt-2 text-xs text-textMuted">
              {inputText.length} chars (Min 100)
            </div>
          </div>
        )}

        {activeTab === 'url' && (
          <div>
            <label className="text-sm font-medium text-textMuted block mb-2">Paste news article URL...</label>
            <div className="relative">
              <input 
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full bg-darkBg border border-slate-700 rounded-xl py-4 pl-4 pr-12 text-textMain focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="https://example.com/news-article"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {inputUrl.startsWith('http') && <ShieldCheck className="w-5 h-5 text-success" />}
              </div>
            </div>
            <p className="text-xs text-textMuted mt-3">We'll automatically extract the text, authors, and publish date.</p>
          </div>
        )}

        {activeTab === 'headline' && (
          <div>
            <label className="text-sm font-medium text-textMuted block mb-2">Enter the news headline...</label>
            <input 
              type="text"
              value={inputHeadline}
              onChange={(e) => setInputHeadline(e.target.value)}
              className="w-full bg-darkBg border border-slate-700 rounded-xl py-4 px-4 text-textMain focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="e.g. Alien spaceship found in Antarctic ice"
            />
          </div>
        )}

        {activeTab === 'social' && (
          <div>
            <div className="flex gap-4 mb-4">
              {['twitter', 'facebook', 'whatsapp', 'instagram'].map(platform => (
                <button
                  key={platform}
                  onClick={() => setInputPlatform(platform)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize border ${
                    inputPlatform === platform 
                      ? 'bg-primary/20 border-primary text-primary' 
                      : 'bg-darkBg border-slate-700 text-textMuted hover:border-slate-500'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
            <label className="text-sm font-medium text-textMuted block mb-2">Paste post content...</label>
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-40 bg-darkBg border border-slate-700 rounded-xl p-4 text-textMain focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
              placeholder="Paste social media post here..."
            />
          </div>
        )}

        {activeTab === 'image' && (
          <FileUpload file={inputImage} setFile={setInputImage} />
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={handleAnalyze}
        disabled={localLoading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-primary hover:from-blue-500 hover:to-blue-400 text-white font-bold text-lg shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {localLoading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            {loadingStep}
          </>
        ) : (
          <>
            <Search className="w-6 h-6" />
            Analyze Now
          </>
        )}
      </button>
      {!localLoading && (
        <p className="text-center text-xs text-textMuted mt-4">Estimated time: ~5 seconds</p>
      )}
    </motion.div>
  );
}

