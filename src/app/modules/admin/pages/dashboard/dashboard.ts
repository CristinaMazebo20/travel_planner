import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-dashboard">
      <div class="container">
        <div class="header">
          <h1>👑 Painel Administrativo</h1>
          <p>Gerencie destinos, usuários e viagens</p>
        </div>

        <div class="cards-grid">
          <div class="admin-card" routerLink="/admin/destinos">
            <div class="card-icon">🌍</div>
            <h3>Destinos</h3>
            <p>Adicionar, editar ou remover destinos</p>
            <span class="arrow">→</span>
          </div>

          <div class="admin-card" routerLink="/admin/usuarios">
            <div class="card-icon">👥</div>
            <h3>Utilizadores</h3>
            <p>Gerenciar usuários do sistema</p>
            <span class="arrow">→</span>
          </div>

          <div class="admin-card" routerLink="/admin/viagens">
            <div class="card-icon">✈️</div>
            <h3>Viagens</h3>
            <p>Visualizar todas as viagens</p>
            <span class="arrow">→</span>
          </div>

          <div class="admin-card" routerLink="/admin/relatorios">
            <div class="card-icon">📊</div>
            <h3>Relatórios</h3>
            <p>Exportar dados e estatísticas</p>
            <span class="arrow">→</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      min-height: calc(100vh - 200px);
      padding: 40px 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 48px;
    }

    .header h1 {
      font-size: 2rem;
      margin-bottom: 8px;
      color: white;
    }

    .header p {
      color: #A0A8C6;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
    }

    .admin-card {
      position: relative;
      background: rgba(17, 22, 61, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 24px;
      padding: 32px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      border: 1px solid rgba(0,217,255,0.1);
    }

    .admin-card:hover {
      transform: translateY(-5px);
      border-color: #00D9FF;
      background: rgba(17, 22, 61, 0.95);
    }

    .card-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .admin-card h3 {
      font-size: 1.3rem;
      margin-bottom: 8px;
      color: white;
    }

    .admin-card p {
      color: #A0A8C6;
      font-size: 0.85rem;
      margin-bottom: 16px;
    }

    .arrow {
      display: inline-block;
      color: #00D9FF;
      font-size: 1.2rem;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .admin-card:hover .arrow {
      opacity: 1;
      transform: translateX(5px);
    }
  `]
})
export class AdminDashboard {}