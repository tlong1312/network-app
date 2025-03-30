import './App.css';
import Navbar from './components/HomePage/Navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchPage from "./components/SearchPage/searchPage";
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/login';
import PersonalPage from './components/PersonalPage/Personal';
import PostStatistics from './components/Admin/PostStatistics/PostStatistics';

function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/login" element={<LoginPage />} />
    //   </Routes>
    //   <Navbar />
    //   <Routes>
    //     <Route path="/" element={<HomePage />} />
    //   </Routes>
    //   <Routes>
    //     <Route path="/search" element={<SearchPage />} />
    //   </Routes>
    //   <Routes>
    //     <Route path="/personal" element={<PersonalPage />} />
    //   </Routes>
    // </Router>
    <PostStatistics/>
  );
}
export default App
