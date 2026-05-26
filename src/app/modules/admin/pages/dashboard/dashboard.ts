// modules/admin/pages/dashboard/dashboard.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { I18nService } from '../../../../core/services/i18n.service';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-dashboard">
      <div class="dashboard-bg">
        <div class="bg-gradient-1"></div>
        <div class="bg-gradient-2"></div>
      </div>

      <div class="container">
        <!-- Header com gradiente -->
        <div class="header">
          <div class="header-top">
            <div class="header-left">
              <button class="btn-back" (click)="voltar()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                {{ i18n.t('dashboard.voltar') }}
              </button>
            </div>
            <div class="header-right">
              <div class="lang-selector">
                <button class="lang-btn" (click)="toggleLangMenu()">
                  <span class="lang-code">{{ getCurrentLangLabel() }}</span>
                  <svg class="lang-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div class="lang-dropdown" *ngIf="langMenuOpen">
                  <button (click)="setLanguage('pt')" class="lang-item" [class.active]="i18n.getCurrentLang() === 'pt'">
                    <span class="lang-flag">🇵🇹</span>
                    <span>Português</span>
                  </button>
                  <button (click)="setLanguage('en')" class="lang-item" [class.active]="i18n.getCurrentLang() === 'en'">
                    <span class="lang-flag">🇬🇧</span>
                    <span>English</span>
                  </button>
                  <button (click)="setLanguage('fr')" class="lang-item" [class.active]="i18n.getCurrentLang() === 'fr'">
                    <span class="lang-flag">🇫🇷</span>
                    <span>Français</span>
                  </button>
                </div>
              </div>
              <button class="theme-btn" (click)="toggleTheme()" [title]="themeService.isDark() ? 'Modo Claro' : 'Modo Escuro'">
                <svg *ngIf="themeService.isDark()" class="theme-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M12 2V3M12 21V22M22 12H21M3 12H2M19.07 4.93L18.36 5.64M5.64 18.36L4.93 19.07M19.07 19.07L18.36 18.36M5.64 5.64L4.93 4.93" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
                <svg *ngIf="!themeService.isDark()" class="theme-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1583 17.4668C18.1127 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.748 21.1181 10.0795 20.7461C8.41104 20.3741 6.88299 19.5345 5.67423 18.3258C4.46548 17.117 3.62591 15.589 3.25388 13.9205C2.88186 12.252 2.9927 10.5121 3.57346 8.9043C4.15423 7.2965 5.18079 5.88731 6.53318 4.8417C7.88557 3.79609 9.50776 3.15731 11.21 3C10.2133 4.34827 9.73383 6.00945 9.85853 7.68141C9.98323 9.35338 10.7039 10.9251 11.8894 12.1106C13.0749 13.2961 14.6466 14.0168 16.3186 14.1415C17.9906 14.2662 19.6518 13.7867 21 12.79Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="welcome-section">
            <div class="welcome-badge">
              <svg class="welcome-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 9.34784 20.9464 6.8043 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2Z"/>
                <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              <span>{{ i18n.t('dashboard.welcome_back') }}</span>
            </div>
            <h1 class="dashboard-title">
              <svg class="title-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" stroke="currentColor" fill="currentColor" fill-opacity="0.2"/>
              </svg>
              {{ i18n.t('dashboard.title') }}
            </h1>
            <p class="dashboard-subtitle">{{ i18n.t('dashboard.subtitle') }}</p>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12H22M12 2C14.5 4.5 15.5 8 12 12C8.5 8 9.5 4.5 12 2Z"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3>{{ totalDestinos }}</h3>
              <p>{{ i18n.t('dashboard.stats_destinos') }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21"/>
                <circle cx="12" cy="7" r="4"/>
                <path d="M17 3C19.2 3 21 4.8 21 7"/>
                <path d="M7 3C4.8 3 3 4.8 3 7"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3>{{ totalUsuarios }}</h3>
              <p>{{ i18n.t('dashboard.stats_usuarios') }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M3 15L6 12L9 15L12 12L15 15L18 12L21 15"/>
                <path d="M3 9L6 6L9 9L12 6L15 9L18 6L21 9"/>
                <path d="M3 19L6 16L9 19L12 16L15 19L18 16L21 19"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3>{{ totalViagens }}</h3>
              <p>{{ i18n.t('dashboard.stats_viagens') }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6V12L16 14" stroke="currentColor"/>
                <path d="M12 2V4M12 20V22M2 12H4M20 12H22" stroke="currentColor" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="stat-content">
              <h3>{{ totalFaturado }}K</h3>
              <p>{{ i18n.t('dashboard.stats_faturamento') }}</p>
            </div>
          </div>
        </div>

        <!-- Cards Grid -->
        <div class="cards-grid">
          <div class="admin-card" routerLink="/admin/destinos">
            <div class="card-glow"></div>
            <div class="card-icon-wrapper">
              <div class="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12H22M12 2C14.5 4.5 15.5 8 12 12C8.5 8 9.5 4.5 12 2Z"/>
                </svg>
              </div>
            </div>
            <div class="card-content">
              <h3>{{ i18n.t('dashboard.destinos') }}</h3>
              <p>{{ i18n.t('dashboard.destinos_desc') }}</p>
            </div>
            <div class="card-footer">
              <span class="card-action">{{ i18n.t('dashboard.gerenciar') }}</span>
              <span class="arrow">→</span>
            </div>
          </div>

          <div class="admin-card" routerLink="/admin/usuarios">
            <div class="card-glow"></div>
            <div class="card-icon-wrapper">
              <div class="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
                  <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21"/>
                  <circle cx="12" cy="7" r="4"/>
                  <path d="M17 3C19.2 3 21 4.8 21 7"/>
                  <path d="M7 3C4.8 3 3 4.8 3 7"/>
                </svg>
              </div>
            </div>
            <div class="card-content">
              <h3>{{ i18n.t('dashboard.usuarios') }}</h3>
              <p>{{ i18n.t('dashboard.usuarios_desc') }}</p>
            </div>
            <div class="card-footer">
              <span class="card-action">{{ i18n.t('dashboard.gerenciar') }}</span>
              <span class="arrow">→</span>
            </div>
          </div>

          <div class="admin-card" routerLink="/admin/viagens">
            <div class="card-glow"></div>
            <div class="card-icon-wrapper">
              <div class="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
                  <path d="M3 15L6 12L9 15L12 12L15 15L18 12L21 15"/>
                  <path d="M3 9L6 6L9 9L12 6L15 9L18 6L21 9"/>
                  <path d="M3 19L6 16L9 19L12 16L15 19L18 16L21 19"/>
                </svg>
              </div>
            </div>
            <div class="card-content">
              <h3>{{ i18n.t('dashboard.viagens') }}</h3>
              <p>{{ i18n.t('dashboard.viagens_desc') }}</p>
            </div>
            <div class="card-footer">
              <span class="card-action">{{ i18n.t('dashboard.gerenciar') }}</span>
              <span class="arrow">→</span>
            </div>
          </div>

          <div class="admin-card" routerLink="/admin/relatorios">
            <div class="card-glow"></div>
            <div class="card-icon-wrapper">
              <div class="card-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
                  <path d="M21 12C21 13.2 20.5 14.2 19.7 15.1C18.9 15.9 17.8 16.5 16.5 16.8C15.2 17.1 13.8 17.1 12.3 16.8C10.8 16.5 9.3 15.9 8.2 15.1M21 12V16.5M21 12H16.5"/>
                  <path d="M3 12C3 10.8 3.5 9.8 4.3 8.9C5.1 8.1 6.2 7.5 7.5 7.2C8.8 6.9 10.2 6.9 11.7 7.2C13.2 7.5 14.7 8.1 15.8 8.9M3 12V7.5M3 12H7.5"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
            </div>
            <div class="card-content">
              <h3>{{ i18n.t('dashboard.relatorios') }}</h3>
              <p>{{ i18n.t('dashboard.relatorios_desc') }}</p>
            </div>
            <div class="card-footer">
              <span class="card-action">{{ i18n.t('dashboard.visualizar') }}</span>
              <span class="arrow">→</span>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="recent-section">
          <div class="section-header">
            <h3>
              <svg class="section-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="display: inline; margin-right: 8px;">
                <path d="M12 8V12L15 15" stroke="currentColor"/>
                <circle cx="12" cy="12" r="9" stroke="currentColor"/>
              </svg>
              {{ i18n.t('dashboard.atividade_recente') }}
            </h3>
            <a routerLink="/admin/viagens" class="view-all">{{ i18n.t('dashboard.ver_todas') }} →</a>
          </div>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M3 15L6 12L9 15L12 12L15 15L18 12L21 15"/>
                  <path d="M3 9L6 6L9 9L12 6L15 9L18 6L21 9"/>
                </svg>
              </div>
              <div class="activity-content">
                <p><strong>{{ i18n.t('dashboard.nova_viagem') }}</strong> {{ i18n.t('dashboard.para') }} Cancún</p>
                <small>{{ i18n.t('dashboard.ha_2_horas') }}</small>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div class="activity-content">
                <p><strong>{{ i18n.t('dashboard.novo_usuario') }}</strong> {{ i18n.t('dashboard.registrado') }}</p>
                <small>{{ i18n.t('dashboard.ha_5_horas') }}</small>
              </div>
            </div>
            <div class="activity-item">
              <div class="activity-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6V12L16 14"/>
                </svg>
              </div>
              <div class="activity-content">
                <p><strong>{{ i18n.t('dashboard.pagamento_recebido') }}</strong> {{ i18n.t('dashboard.de') }} 15.000 Kz</p>
                <small>{{ i18n.t('dashboard.ha_1_dia') }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      position: relative;
      min-height: calc(100vh - 200px);
      padding: 40px 20px;
      overflow-x: hidden;
      background: var(--bg-primary);
    }

    .dashboard-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
      overflow: hidden;
    }

    .bg-gradient-1 {
      position: absolute;
      top: -30%;
      left: -10%;
      width: 60%;
      height: 60%;
      background: radial-gradient(circle, rgba(108,59,212,0.15) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(60px);
    }

    .bg-gradient-2 {
      position: absolute;
      bottom: -30%;
      right: -10%;
      width: 60%;
      height: 60%;
      background: radial-gradient(circle, rgba(0,217,255,0.1) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(60px);
    }

    .container {
      position: relative;
      z-index: 1;
      max-width: 1280px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 48px;
    }

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .header-left {
      display: flex;
      align-items: center;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-back {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      padding: 8px 16px;
      border-radius: 10px;
      color: var(--color-secondary);
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.85rem;
    }

    .btn-back:hover {
      background: var(--bg-hover);
      transform: translateX(-2px);
    }

    .lang-selector {
      position: relative;
    }

    .lang-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 8px 12px;
      color: var(--text-primary);
      cursor: pointer;
      font-size: 0.85rem;
    }

    .lang-btn:hover {
      border-color: var(--color-secondary);
    }

    .lang-icon {
      transition: transform 0.2s;
    }

    .lang-selector:hover .lang-icon {
      transform: rotate(180deg);
    }

    .lang-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      background: var(--bg-card-solid);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      min-width: 160px;
      z-index: 100;
    }

    .lang-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px 16px;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
    }

    .lang-item:hover {
      background: var(--bg-hover);
      color: var(--color-secondary);
    }

    .lang-item.active {
      background: var(--gradient-primary);
      color: white;
    }

    .theme-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .theme-btn:hover {
      border-color: var(--color-secondary);
      transform: scale(1.05);
    }

    .theme-icon {
      transition: transform 0.3s ease;
    }

    .theme-btn:hover .theme-icon {
      transform: rotate(15deg);
    }

    .welcome-section {
      text-align: center;
    }

    .welcome-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, rgba(108,59,212,0.2), rgba(0,217,255,0.1));
      border: 1px solid rgba(0,217,255,0.2);
      border-radius: 30px;
      padding: 6px 16px;
      margin-bottom: 20px;
      font-size: 0.85rem;
      color: var(--color-secondary);
    }

    .welcome-icon {
      stroke: var(--color-secondary);
    }

    .dashboard-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 2.2rem;
      margin-bottom: 12px;
      color: var(--text-primary);
    }

    .title-icon {
      stroke: var(--color-secondary);
    }

    .dashboard-subtitle {
      color: var(--text-secondary);
      font-size: 1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 48px;
    }

    .stat-card {
      background: var(--bg-card);
      backdrop-filter: blur(10px);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      border-color: var(--color-secondary);
    }

    .stat-icon {
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(108,59,212,0.15), rgba(0,217,255,0.08));
      border-radius: 16px;
      stroke: var(--color-secondary);
    }

    .stat-content h3 {
      font-size: 1.8rem;
      font-weight: bold;
      color: var(--color-secondary);
      margin: 0;
    }

    .stat-content p {
      color: var(--text-secondary);
      font-size: 0.8rem;
      margin: 4px 0 0 0;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      margin-bottom: 48px;
    }

    .admin-card {
      position: relative;
      background: var(--bg-card);
      backdrop-filter: blur(10px);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      padding: 24px;
      cursor: pointer;
      transition: all 0.3s;
      overflow: hidden;
    }

    .admin-card:hover {
      transform: translateY(-6px);
      border-color: var(--color-secondary);
    }

    .card-glow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      background: radial-gradient(ellipse at 50% 0%, rgba(0,217,255,0.1), transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .admin-card:hover .card-glow {
      opacity: 1;
    }

    .card-icon-wrapper {
      margin-bottom: 20px;
    }

    .card-icon {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(108,59,212,0.12), rgba(0,217,255,0.06));
      border-radius: 20px;
      stroke: var(--color-secondary);
    }

    .card-content h3 {
      color: var(--text-primary);
      font-size: 1.2rem;
      margin-bottom: 8px;
    }

    .card-content p {
      color: var(--text-secondary);
      font-size: 0.85rem;
      line-height: 1.4;
      margin-bottom: 20px;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
    }

    .card-action {
      color: var(--color-secondary);
      font-size: 0.85rem;
      font-weight: 500;
    }

    .arrow {
      color: var(--color-secondary);
      font-size: 1.1rem;
      transition: transform 0.3s;
    }

    .admin-card:hover .arrow {
      transform: translateX(5px);
    }

    .recent-section {
      background: var(--bg-card);
      backdrop-filter: blur(10px);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      padding: 24px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-color);
    }

    .section-header h3 {
      display: flex;
      align-items: center;
      color: var(--text-primary);
      font-size: 1.1rem;
    }

    .section-icon {
      stroke: var(--color-secondary);
    }

    .view-all {
      color: var(--color-secondary);
      text-decoration: none;
      font-size: 0.85rem;
      transition: color 0.2s;
    }

    .view-all:hover {
      opacity: 0.8;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px;
      background: var(--bg-input);
      border-radius: 12px;
      transition: all 0.2s;
    }

    .activity-item:hover {
      background: var(--bg-hover);
      transform: translateX(4px);
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, rgba(108,59,212,0.2), rgba(0,217,255,0.1));
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      stroke: var(--color-secondary);
    }

    .activity-content {
      flex: 1;
    }

    .activity-content p {
      color: var(--text-primary);
      margin: 0 0 4px 0;
      font-size: 0.9rem;
    }

    .activity-content small {
      color: var(--text-secondary);
      font-size: 0.7rem;
    }

    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .cards-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .header-top {
        flex-direction: column;
        gap: 16px;
      }
      .header-right {
        justify-content: center;
      }
      .stats-grid {
        grid-template-columns: 1fr;
      }
      .cards-grid {
        grid-template-columns: 1fr;
      }
      .dashboard-title {
        flex-direction: column;
        font-size: 1.5rem;
      }
    }

    /* Light Mode Specific Styles */
    body.light-theme .admin-dashboard {
      background: var(--bg-primary);
    }

    body.light-theme .dashboard-bg .bg-gradient-1 {
      background: radial-gradient(circle, rgba(108,59,212,0.08) 0%, transparent 70%);
    }

    body.light-theme .dashboard-bg .bg-gradient-2 {
      background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%);
    }

    body.light-theme .btn-back {
      background: #FFFFFF;
      border-color: #E2E8F0;
      color: #3B82F6;
    }

    body.light-theme .btn-back:hover {
      background: #F1F5F9;
    }

    body.light-theme .lang-btn {
      background: #FFFFFF;
      border-color: #E2E8F0;
      color: #1E293B;
    }

    body.light-theme .lang-btn:hover {
      border-color: #3B82F6;
    }

    body.light-theme .stat-card {
      background: #FFFFFF;
      border-color: #E2E8F0;
    }

    body.light-theme .admin-card {
      background: #FFFFFF;
      border-color: #E2E8F0;
    }

    body.light-theme .admin-card:hover {
      border-color: #3B82F6;
    }

    body.light-theme .recent-section {
      background: #FFFFFF;
      border-color: #E2E8F0;
    }

    body.light-theme .activity-item {
      background: #F8FAFC;
    }

    body.light-theme .activity-item:hover {
      background: #F1F5F9;
    }

    body.light-theme .card-content h3 {
      color: #1E293B;
    }

    body.light-theme .card-content p {
      color: #64748B;
    }

    body.light-theme .section-header h3 {
      color: #1E293B;
    }

    body.light-theme .activity-content p {
      color: #1E293B;
    }

    body.light-theme .activity-content small {
      color: #64748B;
    }

    body.light-theme .dashboard-title {
      color: #1E293B;
    }

    body.light-theme .welcome-badge {
      background: #F1F5F9;
      border-color: #E2E8F0;
      color: #3B82F6;
    }
  `]
})
export class AdminDashboard {
  langMenuOpen = false;
  totalDestinos: number = 12;
  totalUsuarios: number = 45;
  totalViagens: number = 28;
  totalFaturado: number = 125;

  constructor(
    private router: Router,
    public i18n: I18nService,
    public themeService: ThemeService
  ) {
    document.addEventListener('click', (event) => {
      if (!(event.target as Element).closest('.lang-selector')) {
        this.langMenuOpen = false;
      }
    });
  }

  voltar() {
    this.router.navigate(['/destinos']);
  }

  getCurrentLangLabel(): string {
    const labels = { pt: 'PT', en: 'EN', fr: 'FR' };
    return labels[this.i18n.getCurrentLang()];
  }

  toggleLangMenu() {
    this.langMenuOpen = !this.langMenuOpen;
  }

  setLanguage(lang: 'pt' | 'en' | 'fr') {
    this.i18n.setLanguage(lang);
    this.langMenuOpen = false;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}