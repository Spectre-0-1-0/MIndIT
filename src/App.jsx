import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ContactUs from './pages/ContactUs';
import UdaanPage from './pages/UdaanPage';
import ResultsPage from './pages/ResultsPage';
import GHQ12 from './pages/assessments/GHQ12';
import FlourishingScale from './pages/assessments/FlourishingScale';
import DigitalStressScale from './pages/assessments/DigitalStressScale';
import PSS10 from './pages/assessments/PSS10';
import RSes from './pages/assessments/RSes';
import Bdi2 from './pages/assessments/Bdi2';
import Bai from './pages/assessments/Bai';
import BFI10 from './pages/assessments/BFI10';
import BFI10Admin from './pages/assessments/BFI10Admin';

const assessmentMap = {
  ghq12: <GHQ12 />,
  'flourishing-scale': <FlourishingScale />,
  'digital-stress-scale': <DigitalStressScale />,
  pss10: <PSS10 />,
  rses: <RSes />,
  bdi2: <Bdi2 />,
  bai: <Bai />,
  bfi10: <BFI10 />,
};

function GlobalWaves() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-20">
      <svg className="absolute bottom-0 left-0 w-full h-[30vh]" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g className="parallax">
          <use href="#gentle-wave" x="48" y="0" fill="rgba(99, 102, 241, 0.4)">
            <animateTransform attributeName="transform" type="translate" from="-90 0" to="85 0" dur="15s" repeatCount="indefinite" />
          </use>
          <use href="#gentle-wave" x="48" y="3" fill="rgba(99, 102, 241, 0.6)">
            <animateTransform attributeName="transform" type="translate" from="-90 0" to="85 0" dur="10s" repeatCount="indefinite" />
          </use>
          <use href="#gentle-wave" x="48" y="5" fill="rgba(99, 102, 241, 0.2)">
            <animateTransform attributeName="transform" type="translate" from="-90 0" to="85 0" dur="20s" repeatCount="indefinite" />
          </use>
        </g>
      </svg>
    </div>
  );
}

function AssessmentRoute() {
  const { id } = useParams();
  const assessmentComponent = assessmentMap[id];

  if (!assessmentComponent) {
    return <Navigate to="/" replace />;
  }

  return <div className="space-y-8">{assessmentComponent}</div>;
}

function AdminRoute() {
  const location = useLocation();
  const hasEntryToken = location.state?.fromAssessmentStart || localStorage.getItem('bfi10AdminEntry');
  if (!hasEntryToken) {
    return <Navigate to="/assessment/bfi10" replace />;
  }
  return <BFI10Admin />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-slate-50 to-white text-slate-900 transition-colors duration-1000">
      <GlobalWaves />
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assessment/:id" element={<AssessmentRoute />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/udaan" element={<UdaanPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/bfi10-admin" element={<AdminRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
