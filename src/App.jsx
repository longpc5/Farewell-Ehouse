import { useState, useEffect } from 'react'
import heroImg from './assets/hero.png'
import { supabase } from "./services/supabase";
import { Routes, Route } from 'react-router-dom';
import LetterPage from './pages/Letter';
import LoginPage from './pages/Login';

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
      {/* <Route path="/intro" element={<IntroductionPage />} /> */}
      <Route path="/letter" element={<LetterPage/>} />
      {/* <Route path="/farewell" element={<FarewellPage />} /> */}
      {/* <Route path="/guestbook" element={<GuestbookPage />} /> */}
    </Routes>
  )
}

export default App
