import { Route, Routes } from "react-router-dom";
import { MainLayout } from "../../components/layout/MainLayout";
import { AuthGuard } from "../../guards/AuthGuard";
import LoginPage from "../../auth/pages/LoginPage";

export function AppRouter() {
    return (
        <Routes>
            {/* Login */}
            <Route path="/login" element={<LoginPage />} />
            {/* Área Administrativa protegida */}
            <Route element={<AuthGuard />}>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<h1>Dashboard</h1>} />
                </Route>
            </Route>
        </Routes>
    );
}