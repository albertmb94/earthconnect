import { BrowserRouter, Routes, Route, Navigate, Link, useParams } from 'react-router-dom';
import { I18nProvider } from './lib/i18n';
import { Navbar } from './components/Navbar';
import { CookieBanner } from './components/CookieBanner';
import { Landing } from './routes/Landing';
import { ServicePage } from './routes/ServicePage';
import { MarketingPage } from './routes/MarketingPage';
import { Login } from './routes/Login';
import { AdminDashboard } from './routes/AdminDashboard';
import { AdminCarriersPage } from './routes/AdminCarriersPage';
import { AdminSourcingPage } from './routes/AdminSourcingPage';
import { AdminProposalsPage } from './routes/AdminProposalsPage';
import { AdminProposalBuilder } from './routes/AdminProposalBuilder';
import { AdminCommissionDashboard } from './routes/AdminCommissionDashboard';
import { BuyerLogin } from './routes/BuyerLogin';
import { BuyerDashboard } from './routes/BuyerDashboard';
import { getBuyerAuth, getAdminAuth } from './lib/auth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuth = !!getAdminAuth();
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
};

const BuyerRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = getBuyerAuth();
  return auth ? <>{children}</> : <Navigate to="/en/buyer-login" replace />;
};

// Carrier routes HIDDEN — Master Agent pivot. Keep imports commented for potential future use.
// import { CarrierLogin } from './routes/CarrierLogin';
// import { CarrierDashboard } from './routes/CarrierDashboard';
// const CarrierRoute = ...;

const RemovedPageRedirect = () => {
  const { lang } = useParams();
  return <Navigate to={`/${lang || 'en'}/solutions`} replace />;
};

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
              
              {/* Auth & Admin */}
              <Route path="/login" element={<Login />} />
              <Route path="/:lang/login" element={<Login />} />
              <Route path="/:lang/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/:lang/admin/carriers" element={<ProtectedRoute><AdminCarriersPage /></ProtectedRoute>} />
              <Route path="/:lang/admin/sourcing" element={<ProtectedRoute><AdminSourcingPage /></ProtectedRoute>} />
              <Route path="/:lang/admin/proposals" element={<ProtectedRoute><AdminProposalsPage /></ProtectedRoute>} />
              <Route path="/:lang/admin/proposals/build/:requestId" element={<ProtectedRoute><AdminProposalBuilder /></ProtectedRoute>} />
              <Route path="/:lang/admin/commissions" element={<ProtectedRoute><AdminCommissionDashboard /></ProtectedRoute>} />

              {/* HIDDEN: /admin/requests, /admin/quotes — replaced by Sourcing + Proposals above */}

              {/* Buyer Portal */}
              <Route path="/:lang/buyer-login" element={<BuyerLogin />} />
              <Route path="/:lang/buyer" element={<BuyerRoute><BuyerDashboard /></BuyerRoute>} />

              {/* HIDDEN: Carrier Portal — Master Agent pivot */}

              {/* Solutions Overview (must be before generic /:section/:slug) */}
              <Route path="/:lang/solutions" element={<MarketingPage />} />

              {/* Redirects for removed pages (must be before generic /:section/:slug) */}
              <Route path="/:lang/solutions/sase-security" element={<RemovedPageRedirect />} />
              <Route path="/:lang/solutions/cybersecurity" element={<RemovedPageRedirect />} />
              <Route path="/:lang/solutions/pots-replacement" element={<RemovedPageRedirect />} />
              <Route path="/:lang/solutions/voice-collaboration" element={<RemovedPageRedirect />} />

              <Route path="/:lang/:section/:slug" element={<MarketingPage />} />

              {/* Programmatic SEO Dynamic Routes */}
              <Route path="/:lang/:service/:country/:city" element={<ServicePage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer with Discreet Admin Link */}
          <footer className="py-12 px-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-zinc-500 text-xs font-medium">
                © {new Date().getFullYear()} EarthConnect. All rights reserved.
              </div>
              <div className="flex gap-6">
                <Link to="/en/login" className="text-zinc-300 dark:text-zinc-800 text-[10px] uppercase tracking-widest hover:text-zinc-500 transition-colors">
                  Partner Portal
                </Link>
              </div>
            </div>
          </footer>

          {/* Compliance RGPD Banner */}
          <CookieBanner />
        </div>
      </I18nProvider>
    </BrowserRouter>
  );
}
