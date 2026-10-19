<h1 align="center">
  🌾 AgroVision AI
</h1>

<p align="center">
  <strong>AI-Powered Smart Farming Platform for Indian Farmers</strong><br/>
  Crop Recommendation · Crop Disease Detection · AI Farming Advisor · Mandi Price Intelligence
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Flask-3-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask"/>
  <img src="https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Running the Services](#running-the-services)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Disclaimer](#disclaimer)

---

## 🌱 Overview

**AgroVision AI** is a modern, mobile-friendly smart farming platform designed to empower Indian farmers with AI-driven insights. The platform combines machine learning, real-time agricultural data, and conversational AI into a single, easy-to-use Farmer Dashboard.

> Built feature-by-feature as a modular architecture — each feature is independently developed and then integrated into the unified Farmer Dashboard.

---

## ✨ Features

### 🌿 1. Farmer Dashboard
A premium, card-based landing page that surfaces the most critical farm metrics at a glance:
- Live crop health status, soil condition, and weather
- Disease alerts and irrigation schedule
- Quick-action shortcuts to all major features
- Responsive design — works on mobile, tablet, and desktop
- Bilingual support (English + Hindi)

### 🌾 2. Crop Recommendation
Recommends the best crop for a farmer's conditions using a trained ML model:
- Input: Nitrogen, Phosphorus, Potassium, Soil pH, Temperature, Humidity, Rainfall
- 5 regional presets (Punjab Wheat, Coastal Rice, Rajasthan, Maharashtra, Northeast)
- Suitability scoring with "Why this crop?" explanation matrix
- Powered by a Scikit-Learn SVC model (`best_model_crop.pkl`)

### 🦠 3. Crop Disease Detection
Identifies crop diseases from leaf images using a computer vision model:
- Drag-and-drop or camera-capture image upload
- Disease name, severity badge (Low / Medium / High / Critical), confidence meter
- Phased treatment plan and prevention recommendations
- Text-to-Speech (TTS) audio readout for farmer accessibility
- Powered by the standalone `crop-disease-detection` backend (port 5001)

### 🤖 4. AI Farming Advisor
A conversational AI assistant that answers agriculture questions in natural language:
- Category pills: Crop Management, Disease & Pests, Soil & Nutrition, Weather & Irrigation, Govt. Schemes, Mandi & Selling
- Multi-provider LLM support: Google Gemini, OpenAI, Groq
- Falls back to a built-in agronomy expert engine (no API key required)
- Live farm context injection (location, weather, soil data, current prices)
- Government scheme information: PM-KISAN, PMFBY, KCC, PM-KUSUM, SMAM, Soil Health Card
- Bilingual: auto-detects Hindi (Devanagari script), responds in Hindi or English
- Session history persisted in localStorage

### 📈 5. Mandi Price Intelligence
Real-time market intelligence for agricultural commodity prices:
- Simulated Mandi rates (Modal, Min, Max, Spread) across 30+ mandis
- Multi-mandi price comparison bar charts
- 7-Day / 30-Day / 3-Month historical price trajectory
- AI-based future price prediction with trend direction and confidence
- Farmer-friendly market insights (किसान सलाह)

### 🌤️ 6. Weather Intelligence
Detailed weather information and agricultural advisories for the farm location.

### 💧 7. Irrigation Advice
Irrigation scheduling and water management recommendations based on crop stage and soil moisture.

---

## 🏗️ Architecture

```
AgroVision AI (Monorepo)
│
├── Frontend (React + TypeScript + Vite)         → Port 5174
│   ├── Farmer Dashboard
│   ├── Crop Recommendation UI
│   ├── Crop Disease Detection UI
│   ├── AI Advisor Chat UI
│   ├── Mandi Price Intelligence UI
│   ├── Weather Intelligence UI
│   └── Irrigation Advice UI
│
├── Backend: Crop Recommendation + AI Advisor    → Port 5000
│   ├── POST /api/crop-recommendation/predict
│   ├── POST /api/ai-advisor/chat
│   ├── GET  /api/ai-advisor/health
│   └── GET  /api/ai-advisor/schemes
│
└── Backend: Crop Disease Detection              → Port 5001
    └── POST /api/predict
```

Vite proxies all `/api/*` requests to the appropriate backend automatically during development.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 + TypeScript 6 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Charts | Recharts |
| Backend (Recommendation + Advisor) | Python 3.10+ · Flask 3 · Flask-CORS |
| ML Model (Crop Recommendation) | Scikit-Learn SVC |
| ML Model (Disease Detection) | TensorFlow / PyTorch (separate repo) |
| AI Advisor | Google Gemini / OpenAI / Groq (with local fallback) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Python](https://www.python.org/) 3.10+
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/NancySheokand5/AgrovisionAI.git
cd AgrovisionAI
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Set Up Crop Recommendation Backend

```bash
cd agrovision-crop-recommendation/backend
pip install -r requirements.txt
```

### 4. Set Up Crop Disease Detection Backend

The disease detection backend lives in a separate directory. See the [Crop Disease Detection README](https://github.com/NancySheokand5/AgrovisionAI) for its setup instructions.

---

## ▶️ Running the Services

You need **three terminal windows** running simultaneously:

#### Terminal 1 — Frontend (React)
```bash
# From project root: AgrovisionAI/
npm run dev
# Runs at http://localhost:5174
```

#### Terminal 2 — Crop Recommendation + AI Advisor Backend
```bash
# From project root: AgrovisionAI/
cd agrovision-crop-recommendation/backend
python run.py
# Runs at http://localhost:5000
```

#### Terminal 3 — Crop Disease Detection Backend
```bash
# From your crop-disease-detection project directory
cd backend
python app.py
# Runs at http://localhost:5001
```

Open **http://localhost:5174** in your browser.

---

## ⚙️ Environment Variables

Copy the example file and fill in your API keys:

```bash
cp agrovision-crop-recommendation/backend/.env.example agrovision-crop-recommendation/backend/.env
```

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Optional | Google Gemini API key for the AI Advisor |
| `OPENAI_API_KEY` | Optional | OpenAI API key (fallback LLM) |
| `GROQ_API_KEY` | Optional | Groq API key (fastest fallback LLM) |
| `FLASK_PORT` | Optional | Backend port (default: 5000) |
| `CORS_ORIGINS` | Optional | Comma-separated allowed origins |

> **Note:** If no API key is provided, the AI Advisor automatically falls back to a built-in agronomy expert engine with pre-verified agricultural knowledge.

---

## 📁 Project Structure

```
AgrovisionAI/
├── src/
│   ├── components/
│   │   ├── dashboard/          # Farmer Dashboard + navigation
│   │   ├── recommendation/     # Crop Recommendation page
│   │   ├── disease/            # Crop Disease Detection page
│   │   ├── advisor/            # AI Farming Advisor chat UI
│   │   ├── weather/            # Weather Intelligence page
│   │   ├── irrigation/         # Irrigation Advice page
│   │   └── Header.tsx          # Global navigation header
│   ├── services/               # API service layer (client-side fetch)
│   ├── types/                  # TypeScript type definitions
│   ├── data/                   # Mock/seed data for demo mode
│   ├── App.tsx                 # Root component and routing
│   └── main.tsx                # Application entry point
├── agrovision-crop-recommendation/
│   └── backend/
│       ├── routes/
│       │   ├── crop_recommendation.py
│       │   └── ai_advisor.py
│       ├── services/
│       │   └── crop_predictor.py
│       ├── data/
│       │   ├── crop_knowledge.json      # Agronomic data for 11 crops
│       │   └── government_schemes.json  # 6 verified government schemes
│       ├── models/
│       │   └── best_model_crop.pkl      # Trained SVC model
│       ├── app.py
│       ├── run.py
│       └── requirements.txt
├── public/
├── index.html
├── vite.config.ts
├── package.json
└── tsconfig.json
```

---

## 🗺️ Roadmap

- [x] Mandi Price Intelligence Module
- [x] Farmer Dashboard UI
- [x] Crop Recommendation (ML-powered)
- [x] Crop Disease Detection (Computer Vision)
- [x] AI Farming Advisor (Conversational AI)
- [x] Weather Intelligence
- [x] Irrigation Advice
- [ ] Live eNAM / AGMARKNET API integration
- [ ] Soil Health Card integration
- [ ] Real-time IoT sensor data (soil moisture, temperature)
- [ ] Multi-language support (Tamil, Telugu, Marathi, Bengali)
- [ ] Mobile app (React Native)
- [ ] Full platform integration and deployment

---

## ⚠️ Disclaimer

All market prices, arrivals, crop data, and price forecasts currently displayed are realistic **simulated demonstration data**. AI predictions and recommendations are prototype estimates. This platform does not constitute financial, commercial, or agronomic guarantees. Always consult local agricultural experts and official government sources for critical farming decisions.

---

<p align="center">
  Made with ❤️ for Indian Farmers &nbsp;|&nbsp; AgroVision AI
</p>
