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
              <span class="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12H22M12 2C14.5 4.5 15.5 8 12 12C8.5 8 9.5 4.5 12 2Z"/>
                </svg>
              </span>
              <span>{{ i18n.t('nav.destinos') }}</span>
            </a>
            <a routerLink="/minhas-viagens" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M3 15L6 12L9 15L12 12L15 15L18 12L21 15"/>
                  <path d="M3 9L6 6L9 9L12 6L15 9L18 6L21 9"/>
                  <path d="M3 19L6 16L9 19L12 16L15 19L18 16L21 19"/>
                </svg>
              </span>
              <span>{{ i18n.t('nav.minhas_viagens') }}</span>
            </a>
            <a *ngIf="isAdmin()" routerLink="/admin/dashboard" routerLinkActive="active" class="nav-link admin-link">
              <span class="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" fill="currentColor" fill-opacity="0.2"/>
                </svg>
              </span>
              <span>{{ i18n.t('nav.admin') }}</span>
            </a>
          </div>

          <div class="nav-actions">
            <a routerLink="/planejar" routerLinkActive="active" class="btn-planejar">
              <span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                  <path d="M8 14H16M12 14V18" stroke="currentColor" stroke-linecap="round"/>
                </svg>
              </span>
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
              <svg *ngIf="themeService.isDark()" class="theme-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="1.8"/>
                <path d="M12 2V3M12 21V22M22 12H21M3 12H2M19.07 4.93L18.36 5.64M5.64 18.36L4.93 19.07M19.07 19.07L18.36 18.36M5.64 5.64L4.93 4.93" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              <svg *ngIf="!themeService.isDark()" class="theme-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1583 17.4668C18.1127 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.748 21.1181 10.0795 20.7461C8.41104 20.3741 6.88299 19.5345 5.67423 18.3258C4.46548 17.117 3.62591 15.589 3.25388 13.9205C2.88186 12.252 2.9927 10.5121 3.57346 8.9043C4.15423 7.2965 5.18079 5.88731 6.53318 4.8417C7.88557 3.79609 9.50776 3.15731 11.21 3C10.2133 4.34827 9.73383 6.00945 9.85853 7.68141C9.98323 9.35338 10.7039 10.9251 11.8894 12.1106C13.0749 13.2961 14.6466 14.0168 16.3186 14.1415C17.9906 14.2662 19.6518 13.7867 21 12.79Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <div class="user-area">
              <ng-container *ngIf="!auth.isLoggedIn(); else userMenu">
                <a routerLink="/login" class="btn-login">
                  <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M15 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H15"/>
                      <path d="M10 17L15 12L10 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                      <line x1="15" y1="12" x2="3" y2="12" stroke="currentColor"/>
                    </svg>
                  </span>
                  <span>{{ i18n.t('nav.login') }}</span>
                </a>
                <a routerLink="/registar" class="btn-register">
                  <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21"/>
                      <circle cx="12" cy="7" r="4"/>
                      <path d="M17 3C19.2 3 21 4.8 21 7"/>
                      <path d="M7 3C4.8 3 3 4.8 3 7"/>
                    </svg>
                  </span>
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

        <button class="mobile-btn" (click)="mobileOpen = !mobileOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div class="mobile-menu" [class.open]="mobileOpen">
        <div class="mobile-menu-header">
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12H22M12 2C14.5 4.5 15.5 8 12 12C8.5 8 9.5 4.5 12 2Z"/>
            </svg>
            <span>{{ i18n.t('nav.destinos') }}</span>
          </a>
          <a routerLink="/minhas-viagens" (click)="mobileOpen=false" class="mobile-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M3 15L6 12L9 15L12 12L15 15L18 12L21 15"/>
              <path d="M3 9L6 6L9 9L12 6L15 9L18 6L21 9"/>
              <path d="M3 19L6 16L9 19L12 16L15 19L18 16L21 19"/>
            </svg>
            <span>{{ i18n.t('nav.minhas_viagens') }}</span>
          </a>
          <a *ngIf="isAdmin()" routerLink="/admin/dashboard" (click)="mobileOpen=false" class="mobile-link admin-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" fill="currentColor" fill-opacity="0.2"/>
            </svg>
            <span>{{ i18n.t('nav.admin') }}</span>
          </a>
          <a routerLink="/planejar" (click)="mobileOpen=false" class="mobile-link btn-planejar-mobile">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
              <path d="M8 14H16M12 14V18" stroke="currentColor" stroke-linecap="round"/>
            </svg>
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
            <svg *ngIf="themeService.isDark()" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="1.8"/>
              <path d="M12 2V3M12 21V22M22 12H21M3 12H2M19.07 4.93L18.36 5.64M5.64 18.36L4.93 19.07M19.07 19.07L18.36 18.36M5.64 5.64L4.93 4.93" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <svg *ngIf="!themeService.isDark()" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1583 17.4668C18.1127 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.748 21.1181 10.0795 20.7461C8.41104 20.3741 6.88299 19.5345 5.67423 18.3258C4.46548 17.117 3.62591 15.589 3.25388 13.9205C2.88186 12.252 2.9927 10.5121 3.57346 8.9043C4.15423 7.2965 5.18079 5.88731 6.53318 4.8417C7.88557 3.79609 9.50776 3.15731 11.21 3C10.2133 4.34827 9.73383 6.00945 9.85853 7.68141C9.98323 9.35338 10.7039 10.9251 11.8894 12.1106C13.0749 13.2961 14.6466 14.0168 16.3186 14.1415C17.9906 14.2662 19.6518 13.7867 21 12.79Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ themeService.isDark() ? 'Modo Claro' : 'Modo Escuro' }}</span>
          </button>
          
          <div *ngIf="!auth.isLoggedIn()" class="mobile-auth-buttons">
            <a routerLink="/login" (click)="mobileOpen=false" class="mobile-login-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M15 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H15"/>
                <path d="M10 17L15 12L10 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="15" y1="12" x2="3" y2="12" stroke="currentColor"/>
              </svg>
              {{ i18n.t('nav.login') }}
            </a>
            <a routerLink="/registar" (click)="mobileOpen=false" class="mobile-register-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21"/>
                <circle cx="12" cy="7" r="4"/>
                <path d="M17 3C19.2 3 21 4.8 21 7"/>
                <path d="M7 3C4.8 3 3 4.8 3 7"/>
              </svg>
              {{ i18n.t('nav.registar') }}
            </a>
          </div>
          
          <button (click)="logout()" *ngIf="auth.isLoggedIn()" class="mobile-logout-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M9 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H9" stroke="currentColor"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor"/>
            </svg>
            {{ i18n.t('nav.sair') }}
          </button>
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
      background: transparent;
      color: var(--color-secondary);
      font-weight: 700;
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      stroke: currentColor;
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
      padding: 8px 16px;
      text-decoration: none;
      color: var(--text-secondary);
      font-weight: 500;
      font-size: 0.9rem;
      border-radius: 10px;
      transition: all 0.3s ease;
      background: transparent;
      border: none;
      cursor: pointer;
    }

    .btn-planejar:hover {
      background: var(--bg-hover);
      color: var(--color-secondary);
      transform: none;
      box-shadow: none;
    }

    .btn-planejar.active {
      background: transparent;
      color: var(--color-secondary);
      font-weight: 700;
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
      transition: all 0.2s ease;
    }

    .theme-btn:hover {
      border-color: var(--color-secondary);
      background: var(--bg-hover);
      transform: scale(1.05);
    }

    .theme-icon {
      transition: transform 0.3s ease;
    }

    .theme-btn:hover .theme-icon {
      transform: rotate(15deg);
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

    .mobile-theme-btn .theme-icon {
      margin-right: 4px;
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

    /* ========================================
       LIGHT MODE - CORES ESCURAS PARA MELHOR LEGIBILIDADE
       ======================================== */
    body.light-theme .navbar {
      background: rgba(255, 255, 255, 0.98);
      border-bottom-color: #E2E8F0;
    }

    body.light-theme .navbar.scrolled {
      background: #FFFFFF;
    }

    body.light-theme .nav-link {
      color: #1e293b !important;
    }

    body.light-theme .nav-icon {
      stroke: #1e293b !important;
    }

    body.light-theme .nav-link:hover,
    body.light-theme .nav-link:hover .nav-icon {
      color: #3B82F6 !important;
      stroke: #3B82F6 !important;
    }

    body.light-theme .nav-link.active,
    body.light-theme .nav-link.active .nav-icon {
      color: #3B82F6 !important;
      stroke: #3B82F6 !important;
      background: transparent !important;
      font-weight: 700;
    }

    body.light-theme .btn-planejar {
      color: #1e293b !important;
      background: transparent !important;
      border: none !important;
    }

    body.light-theme .btn-planejar span svg {
      stroke: #1e293b !important;
    }

    body.light-theme .btn-planejar:hover,
    body.light-theme .btn-planejar:hover span svg {
      color: #3B82F6 !important;
      stroke: #3B82F6 !important;
      background: #F1F5F9 !important;
    }

    body.light-theme .btn-planejar.active,
    body.light-theme .btn-planejar.active span svg {
      color: #3B82F6 !important;
      stroke: #3B82F6 !important;
      background: transparent !important;
      font-weight: 700;
    }

    body.light-theme .lang-btn {
      background: #F1F5F9;
      border-color: #E2E8F0;
      color: #1E293B;
    }

    body.light-theme .lang-btn:hover {
      background: #E2E8F0;
    }

    body.light-theme .lang-dropdown {
      background: #FFFFFF;
      border-color: #E2E8F0;
    }

    body.light-theme .lang-item {
      color: #475569;
    }

    body.light-theme .lang-item:hover {
      background: #F1F5F9;
      color: #3B82F6;
    }

    body.light-theme .theme-btn {
      background: #F1F5F9;
      border-color: #E2E8F0;
    }

    body.light-theme .theme-btn:hover {
      background: #E2E8F0;
    }

    body.light-theme .btn-login {
      border-color: #CBD5E1;
      color: #475569;
    }

    body.light-theme .btn-login:hover {
      border-color: #3B82F6;
      color: #3B82F6;
    }

    body.light-theme .mobile-menu {
      background: #FFFFFF;
    }

    body.light-theme .mobile-link {
      color: #1E293B;
      border-bottom-color: #E2E8F0;
    }

    body.light-theme .mobile-link svg {
      stroke: #1E293B;
    }

    body.light-theme .mobile-link:hover {
      color: #3B82F6;
    }

    body.light-theme .mobile-link:hover svg {
      stroke: #3B82F6;
    }

    body.light-theme .mobile-lang-btn {
      background: #F1F5F9;
      border-color: #E2E8F0;
      color: #1E293B;
    }

    body.light-theme .mobile-lang-btn.active {
      background: linear-gradient(135deg, #6C3BD4, #3B82F6);
      color: white;
    }

    body.light-theme .mobile-theme-btn {
      background: #F1F5F9;
      border-color: #E2E8F0;
      color: #1E293B;
    }

    body.light-theme .mobile-login-btn {
      border-color: #CBD5E1;
      color: #475569;
    }

    body.light-theme .mobile-user-details strong {
      color: #1E293B;
    }

    body.light-theme .mobile-user-details small {
      color: #64748B;
    }

    body.light-theme .mobile-btn span {
      background: #1E293B;
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