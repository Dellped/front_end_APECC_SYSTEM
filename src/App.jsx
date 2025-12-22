import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";
import ValidatePage from "./pages/ValidatePage";
import GeneratePage from "./pages/GeneratePage";
import SummaryPage from "./pages/SummaryPage";
import ArchivePage from "./pages/ArchivePage";
import CorporatePage from "./pages/CorporatePage";
import ValidationSummaryPage from "./pages/ValidationSummaryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route path="main" element={<Navigate to="/upload" replace />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="validate" element={<ValidatePage />} />
        <Route path="generate" element={<GeneratePage />} />
        <Route path="summary" element={<SummaryPage />} />
        <Route path="archive" element={<ArchivePage />} />
        <Route path="corporate" element={<CorporatePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
