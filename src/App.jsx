import { useState, useEffect } from 'react'
import heroImg from './assets/hero.png'
import { supabase } from "./services/supabase";
import { Routes, Route } from 'react-router-dom';
import LetterPage from './pages/Letter';
import LoginPage from './pages/Login';
import FarewellPage from './pages/Farewell';
import IntroPage from './pages/Intro';
import GuestbookPage from './pages/Guestbook';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // useEffect(() => {

  //   const testConnection = async () => {
  //     const { data, error } = await supabase
  //       .from("users")
  //       .select("*");

  //     console.log("DATA:", data);
  //     console.log("ERROR:", error);
  //   };

  //   const loadLetters = async () => {
  //     const { data, error } = await supabase
  //       .from("personal_letters")
  //       .select("*");
  //     console.log("Letter:", data);
  //     console.log("ERROR", error);

  //   };
  //   testConnection();
  //   loadLetters();


  // }, []);

  return (
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
  )
}

export default App
