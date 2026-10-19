# AgroVision AI — AI Crop Recommendation (Feature 3)

[![Python](https://img.shields.io/badge/Python-3.10%2B-brightgreen)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Backend-Flask-green)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-blue)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20v4-teal)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> **AgroVision AI Project Roadmap Context:**  
> This application implements **Feature 3: AI Crop Recommendation** as a complete, standalone module designed for seamless future integration into the unified AgroVision AI agricultural intelligence platform (alongside Feature 1: Mandi Price Prediction and Feature 2: Crop Disease Detection).

---

## 🌾 Core Features & Capabilities

- **Intelligent Soil & Weather Diagnostic Input:**
  - **Soil Nutrients:** Nitrogen ($N$), Phosphorus ($P$), and Potassium ($K$) with live sliders, numeric bounds, and agronomic role indicators.
  - **Soil Condition:** Interactive visual Soil pH slider with an active chromatic scale (Acidic $\leftarrow$ Neutral $\rightarrow$ Alkaline) and live soil condition interpretation.
  - **Weather Parameters:** Ambient Temperature ($^\circ\text{C}$), Relative Humidity ($\%$), and Rainfall ($\text{mm}$).
  - **Optional Farm Profile:** State, District, Planting Season (Kharif, Rabi, Zaid, Annual), and Farm Size in Acres.
- **Explainable Agronomic AI ("Why AgroVision recommends this crop"):**
  - Factor-by-factor breakdown comparing entered farmer conditions with standard agronomic requirements.
  - Transparent match indicators: **Optimal Match ✓**, **Suitable / Tolerated**, and **Needs Monitoring**.
- **Honest Suitability Metric:**
  - Evaluates parameter conformity without deceptive "99.55% guaranteed accuracy" marketing claims.
- **Alternative Crop Options:**
  - Multi-class SVM decision margin ranking reveals genuine runner-up options (2nd and 3rd choices) without fabricating classes.
- **Comprehensive Agronomic Dossier:**
  - Growing season, crop cycle duration, water requirement, soil preference, fertilizer and irrigation care tips, and harvest signs.
- **Farmer-Centric Accessibility:**
  - **Multi-language Support:** Full English and Hindi ($\text{हिन्दी}$) localization with an extensible architecture for Punjabi and Haryanvi.
  - **Text-to-Speech (Listen Guidance):** Browser Web Speech Synthesis reading out the crop recommendation and key care instructions in the selected language.
  - **1-Click Test Presets:** Realistic pre-configured conditions for Kharif Rice, Rabi Chickpea, Banana Plantation, and Arid Moth Bean.
- **Recommendation History:**
  - LocalStorage persistence tracking timestamp, location, crop, and key condition metrics (designed with a schema ready for MongoDB sync).
- **Downloadable & Printable Report:**
  - Generates a branded AgroVision AI Crop Recommendation Dossier with printable styling (`window.print()`).

---

## 🏛️ Architecture & Project Structure

```
agrovision-crop-recommendation/
├── backend/
│   ├── app.py                      # Flask microservice app factory & CORS
│   ├── run.py                      # Server launcher on port 5000
│   ├── test_api.py                 # Automated verification test suite
│   ├── requirements.txt            # Backend dependencies
│   ├── routes/
│   │   ├── __init__.py
│   │   └── crop_recommendation.py  # Endpoints: /api/crop-recommendation, /crops, /sample-conditions, /health
│   ├── services/
│   │   ├── __init__.py
│   │   └── crop_predictor.py       # Model loader, SVM inference & agronomic explainability
│   ├── models/
│   │   └── best_model_crop.pkl     # Trained Scikit-Learn Pipeline (StandardScaler + SVC)
│   ├── data/
│   │   └── crop_knowledge.json     # Agronomic profiles for 11 crops (English & Hindi)
│   └── utils/
│       ├── __init__.py
│       └── validators.py           # Farmer-friendly input bounds & format validators
├── frontend/
│   ├── index.html                  # Branded entry page with agricultural typography
│   ├── package.json
│   ├── vite.config.js              # Vite 8 config with Tailwind v4 & backend proxy
│   └── src/
│       ├── App.jsx                 # Root layout with LanguageProvider
│       ├── main.jsx
│       ├── index.css               # Tailwind CSS v4 styling & print media styles
│       ├── i18n/
│       │   ├── index.jsx           # Translation context hook
│       │   ├── en.json             # English language bundle
│       │   └── hi.json             # Hindi language bundle
│       ├── services/
│       │   ├── api.js              # Fetch client communicating with backend
│       │   └── historyStorage.js   # LocalStorage history manager
│       └── components/
│           ├── Navbar.jsx          # Top navigation with AgroVision branding & language selector
│           ├── HeroSection.jsx     # Hero banner with 1-click test preset chips
│           ├── FarmInputForm.jsx   # Form container with client-side validation
│           ├── NPKInput.jsx        # Nitrogen, Phosphorus, Potassium cards & sliders
│           ├── PHSlider.jsx        # Visual Acidic-Neutral-Alkaline scale
│           ├── WeatherInputCard.jsx# Temperature, Humidity, Rainfall inputs
│           ├── OptionalFarmCard.jsx# State, District, Season & Farm Size
│           ├── AnalysisLoader.jsx  # Multi-step progress animation
│           ├── RecommendationResult.jsx # Result showcase
│           ├── SuitabilityIndicator.jsx # Honest agronomic match index
│           ├── WhyThisCrop.jsx     # Factor-by-factor explainability
│           ├── VisualOverview.jsx  # Compact parameter progress meters
│           ├── CropInformationCard.jsx # Agronomic guide & cultural practices
│           ├── AlternativeCropCard.jsx # Runner-up options
│           ├── ConditionSummary.jsx# Entered values summary with edit button
│           ├── RecommendationHistory.jsx# Saved history list
│           ├── VoiceButton.jsx     # SpeechSynthesis audio narration
│           ├── ReportModal.jsx     # Printable recommendation dossier
│           ├── LanguageSelector.jsx# English / Hindi switcher
│           └── Footer.jsx          # Agricultural disclaimer & roadmap links
└── README.md
```

---

## 🚀 Running the Project Locally

### 1. Start the Flask Backend

```bash
cd agrovision-crop-recommendation
python backend/run.py
```
The backend starts at `http://127.0.0.1:5000`.

### 2. Start the React Frontend

In another terminal window:

```bash
cd agrovision-crop-recommendation/frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Testing the API

Run the automated integration test suite:

```bash
python backend/test_api.py
```

This verifies:
1. Model loading at startup.
2. Accurate multi-crop inference for Rice, Chickpea, Banana, and Mothbean.
3. Feature ordering integrity (`['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']`).
4. Rejection of invalid inputs (missing fields, extreme pH $< 3.5$, negative rainfall, non-numeric values) with friendly farmer error messages.

---

## 🛡️ Agricultural Advisory & Disclaimer

This AI recommendation tool serves as an assistive advisory guide based on benchmark agricultural datasets. For commercial planting decisions, farmers should combine digital recommendations with physical soil lab tests and guidance from their local **Krishi Vigyan Kendra (KVK)**.
