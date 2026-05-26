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

        <!-- Desktop Navigation -->
        <div class="nav-links">
          <div class="nav-items">
            <a routerLink="/destinos" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">🌍</span>
              <span>{{ i18n.t('nav.destinos') }}</span>
            </a>
            <a routerLink="/minhas-viagens" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">✈️</span>
              <span>{{ i18n.t('nav.minhas_viagens') }}</span>
            </a>
            <a *ngIf="isAdmin()" routerLink="/admin/dashboard" routerLinkActive="active" class="nav-link admin-link">
              <span class="nav-icon">👑</span>
              <span>{{ i18n.t('nav.admin') }}</span>
            </a>
          </div>

          <div class="nav-actions">
            <a routerLink="/planejar" routerLinkActive="active" class="btn-planejar">
              <span>📅</span>
              <span>{{ i18n.t('nav.planejar') }}</span>
            </a>

            <div class="lang-selector">
              <button class="lang-btn" (click)="toggleLangMenu()">
                <span class="lang-flag">{{ getCurrentFlag() }}</span>
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
              <span *ngIf="themeService.isDark()">☀️</span>
              <span *ngIf="!themeService.isDark()">🌙</span>
            </button>

            <!-- User Area - Avatar leva diretamente ao perfil -->
            <div class="user-area">
              <ng-container *ngIf="!auth.isLoggedIn(); else userMenu">
                <a routerLink="/login" class="btn-login">
                  <span>🔑</span>
                  <span>{{ i18n.t('nav.login') }}</span>
                </a>
                <a routerLink="/registar" class="btn-register">
                  <span>📝</span>
                  <span>{{ i18n.t('nav.registar') }}</span>
                </a>
              </ng-container>
              <ng-template #userMenu>
                <a routerLink="/perfil" class="user-avatar-link">
                  <div class="user-avatar">
                    <span>{{ getUserInitial() }}</span>
                  </div>
                </a>
              </ng-template>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button class="mobile-btn" (click)="mobileOpen = !mobileOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="mobileOpen">
        <div class="mobile-menu-header">
          <!-- Avatar no mobile também leva ao perfil -->
          <a routerLink="/perfil" class="mobile-user-info" (click)="mobileOpen=false" *ngIf="auth.isLoggedIn()">
            <div class="mobile-avatar">{{ getUserInitial() }}</div>
            <div class="mobile-user-details">
              <strong>{{ auth.usuario()?.nome }}</strong>
              <small>{{ auth.usuario()?.email }}</small>
            </div>
          </a>
        </div>

        <div class="mobile-menu-links">
          <a routerLink="/destinos" (click)="mobileOpen=false" class="mobile-link">
            <span>🌍</span>
            <span>{{ i18n.t('nav.destinos') }}</span>
          </a>
          <a routerLink="/minhas-viagens" (click)="mobileOpen=false" class="mobile-link">
            <span>✈️</span>
            <span>{{ i18n.t('nav.minhas_viagens') }}</span>
          </a>
          <a *ngIf="isAdmin()" routerLink="/admin/dashboard" (click)="mobileOpen=false" class="mobile-link admin-link">
            <span>👑</span>
            <span>{{ i18n.t('nav.admin') }}</span>
          </a>
          <a routerLink="/planejar" (click)="mobileOpen=false" class="mobile-link btn-planejar-mobile">
            <span>📅</span>
            <span>{{ i18n.t('nav.planejar') }}</span>
          </a>
        </div>

        <div class="mobile-menu-actions">
          <div class="mobile-lang-section">
            <div class="mobile-lang-label">🌐 Idioma</div>
            <div class="mobile-lang-options">
              <button (click)="setLanguage('pt'); mobileOpen=false" class="mobile-lang-btn" [class.active]="i18n.getCurrentLang() === 'pt'">🇵🇹 PT</button>
              <button (click)="setLanguage('en'); mobileOpen=false" class="mobile-lang-btn" [class.active]="i18n.getCurrentLang() === 'en'">🇬🇧 EN</button>
              <button (click)="setLanguage('fr'); mobileOpen=false" class="mobile-lang-btn" [class.active]="i18n.getCurrentLang() === 'fr'">🇫🇷 FR</button>
            </div>
          </div>
          
          <button (click)="toggleTheme(); mobileOpen=false" class="mobile-theme-btn">
            <span *ngIf="themeService.isDark()">☀️</span>
            <span *ngIf="!themeService.isDark()">🌙</span>
            <span>{{ themeService.isDark() ? 'Modo Claro' : 'Modo Escuro' }}</span>
          </button>
          
          <div *ngIf="!auth.isLoggedIn()" class="mobile-auth-buttons">
            <a routerLink="/login" (click)="mobileOpen=false" class="mobile-login-btn">🔑 {{ i18n.t('nav.login') }}</a>
            <a routerLink="/registar" (click)="mobileOpen=false" class="mobile-register-btn">📝 {{ i18n.t('nav.registar') }}</a>
          </div>
          
          <button (click)="logout()" *ngIf="auth.isLoggedIn()" class="mobile-logout-btn">🚪 {{ i18n.t('nav.sair') }}</button>
        </div>
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
      transition: all 0.3s ease;
    }

    .navbar.scrolled {
      background: var(--bg-card-solid);
      box-shadow: var(--shadow-md);
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      flex-shrink: 0;
    }

    .logo-text {
      font-size: 1.4rem;
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
      gap: 32px;
      flex: 1;
      justify-content: flex-end;
    }

    .nav-items {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      text-decoration: none;
      color: var(--text-secondary);
      font-weight: 500;
      font-size: 0.9rem;
      border-radius: 10px;
      transition: all 0.3s ease;
    }

    .nav-link:hover {
      background: var(--bg-hover);
      color: var(--color-secondary);
    }

    .nav-link.active {
      background: var(--gradient-primary);
      color: white;
    }

    .nav-link .nav-icon {
      font-size: 1.1rem;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-planejar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 20px;
      background: var(--gradient-primary);
      border-radius: 10px;
      text-decoration: none;
      color: white;
      font-weight: 600;
      font-size: 0.85rem;
      transition: all 0.3s ease;
    }

    .btn-planejar:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(108, 59, 212, 0.4);
    }

    .lang-selector {
      position: relative;
    }

    .lang-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      color: var(--text-primary);
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
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
      border-radius: 12px;
      overflow: hidden;
      min-width: 160px;
      box-shadow: var(--shadow-lg);
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
      font-size: 0.85rem;
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

    .lang-flag {
      font-size: 1.1rem;
    }

    .theme-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      cursor: pointer;
      font-size: 1.1rem;
      transition: all 0.2s ease;
    }

    .theme-btn:hover {
      border-color: var(--color-secondary);
      background: var(--bg-hover);
      transform: scale(1.05);
    }

    .btn-login, .btn-register {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      border-radius: 10px;
      font-weight: 500;
      font-size: 0.85rem;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .btn-login {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
    }

    .btn-login:hover {
      border-color: var(--color-secondary);
      color: var(--color-secondary);
      background: var(--bg-hover);
    }

    .btn-register {
      background: var(--gradient-primary);
      color: white;
    }

    .btn-register:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(108, 59, 212, 0.4);
    }

    /* User Avatar - Link direto para o perfil */
    .user-area {
      display: flex;
      align-items: center;
    }

    .user-avatar-link {
      text-decoration: none;
      display: block;
    }

    .user-avatar {
      width: 38px;
      height: 38px;
      background: var(--gradient-primary);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .user-avatar span {
      color: white;
      font-weight: 600;
      font-size: 1rem;
    }

    .user-avatar:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(108, 59, 212, 0.4);
    }

    /* Mobile Menu Button */
    .mobile-btn {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 30px;
      height: 20px;
      background: transparent;
      border: none;
      cursor: pointer;
    }

    .mobile-btn span {
      width: 100%;
      height: 2px;
      background: var(--text-primary);
      border-radius: 2px;
      transition: all 0.3s;
    }

    .mobile-btn:hover span {
      background: var(--color-secondary);
    }

    /* Mobile Menu */
    .mobile-menu {
      position: fixed;
      top: 0;
      right: -100%;
      width: 80%;
      max-width: 350px;
      height: 100vh;
      background: var(--bg-card-solid);
      backdrop-filter: blur(20px);
      border-left: 1px solid var(--border-color);
      transition: right 0.3s ease;
      z-index: 1001;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .mobile-menu.open {
      right: 0;
    }

    .mobile-menu-header {
      padding: 24px;
      border-bottom: 1px solid var(--border-color);
    }

    /* Mobile User Info - Link para o perfil */
    .mobile-user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      cursor: pointer;
    }

    .mobile-avatar {
      width: 50px;
      height: 50px;
      background: var(--gradient-primary);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      font-weight: bold;
      color: white;
    }

    .mobile-user-details strong {
      display: block;
      color: var(--text-primary);
      font-size: 1rem;
    }

    .mobile-user-details small {
      color: var(--text-secondary);
      font-size: 0.75rem;
    }

    .mobile-menu-links {
      padding: 16px 24px;
      border-bottom: 1px solid var(--border-color);
    }

    .mobile-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      color: var(--text-primary);
      text-decoration: none;
      font-size: 1rem;
      border-bottom: 1px solid var(--border-color);
      transition: all 0.2s;
    }

    .mobile-link:last-child {
      border-bottom: none;
    }

    .mobile-link:hover {
      color: var(--color-secondary);
      padding-left: 8px;
    }

    .btn-planejar-mobile {
      color: var(--color-secondary);
      font-weight: 600;
    }

    .mobile-menu-actions {
      padding: 16px 24px;
    }

    .mobile-lang-section {
      margin-bottom: 16px;
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
      flex: 1;
      padding: 10px;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      color: var(--text-primary);
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .mobile-lang-btn.active {
      background: var(--gradient-primary);
      color: white;
      border-color: transparent;
    }

    .mobile-theme-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 12px;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      color: var(--text-primary);
      font-size: 0.9rem;
      cursor: pointer;
      margin-bottom: 16px;
    }

    .mobile-auth-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .mobile-login-btn,
    .mobile-register-btn,
    .mobile-logout-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 500;
    }

    .mobile-login-btn {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
    }

    .mobile-register-btn {
      background: var(--gradient-primary);
      color: white;
    }

    .mobile-logout-btn {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #EF4444;
      width: 100%;
    }

    @media (max-width: 968px) {
      .nav-links {
        display: none;
      }
      .mobile-btn {
        display: flex;
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

  getUserInitial(): string {
    const nome = this.auth.usuario()?.nome || '';
    return nome.charAt(0).toUpperCase();
  }

  getCurrentFlag(): string {
    const flags = { pt: '🇵🇹', en: '🇬🇧', fr: '🇫🇷' };
    return flags[this.i18n.getCurrentLang()];
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