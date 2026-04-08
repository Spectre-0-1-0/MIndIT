import { Routes, Route, Navigate, useParams } from 'react-router-dom';
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

const assessmentMap = {
  ghq12: <GHQ12 />,
  'flourishing-scale': <FlourishingScale />,
  'digital-stress-scale': <DigitalStressScale />,
  pss10: <PSS10 />,
  rses: <RSes />,
  bdi2: <Bdi2 />,
  bai: <Bai />,
};

function AssessmentRoute() {
  const { id } = useParams();
  const assessmentComponent = assessmentMap[id];

  if (!assessmentComponent) {
    return <Navigate to="/" replace />;
  }

  return <div className="space-y-8">{assessmentComponent}</div>;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-slate-50 to-white text-slate-900">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assessment/:id" element={<AssessmentRoute />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/udaan" element={<UdaanPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
