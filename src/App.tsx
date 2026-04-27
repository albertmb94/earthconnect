import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './lib/i18n';
import { Navbar } from './components/Navbar';
import { CookieBanner } from './components/CookieBanner';
import { Landing } from './routes/Landing';
import { ServicePage } from './routes/ServicePage';
import { MarketingPage } from './routes/MarketingPage';

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans transition-colors duration-300">
          <Navbar />
          
          {/* Main content */}
          <main className="flex-grow">
            <Routes>
              {/* Landing pages */}
              <Route path="/" element={<Landing />} />
              <Route path="/en" element={<Landing />} />
              <Route path="/es" element={<Landing />} />
              <Route path="/:lang/:section/:slug" element={<MarketingPage />} />
              
              {/* Programmatic SEO Dynamic Routes */}
              <Route path="/:lang/:service/:country/:city" element={<ServicePage />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Compliance RGPD Banner */}
          <CookieBanner />
        </div>
      </I18nProvider>
    </BrowserRouter>
  );
}
