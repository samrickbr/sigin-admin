import CategoriasListPage from '../../modules/categorias/pages/CategoriasListPage';
import CategoriaFormPage from '../../modules/categorias/pages/CategoriaFormPage';

import CanaisVendaListPage from '../../modules/canais-venda/pages/CanaisVendaListPage';
import CanalVendaFormPage from '../../modules/canais-venda/pages/CanalVendaFormPage';

import { Navigate, Route, Routes } from 'react-router-dom';

import { MainLayout } from '../../components/layout/MainLayout';
import { AuthGuard } from '../../guards/AuthGuard';
import { PermissionGuard } from '../../guards/PermissionGuard';

import LoginPage from '../../auth/pages/LoginPage';
import DashboardPage from '../../modules/dashboard/pages/DashboardPage';

import ProdutosListPage from '../../modules/produtos/pages/ProdutosListPage';
import ProdutoFormPage from '../../modules/produtos/pages/ProdutoFormPage';

import PessoasListPage from '../../modules/pessoas/pages/PessoasListPage';
import PessoaFormPage from '../../modules/pessoas/pages/PessoaFormPage';

import UsuariosListPage from '../../modules/usuarios/pages/UsuariosListPage';
import UsuarioFormPage from '../../modules/usuarios/pages/UsuarioFormPage';
import ForbiddenPage from '../../modules/errors/pages/ForbiddenPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/403" element={<ForbiddenPage />} />
      
      <Route element={<AuthGuard />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/categorias" element={<CategoriasListPage />} />

          <Route path="/categorias/novo" element={<CategoriaFormPage />} />

          <Route path="/categorias/:id" element={<CategoriaFormPage />} />

          <Route path="/canais-venda" element={<CanaisVendaListPage />} />

          <Route path="/canais-venda/novo" element={<CanalVendaFormPage />} />

          <Route path="/canais-venda/:id" element={<CanalVendaFormPage />} />

          <Route element={<PermissionGuard permissao="PRODUTO_VISUALIZAR" />}>
            <Route path="/produtos" element={<ProdutosListPage />} />
          </Route>

          <Route path="/pessoas" element={<PessoasListPage />} />

          <Route path="/pessoas/novo" element={<PessoaFormPage />} />

          <Route path="/pessoas/:id" element={<PessoaFormPage />} />

          <Route path="/usuarios" element={<UsuariosListPage />} />

          <Route path="/usuarios/novo" element={<UsuarioFormPage />} />

          <Route path="/usuarios/:id" element={<UsuarioFormPage />} />

          <Route element={<PermissionGuard permissao="PRODUTO_EDITAR" />}>
            <Route path="/produtos/novo" element={<ProdutoFormPage />} />

            <Route path="/produtos/:id/editar" element={<ProdutoFormPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
