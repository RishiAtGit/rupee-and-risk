import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import DeepDivesPage from './pages/DeepDivesPage';
import EarningsPage from './pages/EarningsPage';
import GrowthTriggersPage from './pages/GrowthTriggersPage';
import PricingPage from './pages/PricingPage';
import LegalPage from './pages/LegalPage';
import ProDashboardPage from './pages/ProDashboardPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  const location = useLocation();
  const isDashboard = location.pathname === '/pro-dashboard';

  if (isDashboard) {
    return (
      <Routes>
        <Route path="/pro-dashboard" element={
          <ProtectedRoute>
            <ProDashboardPage />
          </ProtectedRoute>
        } />
      </Routes>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/deep-dives" element={<DeepDivesPage />} />
          <Route path="/deep-dives/:ticker" element={<ArticlePage />} />
          <Route path="/earnings" element={<EarningsPage />} />
          <Route path="/earnings-summary" element={<ArticlePage />} />
          <Route path="/growth-triggers" element={<GrowthTriggersPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;