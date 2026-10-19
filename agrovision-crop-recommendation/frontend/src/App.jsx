import React from 'react';
import { LanguageProvider } from './i18n';
import Navbar from './components/Navbar';
import CropRecommendationPage from './components/CropRecommendationPage';
import Footer from './components/Footer';

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
        <Navbar />
        <main className="flex-1">
          <CropRecommendationPage />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
