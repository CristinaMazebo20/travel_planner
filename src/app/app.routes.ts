import { Routes } from '@angular/router';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // Rotas públicas
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout').then(m => m.PublicLayout),
    children: [
      { path: '', redirectTo: 'destinos', pathMatch: 'full' },
      { path: 'destinos', loadComponent: () => import('./modules/destinos/pages/lista-destinos/lista-destinos').then(m => m.ListaDestinos) },
      { path: 'destino/:id', loadComponent: () => import('./modules/destinos/pages/detalhe-destino/detalhe-destino').then(m => m.DetalheDestino) },
      { path: 'login', loadComponent: () => import('./modules/auth/pages/login/login').then(m => m.Login) },
      { path: 'registar', loadComponent: () => import('./modules/auth/pages/registo/registo').then(m => m.Registo) },
      { path: 'recuperar-senha', loadComponent: () => import('./modules/auth/pages/recuperar-senha/recuperar-senha').then(m => m.RecuperarSenha) },
      { path: 'minhas-viagens', loadComponent: () => import('./modules/viagens/pages/minhas-viagens/minhas-viagens').then(m => m.MinhasViagens) },
      { path: 'planejar', loadComponent: () => import('./modules/viagens/pages/planejar-viagem/planejar-viagem').then(m => m.PlanejarViagem) },
      { path: 'perfil', loadComponent: () => import('./modules/perfil/pages/perfil/perfil').then(m => m.Perfil) },
      { path: 'pagamento-sucesso', loadComponent: () => import('./modules/viagens/pages/pagamento-sucesso/pagamento-sucesso').then(m => m.PagamentoSucesso) },
      { path: 'viagem/:id', loadComponent: () => import('./modules/viagens/pages/detalhe-viagem/detalhe-viagem').then(m => m.DetalheViagem) }
    ]
  },
  
  // Rotas Admin
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadComponent: () => import('./modules/admin/admin-layout/admin-layout').then(m => m.AdminLayout),
    children: [
       { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./modules/admin/pages/dashboard/dashboard').then(m => m.AdminDashboard) },
      { path: 'destinos', loadComponent: () => import('./modules/admin/pages/gestao-destinos/gestao-destinos').then(m => m.GestaoDestinos) },
      { path: 'usuarios', loadComponent: () => import('./modules/admin/pages/gestao-usuarios/gestao-usuarios').then(m => m.GestaoUsuarios) },
      { path: 'relatorios', loadComponent: () => import('./modules/admin/pages/relatorios/relatorios').then(m => m.Relatorios) },
       { path: 'viagens', loadComponent: () => import('./modules/admin/pages/gestao-viagens/gestao-viagens').then(m => m.GestaoViagens) }
    ]
  },

  { path: '**', redirectTo: 'destinos' }
];