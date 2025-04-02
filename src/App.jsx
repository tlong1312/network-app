import './App.css';
import Navbar from './components/HomePage/Navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchPage from "./components/SearchPage/searchPage";
import RegisterPage from './components/RegisterPage/RegisterPage';
import AdminPost from './components/AdminPost/AdminPost';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/adminPost" element={<AdminPost />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
