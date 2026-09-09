import { Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./components/HomePage";
import { Editor } from "./components/Editor";
import { FeedbackPage } from "./components/FeedbackPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/write" element={<Editor />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
