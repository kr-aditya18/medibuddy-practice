import { Routes, Route } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import DetailPage from "./pages/DetailPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/medicine/:id" element={<DetailPage />} />
    </Routes>
  );
}

export default App;