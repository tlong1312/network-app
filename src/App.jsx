import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import SearchPage from "./components/SearchPage/searchPage";
<<<<<<< HEAD
import RegisterPage from './components/RegisterPage/RegisterPage';
=======
import HomePage from './components/HomePage/HomePage';
>>>>>>> tlong


=======
import MainLayout from "./components/Layouts/MainLayout";
import AdminLayout from "./components/Layouts/AdminLayout";
import SearchPage from "./components/HomePage/SearchPage/searchPage";
import AdminLogin from "./components/Admin/Login";
import ProtectedRoute from "./components/Admin/ProtectedRoute";
import Dashboard from "./components/Admin/Content/Dashboard";
import HomePage from "./components/HomePage/HomePage";
import StatisticalManagement from "./components/Admin/Content/StatisticalManagement";
import UserManagement from "./components/Admin/Content/UserManagement";
import PostManagement from "./components/Admin/Content/PostManagement";
>>>>>>> duphan
function App() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
<<<<<<< HEAD
=======
        <Route path="/" element={<HomePage />} />
      </Routes>
      <Routes>
>>>>>>> tlong
        <Route path="/search" element={<SearchPage />} />
        <Route path="/register" element={<RegisterPage />} />
=======
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin" element={<AdminLayout />}>

          <Route element={<ProtectedRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="statistical-management" element={<StatisticalManagement />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="post-management" element={<PostManagement />} />
          </Route>
        </Route>

>>>>>>> duphan
      </Routes>
    </Router>
  );
}

export default App;