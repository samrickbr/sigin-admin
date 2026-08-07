import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from "../../components/layout/MainLayout";
import { AuthGuard } from "../../guards/AuthGuard";
import LoginPage from "../../auth/pages/LoginPage";
import DashboardPage from "../../modules/dashboard/pages/DashboardPage";


export function AppRouter() {
    return (
      <Routes>
        {/* Redirecionamento inicial */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Área Administrativa protegida */}
        <Route element={<AuthGuard />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Route>
      </Routes>
    );
}