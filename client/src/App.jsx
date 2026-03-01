import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import VotePage from './pages/VotePage';
import VotingSessionPage from './pages/VotingSessionPage';
import ResultsPage from './pages/ResultsPage';
import SharedResultsPage from './pages/SharedResultsPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vote" element={<VotingSessionPage />} />
        <Route path="/vote/:id" element={<VotePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/shared/:token" element={<SharedResultsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Layout>
  );
}
