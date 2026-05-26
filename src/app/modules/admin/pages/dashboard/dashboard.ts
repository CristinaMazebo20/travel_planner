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
      <div class="container">
        <div class="header">
          <div class="header-top">
            <div class="header-left">
              <button class="btn-back" (click)="voltar()">← {{ i18n.t('dashboard.voltar') }}</button>
            </div>
            <div class="header-right">
              <!-- Language Selector -->
              <div class="lang-selector">
                <button class="lang-btn" (click)="toggleLangMenu()">
                  {{ getCurrentLangLabel() }}
                  <svg class="lang-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div class="lang-dropdown" *ngIf="langMenuOpen">
                  <button (click)="setLanguage('pt')" class="lang-item" [class.active]="i18n.getCurrentLang() === 'pt'">🇵🇹 Português</button>
                  <button (click)="setLanguage('en')" class="lang-item" [class.active]="i18n.getCurrentLang() === 'en'">🇬🇧 English</button>
                  <button (click)="setLanguage('fr')" class="lang-item" [class.active]="i18n.getCurrentLang() === 'fr'">🇫🇷 Français</button>
                </div>
              </div>

              <!-- Theme Toggle -->
              <button class="theme-btn" (click)="toggleTheme()" title="Alternar tema">
                <span *ngIf="themeService.isDark()">☀️</span>
                <span *ngIf="!themeService.isDark()">🌙</span>
              </button>
            </div>
          </div>
          <h1>👑 {{ i18n.t('dashboard.title') }}</h1>
          <p>{{ i18n.t('dashboard.subtitle') }}</p>
        </div>

        <div class="cards-grid">
          <div class="admin-card" routerLink="/admin/destinos">
            <div class="card-icon">🌍</div>
            <h3>{{ i18n.t('dashboard.destinos') }}</h3>
            <p>{{ i18n.t('dashboard.destinos_desc') }}</p>
            <span class="arrow">→</span>
          </div>

          <div class="admin-card" routerLink="/admin/usuarios">
            <div class="card-icon">👥</div>
            <h3>{{ i18n.t('dashboard.usuarios') }}</h3>
            <p>{{ i18n.t('dashboard.usuarios_desc') }}</p>
            <span class="arrow">→</span>
          </div>

          <div class="admin-card" routerLink="/admin/viagens">
            <div class="card-icon">✈️</div>
            <h3>{{ i18n.t('dashboard.viagens') }}</h3>
            <p>{{ i18n.t('dashboard.viagens_desc') }}</p>
            <span class="arrow">→</span>
          </div>

          <div class="admin-card" routerLink="/admin/relatorios">
            <div class="card-icon">📊</div>
            <h3>{{ i18n.t('dashboard.relatorios') }}</h3>
            <p>{{ i18n.t('dashboard.relatorios_desc') }}</p>
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

    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
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
      background: rgba(0, 217, 255, 0.1);
      border: 1px solid rgba(0, 217, 255, 0.3);
      padding: 8px 16px;
      border-radius: 8px;
      color: #00D9FF;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.9rem;
    }

    .btn-back:hover {
      background: rgba(0, 217, 255, 0.2);
      transform: translateX(-2px);
    }

    /* Language Selector */
    .lang-selector {
      position: relative;
    }

    .lang-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(0, 217, 255, 0.1);
      border: 1px solid rgba(0, 217, 255, 0.3);
      border-radius: 8px;
      padding: 8px 12px;
      color: #00D9FF;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;
    }

    .lang-btn:hover {
      background: rgba(0, 217, 255, 0.2);
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
      background: var(--bg-card-solid, #11123D);
      border: 1px solid rgba(0, 217, 255, 0.2);
      border-radius: 12px;
      overflow: hidden;
      min-width: 140px;
      z-index: 100;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }

    .lang-item {
      display: block;
      width: 100%;
      padding: 10px 16px;
      background: transparent;
      border: none;
      color: var(--text-secondary, #A0A8C6);
      font-size: 0.85rem;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
    }

    .lang-item:hover {
      background: rgba(0, 217, 255, 0.1);
      color: #00D9FF;
    }

    .lang-item.active {
      background: linear-gradient(135deg, #6C3BD4, #00D9FF);
      color: white;
    }

    /* Theme Button */
    .theme-btn {
      background: rgba(0, 217, 255, 0.1);
      border: 1px solid rgba(0, 217, 255, 0.3);
      border-radius: 8px;
      width: 36px;
      height: 36px;
      cursor: pointer;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .theme-btn:hover {
      background: rgba(0, 217, 255, 0.2);
      transform: scale(1.05);
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
      border: 1px solid rgba(0, 217, 255, 0.1);
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
      transition: all 0.3s;
    }

    .admin-card:hover .arrow {
      opacity: 1;
      transform: translateX(5px);
    }

    @media (max-width: 768px) {
      .header-top {
        flex-direction: column;
        gap: 12px;
      }
      .header-right {
        justify-content: center;
      }
    }
  `]
})
export class AdminDashboard {
  langMenuOpen = false;

  constructor(
    private router: Router,
    public i18n: I18nService,
    public themeService: ThemeService
  ) {
    // Fechar dropdown ao clicar fora
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