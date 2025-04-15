import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import AnalysisPage from "./pages/AnalysisPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/analysis" element={<AnalysisPage />} />
    </Routes>
  );
}