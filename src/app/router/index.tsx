import { Navigate, Route, Routes } from 'react-router-dom';

import { MainLayout } from '../../components/layout/MainLayout';
import { AuthGuard } from '../../guards/AuthGuard';
import { PermissionGuard } from '../../guards/PermissionGuard';

import LoginPage from '../../auth/pages/LoginPage';
import ForbiddenPage from '../../modules/errors/pages/ForbiddenPage';
import DashboardPage from '../../modules/dashboard/pages/DashboardPage';

import PessoasListPage from '../../modules/pessoas/pages/PessoasListPage';
import PessoaFormPage from '../../modules/pessoas/pages/PessoaFormPage';

import UsuariosListPage from '../../modules/usuarios/pages/UsuariosListPage';
import UsuarioFormPage from '../../modules/usuarios/pages/UsuarioFormPage';

import PerfisListPage from '../../modules/perfis/pages/PerfisListPage';
import PerfilFormPage from '../../modules/perfis/pages/PerfilFormPage';

import PermissoesListPages from '../../modules/permissoes/pages/PermissoesListPages';
import PermissaoFormPage from '../../modules/permissoes/pages/PermissaoFormPage';

import ProdutosListPage from '../../modules/produtos/pages/ProdutosListPage';
import ProdutoFormPage from '../../modules/produtos/pages/ProdutoFormPage';

import CategoriasListPage from '../../modules/categorias/pages/CategoriasListPage';
import CategoriaFormPage from '../../modules/categorias/pages/CategoriaFormPage';

import CanaisVendaListPage from '../../modules/canais-venda/pages/CanaisVendaListPage';
import CanalVendaFormPage from '../../modules/canais-venda/pages/CanalVendaFormPage';

import MateriaisListPage from '../../modules/materiais/pages/MateriaisListPage';
import MaterialFormPage from '../../modules/materiais/pages/MateriaisFormPage';

import LocaisListPage from '../../modules/locais/pages/LocaisListPages';
import LocalFormPage from '../../modules/locais/pages/LocaisFormPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/403" element={<ForbiddenPage />} />

      <Route element={<AuthGuard />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* PESSOAS */}
          <Route path="/pessoas" element={<PessoasListPage />} />
          <Route path="/pessoas/novo" element={<PessoaFormPage />} />
          <Route path="/pessoas/:id" element={<PessoaFormPage />} />

          {/* USUÁRIOS */}
          <Route path="/usuarios" element={<UsuariosListPage />} />
          <Route path="/usuarios/novo" element={<UsuarioFormPage />} />
          <Route path="/usuarios/:id" element={<UsuarioFormPage />} />

          {/* PERFIS */}
          <Route path="/perfis" element={<PerfisListPage />} />
          <Route path="/perfis/novo" element={<PerfilFormPage />} />
          <Route path="/perfis/:id" element={<PerfilFormPage />} />

          {/* PERMISSÕES */}
          <Route path="/permissoes" element={<PermissoesListPages />} />
          <Route path="/permissoes/novo" element={<PermissaoFormPage />} />
          <Route path="/permissoes/:id" element={<PermissaoFormPage />} />

          {/* CATEGORIAS */}
          <Route path="/categorias" element={<CategoriasListPage />} />
          <Route path="/categorias/novo" element={<CategoriaFormPage />} />
          <Route path="/categorias/:id" element={<CategoriaFormPage />} />

          {/* CANAIS DE VENDA */}
          <Route path="/canais-venda" element={<CanaisVendaListPage />} />
          <Route path="/canais-venda/novo" element={<CanalVendaFormPage />} />
          <Route path="/canais-venda/:id" element={<CanalVendaFormPage />} />

          {/* PRODUTOS */}
          <Route element={<PermissionGuard permissao="PRODUTO_VISUALIZAR" />}>
            <Route path="/produtos" element={<ProdutosListPage />} />
          </Route>

          <Route element={<PermissionGuard permissao="PRODUTO_EDITAR" />}>
            <Route path="/produtos/novo" element={<ProdutoFormPage />} />
            <Route path="/produtos/:id/editar" element={<ProdutoFormPage />} />

            {/* MATERIAIS */}
            <Route path="/materiais" element={<MateriaisListPage />} />
            <Route path="/materiais/novo" element={<MaterialFormPage />} />
            <Route path="/materiais/:id" element={<MaterialFormPage />} />

            {/* LOCAIS */}
            <Route path="/locais" element={<LocaisListPage />} />
            <Route path="/locais/novo" element={<LocalFormPage />} />
            <Route path="/locais/:id" element={<LocalFormPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
