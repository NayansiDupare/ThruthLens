Build a complete AI-powered Fake News Detection System called "TruthLens" with React + Tailwind CSS frontend and Python + FastAPI backend. The system uses ML models + Anthropic Claude API to detect fake news from multiple input types.

🖥️ PART 1 — FRONTEND (React + Tailwind CSS)

🎨 Design Direction — "Trust & Truth"

Background: Deep dark #0f172a (slate-900) — serious, trustworthy feel
Primary Accent: Electric blue #3b82f6
Real/True Color: Emerald green #10b981
Fake/False Color: Red #ef4444
Uncertain Color: Amber #f59e0b
Card Background: #1e293b (slate-800) dark cards
Text: White #f8fafc headings, #94a3b8 body text
Heading Font: Space Grotesk (bold, techy)
Body Font: Inter
Style: Dark professional dashboard — like a cybersecurity or intelligence tool. Clean, data-rich, trustworthy.


📄 Pages:

1. Landing Page (/)

Navbar:

Logo: 🔍 "TruthLens" in Space Grotesk
Links: Home, How It Works, About
CTA: "Start Analyzing" blue pill button
Dark sticky navbar


Hero Section:

Big heading: "Don't Share What You Haven't Verified 🔍"
Subtext: "TruthLens uses advanced AI and Machine Learning to detect fake news from articles, URLs, headlines, social media posts and images — in seconds."
Two CTAs: "Analyze Now" (blue filled) + "See How It Works" (outline)
Right side: Animated visual showing a news article being scanned with a green ✅ or red ❌ result
Live counter: "1,24,532 Articles Analyzed" (animated count-up)


Input Type Cards (6 cards):

📝 Text/Article | 🔗 URL | 📰 Headline | 📱 Social Media Post | 🖼️ Image/Screenshot | 📊 Detailed Report
Each card clickable → navigates to /analyze with that mode pre-selected


How It Works Section:

4 steps with icons and connecting arrows:

📤 Submit Content (text/URL/image)
🤖 AI + ML Analysis Engine runs
📊 Get Confidence Score + Report
💬 Chat with AI for deeper understanding




Stats Strip:

95%+ Accuracy | 5 Input Types | Real-time Analysis | Powered by Claude AI


Footer: Logo, links, "Powered by Anthropic Claude AI + Python ML"


2. Analyzer Page (/analyze)

Input Type Tabs (top):

📝 Text Article | 🔗 URL | 📰 Headline | 📱 Social Post | 🖼️ Image
Active tab highlighted in blue
Each tab shows different input UI


Tab 1 — Text Article:

Large textarea: "Paste the full news article here..."
Character count (min 100 chars for analysis)
Sample article button to auto-fill example


Tab 2 — URL:

Input field: "Paste news article URL..."
URL validation indicator (green tick when valid URL)
Supported domains list hint


Tab 3 — Headline:

Single line input: "Enter the news headline..."
Quick analyze mode (faster response)


Tab 4 — Social Media Post:

Textarea for post text
Platform selector: Twitter/X | Facebook | WhatsApp | Instagram
Option to paste post URL


Tab 5 — Image/Screenshot:

Drag & drop image upload box
Supports JPG, PNG, WebP
Preview uploaded image
"Extract text from image and analyze" note


Analyze Button:

"🔍 Analyze Now" — blue gradient full width button
Loading animation: scanning effect with progress steps:

"Extracting content..." → "Running ML model..." → "AI analysis..." → "Generating report..."


Estimated time: "~5 seconds"




3. Results Page (/results)

Verdict Banner (top, full width):

🟢 "LIKELY REAL" — green background if real
🔴 "LIKELY FAKE" — red background if fake
🟡 "UNCERTAIN" — amber background if uncertain
Large bold verdict text + confidence percentage (e.g. "87.3% Fake")


Confidence Score Card:

Large animated circular meter (SVG)
Color coded: green (real) / red (fake) / amber (uncertain)
Three sub-scores below:

ML Model Score
AI Analysis Score
Source Credibility Score


Combined weighted final score


Results Grid (6 sections):
Section A — AI Explanation:

"Why TruthLens thinks this is Fake/Real"
Detailed paragraph from Claude AI explaining reasoning
Key red flag phrases highlighted in red within the text
Key credible indicators highlighted in green

Section B — Source Credibility:

Domain name extracted
Credibility rating: ⭐⭐⭐⭐⭐ (1–5 stars)
Known fake news site warning badge if applicable
Domain age, HTTPS check, bias rating
Credibility verdict: Credible / Questionable / Known Misinformation Source

Section C — Content Analysis:

Emotional language score (sensationalist headlines score high)
Clickbait score
Writing quality score
Factual claim density
Use of statistics/sources
Visual breakdown bars for each metric

Section D — Similar Verified News:

3 cards of similar verified news articles
Each card: Headline, Source (BBC/Reuters/AP), Date, Link
"Verified by trusted sources" green badge
"Compare with original" button

Section E — Detailed Analysis Report:

Full structured report:

Summary verdict
Key red flags found (bullet list)
Language analysis
Source analysis
Fact-check indicators
Recommendation: "Do not share" / "Verify before sharing" / "Safe to share"


"📥 Download Report PDF" button
"📤 Share Results" button (copy link)

Section F — Credibility Timeline:

Shows when the news was first published
Any corrections or updates made
How it spread (if URL provided)


AI Chatbot (floating bottom right):

"💬 Discuss this news with AI"
Pre-loaded with context of the analyzed article
Suggested questions:

"Why is this fake?"
"What are the red flags?"
"Find me the real version of this news"
"Should I share this?"
"Who is spreading this?"


Full chat interface with history




Frontend Technical Requirements:

React with useState, useEffect, useContext
React Router v6
Tailwind CSS only
Axios for API calls
ResumeContext → NewsContext for sharing analysis state
Animated SVG confidence meter
react-dropzone for image upload
Toast notifications
Fully responsive


⚙️ PART 2 — BACKEND (Python + FastAPI)

Project Structure:
backend/
├── main.py
├── requirements.txt
├── .env
├── routers/
│   ├── analyze.py          # Main analysis endpoints
│   └── chat.py             # Chatbot endpoint
├── services/
│   ├── content_extractor.py   # Extract text from URL/image
│   ├── ml_engine.py           # ML fake news detection model
│   ├── source_checker.py      # Source credibility checker
│   ├── claude_service.py      # Claude API integration
│   └── report_generator.py    # PDF report generation
├── models/
│   ├── request_models.py
│   └── response_models.py
├── data/
│   ├── fake_news_model/       # Saved ML model files
│   ├── known_fake_sites.json  # Known misinformation domains
│   └── trusted_sources.json   # Verified credible sources
└── utils/
    ├── text_preprocessor.py
    └── image_ocr.py

📦 requirements.txt:
fastapi
uvicorn
anthropic
python-multipart
pydantic
python-dotenv
requests
beautifulsoup4
newspaper3k
scikit-learn
pandas
numpy
nltk
joblib
Pillow
pytesseract
transformers
torch
reportlab
tldextract
whois

🔌 API Endpoints:
POST /api/analyze/text

Input: { "text": "article content", "input_type": "article" }
Returns: Full analysis JSON

POST /api/analyze/url

Input: { "url": "https://..." }
Scrape article from URL using newspaper3k
Extract: title, text, authors, publish date, source domain
Run full analysis pipeline
Returns: Full analysis JSON

POST /api/analyze/headline

Input: { "headline": "Breaking news..." }
Faster lightweight analysis
Returns: Quick verdict JSON

POST /api/analyze/social

Input: { "post_text": "...", "platform": "twitter" }
Returns: Full analysis JSON

POST /api/analyze/image

Input: multipart/form-data image file
Extract text using pytesseract OCR
Run analysis on extracted text
Returns: Full analysis JSON + extracted text

POST /api/chat

Input: { "message": "...", "article_context": "...", "analysis_results": {}, "chat_history": [] }
Returns: { "reply": "..." }

GET /api/health

Returns: { "status": "ok" }


Full Analysis JSON Response:
json{
  "verdict": "FAKE",
  "confidence_score": 87.3,
  "ml_score": 85.0,
  "ai_score": 89.0,
  "source_score": 30.0,
  "ai_explanation": "This article contains several hallmarks of misinformation including...",
  "red_flags": [
    "Highly emotional and sensationalist language",
    "No credible sources cited",
    "Unknown or unreliable domain",
    "Exaggerated claims without evidence"
  ],
  "source_credibility": {
    "domain": "fakenewssite.com",
    "credibility_rating": 1.5,
    "is_known_fake_site": true,
    "domain_age_years": 0.5,
    "has_https": true,
    "bias_rating": "extreme",
    "verdict": "Known Misinformation Source"
  },
  "content_analysis": {
    "emotional_language_score": 85,
    "clickbait_score": 78,
    "writing_quality_score": 40,
    "factual_claim_density": 20,
    "has_citations": false,
    "has_statistics": false
  },
  "similar_verified_news": [
    {
      "headline": "Real version of this story from BBC",
      "source": "BBC News",
      "url": "https://bbc.com/...",
      "date": "2025-03-15",
      "is_verified": true
    }
  ],
  "recommendation": "DO NOT SHARE",
  "detailed_report": "Full markdown report text here..."
}

🧠 ML Engine (ml_engine.py)
Build a real fake news ML detection engine:
python# Step 1 — Text Preprocessing
# - Lowercase, remove punctuation
# - Remove stopwords using NLTK
# - Tokenize and lemmatize

# Step 2 — Feature Extraction
# TF-IDF Vectorizer on cleaned text
# Additional features:
features = {
    "text_length": len(text),
    "exclamation_count": text.count("!"),
    "question_count": text.count("?"),
    "caps_ratio": sum(1 for c in text if c.isupper()) / len(text),
    "avg_word_length": avg word length,
    "unique_word_ratio": unique words / total words,
    "has_sources": bool(re.search(source_patterns, text)),
    "emotional_words_count": count from emotional_words_list
}

# Step 3 — Model
# Train a PassiveAggressiveClassifier on LIAR dataset
# OR use pre-trained model saved with joblib
# model = joblib.load("data/fake_news_model/model.pkl")
# vectorizer = joblib.load("data/fake_news_model/vectorizer.pkl")

# Step 4 — Prediction
# Returns: { "label": "FAKE", "confidence": 0.873 }

# Step 5 — Fallback
# If model not available, use rule-based scoring
# Based on: caps ratio, exclamation marks,
# emotional language, missing sources etc.

🔍 Content Extractor (content_extractor.py)
python# For URLs — use newspaper3k
from newspaper import Article
article = Article(url)
article.download()
article.parse()
return {
    "title": article.title,
    "text": article.text,
    "authors": article.authors,
    "publish_date": article.publish_date,
    "source_url": url
}

# For Images — use pytesseract OCR
from PIL import Image
import pytesseract
text = pytesseract.image_to_string(Image.open(image_path))
return {"extracted_text": text}

🔐 Source Credibility Checker (source_checker.py)
python# Known fake news sites list (stored in known_fake_sites.json)
KNOWN_FAKE_SITES = [
    "fakenews.com", "worldnewsdailyreport.com",
    "empirenews.net", "thelastlineofdefense.org"
    # 50+ known fake sites
]

# Trusted sources list
TRUSTED_SOURCES = [
    "bbc.com", "reuters.com", "apnews.com",
    "ndtv.com", "thehindu.com", "hindustantimes.com",
    "nytimes.com", "theguardian.com"
    # 50+ trusted sources
]

# Check domain age using whois
# Check HTTPS
# Check against known fake/trusted lists
# Return credibility score 0-100

🤖 Claude Service (claude_service.py)
For Analysis — System Prompt:
You are TruthLens AI, an expert fact-checker and misinformation analyst with deep expertise in journalism, media literacy, and digital forensics. Analyze the provided news content and give a detailed assessment of its credibility. Identify specific red flags, logical fallacies, emotional manipulation, missing context, and unverified claims. Also suggest where the reader can find verified information on this topic. Always be objective, evidence-based, and explain your reasoning clearly. Return your response in valid JSON format only.
For Chatbot — System Prompt:
You are TruthLens AI Assistant, a friendly and knowledgeable fact-checking chatbot. You have already analyzed a news article and have the full analysis results. Help the user understand why the content is fake or real, answer their questions about the specific article, explain misinformation tactics being used, and guide them toward verified sources. Be conversational, educational, and empowering. Help users become better at identifying fake news themselves.

📄 Report Generator (report_generator.py)
python# Generate downloadable PDF report using reportlab
# Include: Verdict, Score, Red Flags, Source Analysis,
# Content Analysis, AI Explanation, Recommendations
# Branded with TruthLens logo and colors

🔧 Setup Instructions (README.md):
bash# Backend setup
cd backend
pip install -r requirements.txt

# Install Tesseract OCR (for image analysis)
# Windows: Download from GitHub
# Mac: brew install tesseract
# Linux: sudo apt install tesseract-ocr

# Setup environment
cp .env.example .env
# Add ANTHROPIC_API_KEY in .env

# Run backend
uvicorn main:app --reload --port 8000

# Frontend setup
cd frontend
npm install
npm run dev

# .env variables
ANTHROPIC_API_KEY=your_key_here
VITE_API_URL=http://localhost:8000

CORS setup:
pythonapp.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

Complete Folder Structure:
truthlens/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   ├── routers/
│   │   ├── analyze.py
│   │   └── chat.py
│   ├── services/
│   │   ├── content_extractor.py
│   │   ├── ml_engine.py
│   │   ├── source_checker.py
│   │   ├── claude_service.py
│   │   └── report_generator.py
│   ├── models/
│   │   ├── request_models.py
│   │   └── response_models.py
│   ├── data/
│   │   ├── fake_news_model/
│   │   ├── known_fake_sites.json
│   │   └── trusted_sources.json
│   └── utils/
│       ├── text_preprocessor.py
│       └── image_ocr.py
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── NewsContext.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ConfidenceMeter.jsx
    │   │   ├── ChatBot.jsx
    │   │   ├── VerdictBanner.jsx
    │   │   └── FileUpload.jsx
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Analyze.jsx
    │   │   └── Results.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
Build the complete frontend and backend. Make sure all 5 input types work, ML model runs real predictions, Claude API gives detailed explanations, chatbot has full context awareness, and PDF report downloads correctly