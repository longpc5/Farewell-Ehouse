import { Routes, Route, useLocation } from 'react-router-dom';
import LetterPage from './pages/Letter';
import LoginPage from './pages/Login';
import FarewellPage from './pages/Farewell';
import IntroPage from './pages/Intro';
import GuestbookPage from './pages/Guestbook';
import ProtectedRoute from './components/ProtectedRoute';
import MusicPlayer from './components/MusicPlayer';

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
      </Routes>
      {showPlayer && <MusicPlayer />}
    </>
  )
}

export default App
