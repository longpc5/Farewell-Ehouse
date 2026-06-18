import { Routes, Route, useLocation } from 'react-router-dom';
import LetterPage from './pages/Letter';
import LoginPage from './pages/Login';
import FarewellPage from './pages/Farewell';
import IntroPage from './pages/Intro';
import GuestbookPage from './pages/Guestbook';
import EndingPage from './pages/End';
import ProtectedRoute from './components/ProtectedRoute';
import MusicPlayer from './components/MusicPlayer';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const location = useLocation();
  const showPlayer = location.pathname !== "/";

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/intro" element={
          <ProtectedRoute><IntroPage /></ProtectedRoute>
        } />
        <Route path="/letter" element={
          <ProtectedRoute><LetterPage /></ProtectedRoute>
        } />
        <Route path="/farewell" element={
          <ProtectedRoute><FarewellPage /></ProtectedRoute>
        } />
        <Route path="/guestbook" element={
          <ProtectedRoute><GuestbookPage /></ProtectedRoute>
        } />
        <Route path="/end" element={
          <ProtectedRoute><EndingPage /></ProtectedRoute>
        } />
      </Routes>
      {showPlayer && <MusicPlayer />}
      <Analytics />
    </>
  )
}

export default App
