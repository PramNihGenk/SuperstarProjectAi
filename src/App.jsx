import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import LandingPage   from "./pages/LandingPage";
import Dashboard     from "./pages/Dashboard";
import FormPage      from "./pages/FormPage";
import SplashScreen  from "./components/SplashScreen";
import CustomCursor  from "./components/CustomCursor";

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      <CustomCursor />
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <BrowserRouter>
        <Routes>
          <Route path="/"          element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />}   />
          <Route path="/form"      element={<FormPage />}    />
        </Routes>
      </BrowserRouter>
    </>
  );
}
