import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layouts/MainLayout";
import AdminLayout from "./components/Layouts/AdminLayout";
import SearchPage from "./components/HomePage/SearchPage/searchPage";
import ProtectedRoute from "./components/Admin/ProtectedRoute";
import HomePage from "./components/HomePage/HomePage";
import UserManagement from "./components/Admin/Content/UserManagement";
import PostManagement from "./components/Admin/Content/PostManagement";
import Login from './components/HomePage/LoginPage/login';
import InfoUser from './components/HomePage/InfoUser/InfoUser';
import RegisterPage from './components/HomePage/LoginPage/RegisterPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/RegisterPage" element={<RegisterPage />} />

                <Route element={<MainLayout />}>
                    <Route element={
                        <ProtectedRoute allowedRoles={["ROLE_USER"]} />
                    }>
                        <Route index element={<HomePage />} />
                        <Route path="search" element={<SearchPage />} />
                        <Route path="info-user" element={<InfoUser />} />
                        <Route path="info-user/:userId" element={<InfoUser />} />
                    </Route>
                </Route>

                <Route path="admin" element={<AdminLayout />}>
                    <Route
                        element={
                            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />
                        }
                    >
                        <Route index element={<UserManagement />} />
                        <Route path="user-management" element={<UserManagement />} />
                        <Route path="post-management" element={<PostManagement />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;