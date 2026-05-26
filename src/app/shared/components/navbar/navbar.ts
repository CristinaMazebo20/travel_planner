// components/navbar/navbar.ts
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled">
      <div class="container">
        <!-- Logo -->
        <a routerLink="/destinos" class="logo">
          <div class="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L20 8H12L16 2Z" fill="url(#gradient)"/>
              <path d="M16 30L12 24H20L16 30Z" fill="url(#gradient)"/>
              <rect x="14" y="8" width="4" height="16" fill="url(#gradient)"/>
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#6C3BD4"/>
                  <stop offset="100%" style="stop-color:#00D9FF"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="logo-text">Travel<span>ly</span></span>
        </a>

        <!-- Navegação -->
        <div class="nav-links">
          <a routerLink="/destinos" routerLinkActive="active">{{ i18n.t('nav.destinos') }}</a>
          <a routerLink="/minhas-viagens" routerLinkActive="active">{{ i18n.t('nav.minhas_viagens') }}</a>
          
          <a *ngIf="isAdmin()" routerLink="/admin/dashboard" routerLinkActive="active" class="admin-link">
            👑 {{ i18n.t('nav.admin') }}
          </a>
          
          <a routerLink="/planejar" routerLinkActive="active" class="btn-planejar">{{ i18n.t('nav.planejar') }}</a>

          <!-- Language Selector -->
          <div class="lang-selector">
            <button class="lang-btn" (click)="toggleLangMenu()">
              {{ getCurrentLangLabel() }}
              <svg class="lang-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div class="lang-dropdown" *ngIf="langMenuOpen">
              <button (click)="setLanguage('pt')" class="lang-item" [class.active]="i18n.getCurrentLang() === 'pt'">
                PT
              </button>
              <button (click)="setLanguage('en')" class="lang-item" [class.active]="i18n.getCurrentLang() === 'en'">
                EN
              </button>
              <button (click)="setLanguage('fr')" class="lang-item" [class.active]="i18n.getCurrentLang() === 'fr'">
                FR
              </button>
            </div>
          </div>

          <!-- Theme Toggle -->
          <button class="theme-btn" (click)="toggleTheme()">
            <span *ngIf="themeService.isDark()">☀️</span>
            <span *ngIf="!themeService.isDark()">🌙</span>
          </button>

          <div class="user-area">
            <ng-container *ngIf="!auth.isLoggedIn(); else userMenu">
              <a routerLink="/login" class="btn-login">{{ i18n.t('nav.login') }}</a>
              <a routerLink="/registar" class="btn-register">{{ i18n.t('nav.registar') }}</a>
            </ng-container>
            <ng-template #userMenu>
              <div class="user-menu">
                <span class="user-name">{{ (auth.usuario()?.nome || '').split(' ')[0] }}</span>
                <button class="btn-logout" (click)="logout()">{{ i18n.t('nav.sair') }}</button>
              </div>
            </ng-template>
          </div>
        </div>

        <button class="mobile-btn" (click)="mobileOpen = !mobileOpen">☰</button>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="mobileOpen">
        <a routerLink="/destinos" (click)="mobileOpen=false">{{ i18n.t('nav.destinos') }}</a>
        <a routerLink="/minhas-viagens" (click)="mobileOpen=false">{{ i18n.t('nav.minhas_viagens') }}</a>
        <a *ngIf="isAdmin()" routerLink="/admin/dashboard" (click)="mobileOpen=false" class="admin-link">
          👑 {{ i18n.t('nav.admin') }}
        </a>
        <a routerLink="/planejar" (click)="mobileOpen=false">{{ i18n.t('nav.planejar') }}</a>
        
        <div class="mobile-lang-section">
          <div class="mobile-lang-label">Idioma</div>
          <div class="mobile-lang-options">
            <button (click)="setLanguage('pt')" class="mobile-lang-btn" [class.active]="i18n.getCurrentLang() === 'pt'">PT</button>
            <button (click)="setLanguage('en')" class="mobile-lang-btn" [class.active]="i18n.getCurrentLang() === 'en'">EN</button>
            <button (click)="setLanguage('fr')" class="mobile-lang-btn" [class.active]="i18n.getCurrentLang() === 'fr'">FR</button>
          </div>
        </div>
        
        <button (click)="toggleTheme()" class="mobile-theme-btn">
          <span *ngIf="themeService.isDark()">☀️ Modo Claro</span>
          <span *ngIf="!themeService.isDark()">🌙 Modo Escuro</span>
        </button>
        
        <a routerLink="/login" (click)="mobileOpen=false" *ngIf="!auth.isLoggedIn()">{{ i18n.t('nav.login') }}</a>
        <a routerLink="/registar" (click)="mobileOpen=false" *ngIf="!auth.isLoggedIn()">{{ i18n.t('nav.registar') }}</a>
        <button (click)="logout()" *ngIf="auth.isLoggedIn()">{{ i18n.t('nav.sair') }}</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: var(--bg-card);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      z-index: 1000;
      transition: all 0.3s;
    }

    .navbar.scrolled {
      background: var(--bg-card-solid);
      box-shadow: var(--shadow-md);
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--text-primary) 0%, var(--color-primary) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .logo-text span {
      color: var(--color-secondary);
      background: none;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .nav-links a {
      text-decoration: none;
      color: var(--text-secondary);
      font-weight: 500;
      transition: all 0.3s;
      font-size: 0.9rem;
    }

    .nav-links a:hover {
      color: var(--color-secondary);
    }

    .nav-links a.active {
      color: var(--color-secondary);
    }

    .btn-planejar {
      background: var(--gradient-primary);
      padding: 8px 18px;
      border-radius: 30px;
      color: white !important;
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
      border-radius: 8px;
      padding: 6px 12px;
      color: var(--text-primary);
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .lang-btn:hover {
      border-color: var(--color-secondary);
      background: var(--bg-hover);
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
      border-radius: 10px;
      overflow: hidden;
      min-width: 80px;
      box-shadow: var(--shadow-lg);
      z-index: 100;
    }

    .lang-item {
      display: block;
      width: 100%;
      padding: 8px 16px;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      text-align: left;
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
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      width: 32px;
      height: 32px;
      cursor: pointer;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .theme-btn:hover {
      border-color: var(--color-secondary);
      transform: scale(1.05);
    }

    .btn-login, .btn-register, .btn-logout {
      padding: 6px 18px;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-login {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
    }

    .btn-login:hover {
      border-color: var(--color-secondary);
      color: var(--color-secondary);
    }

    .btn-register, .btn-logout {
      background: var(--gradient-primary);
      border: none;
      color: white;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-name {
      color: var(--color-secondary);
      font-weight: 500;
      font-size: 0.85rem;
    }

    .mobile-btn {
      display: none;
      background: none;
      border: none;
      color: var(--text-primary);
      font-size: 24px;
      cursor: pointer;
    }

    .mobile-menu {
      display: none;
      flex-direction: column;
      padding: 20px;
      background: var(--bg-card-solid);
      border-top: 1px solid var(--border-color);
    }

    .mobile-menu.open {
      display: flex;
    }

    .mobile-menu a, .mobile-menu button {
      padding: 12px 0;
      color: var(--text-primary);
      text-decoration: none;
      background: none;
      border: none;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
      cursor: pointer;
      font-size: 0.9rem;
    }

    .mobile-lang-section {
      padding: 12px 0;
      border-bottom: 1px solid var(--border-color);
    }

    .mobile-lang-label {
      color: var(--text-secondary);
      font-size: 0.75rem;
      margin-bottom: 8px;
    }

    .mobile-lang-options {
      display: flex;
      gap: 12px;
    }

    .mobile-lang-btn {
      padding: 6px 16px !important;
      background: var(--bg-input) !important;
      border: 1px solid var(--border-color) !important;
      border-radius: 8px !important;
      text-align: center !important;
      font-size: 0.8rem !important;
      cursor: pointer;
    }

    .mobile-lang-btn.active {
      background: var(--gradient-primary) !important;
      color: white !important;
      border-color: transparent !important;
    }

    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
      .mobile-btn {
        display: block;
      }
      .container {
        padding: 12px 20px;
      }
    }
  `]
})
export class NavbarComponent {
  isScrolled = false;
  mobileOpen = false;
  langMenuOpen = false;

  constructor(
    public auth: AuthService,
    public i18n: I18nService,
    public themeService: ThemeService
  ) {
    setInterval(() => this.auth.usuario(), 1000);
    // Fechar dropdown ao clicar fora
    document.addEventListener('click', (event) => {
      if (!(event.target as Element).closest('.lang-selector')) {
        this.langMenuOpen = false;
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 30;
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
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

  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }
}