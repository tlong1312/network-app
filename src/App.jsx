import './App.css';
import Navbar from './components/HomePage/Navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchPage from "./components/SearchPage/searchPage";
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/login';
import PersonalPage from './components/PersonalPage/Navbar';

function App() {
  return (
    // <Router>
    //   <Navbar />
    //   <Routes>
    //     <Route path="/" element={<HomePage />} />
    //   </Routes>
    //   <Routes>
    //     <Route path="/search" element={<SearchPage />} />
    //   </Routes>
    // </Router>
    // <LoginPage />
    <PersonalPage />
  );
}
export default App
