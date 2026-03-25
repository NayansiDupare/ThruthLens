# TruthLens - AI-Powered Fake News Detection System 🔍

TruthLens is a complete, AI-powered fake news detection platform. Built with a React + Tailwind CSS frontend and a robust Python + FastAPI backend, it utilizes Machine Learning models combined with Anthropic's Claude API to detect misinformation across multiple content types.

![TruthLens](https://via.placeholder.com/800x400.png?text=TruthLens+-+Fake+News+Detection)

## ✨ Key Features

- **Multi-Input Analysis**: Detect fake news from 5 different sources:
  - 📝 Text Articles
  - 🔗 URLs (Auto-scraped using `newspaper3k`)
  - 📰 Headlines
  - 📱 Social Media Posts
  - 🖼️ Images/Screenshots (OCR via `pytesseract`)
- **Advanced Scoring System**:
  - ML Model Score (Heuristics & Text Analysis)
  - AI Analysis Score (Anthropic Claude API)
  - Source Credibility Score (Domain Age, Bias, HTTPS, Known Fake Sites)
- **AI Explanations**: Detailed reasoning with key red flags and credible indicators highlighted.
- **Similar Verified News**: Cross-references claims and suggests similar verified articles from trusted sources.
- **TruthLens AI Chatbot**: A contextual chatbot that lets you discuss the analyzed news, ask questions, and understand why content is fake or real.
- **Detailed PDF Reports**: Generate and download structural breakdown reports of the analysis.
- **Modern UI/UX**: "Trust & Truth" design direction using Slate, Blue, Emerald, and Amber color palettes with responsive Web Design.

## 🛠️ Technology Stack

**Frontend**:
- React.js (Vite)
- Tailwind CSS
- React Router v6
- Axios & Context API
- Lucide React (Icons)
- React Dropzone

**Backend**:
- Python 3.9+
- FastAPI & Uvicorn
- Anthropic Claude API (`gpt-4o-mini` proxy or Claude native)
- Scikit-Learn, NLTK, Pandas, Numpy (ML Engine)
- BeautifulSoup4, Newspaper3k (Web Scraping)
- Pillow, PyTesseract (Image OCR)
- WebSockets (Chatbot streaming)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Python 3.9+
- Tesseract OCR (Required for Image Analysis features)
  - **Windows**: Download [Tesseract installer](https://github.com/UB-Mannheim/tesseract/wiki)
  - **Mac**: `brew install tesseract`
  - **Linux**: `sudo apt install tesseract-ocr`

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Virtual Environment:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Mac/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your Environment Variables:
   - Copy `.env.example` to `.env`
   - Add your Anthropic or OpenAI API Key:
     ```env
     OPENAI_API_KEY=your_api_key_here
     ```
5. Run the server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
truthlens/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   ├── routers/          # API logic (analyze, chat)
│   ├── services/         # Core business logic (ML, OCR, LLM Integration)
│   ├── models/           # Pydantic schemas
│   ├── data/             # Trust directories (fake/trusted sources)
│   └── utils/            # Helper scripts (Text Preprocessing)
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI components (Navbar, ChatBot, Visuals)
    │   ├── pages/        # Main route views (Landing, Analyze, Results)
    │   ├── context/      # Context API for State management
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── tailwind.config.js
```

## 🔐 Security & Content Notes

- Ensure you do not commit your `.env` file to version control.
- API Keys are entirely managed securely by the backend and are not exposed to the client.
- The chatbot operates over a persistent WebSocket connection (`/api/chat/ws`).

## 📄 License
This project is open-source and available for educational purposes.
