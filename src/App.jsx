import './App.css';
import Navbar from './components/HomePage/Navbar';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchPage from "./components/SearchPage/searchPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/search" element={<SearchPage />} />  
      </Routes>
    </Router>
  );
}

export default App;
