import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';

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
          <a routerLink="/destinos" routerLinkActive="active">Destinos</a>
          <a routerLink="/minhas-viagens" routerLinkActive="active">Minhas Viagens</a>
          <a routerLink="/planejar" routerLinkActive="active" class="btn-planejar">Planejar Viagem</a>

          <div class="user-area">
            <ng-container *ngIf="!auth.isLoggedIn(); else userMenu">
              <a routerLink="/login" class="btn-login">Entrar</a>
              <a routerLink="/registar" class="btn-register">Registar</a>
            </ng-container>
            <ng-template #userMenu>
              <div class="user-menu">
                <span class="user-name">{{ (auth.usuario()?.nome || '').split(' ')[0] }}</span>
                <button class="btn-logout" (click)="logout()">Sair</button>
              </div>
            </ng-template>
          </div>
        </div>

        <button class="mobile-btn" (click)="mobileOpen = !mobileOpen">☰</button>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="mobileOpen">
        <a routerLink="/destinos" (click)="mobileOpen=false">Destinos</a>
        <a routerLink="/minhas-viagens" (click)="mobileOpen=false">Minhas Viagens</a>
        <a routerLink="/planejar" (click)="mobileOpen=false">Planejar</a>
        <a routerLink="/login" (click)="mobileOpen=false" *ngIf="!auth.isLoggedIn()">Entrar</a>
        <a routerLink="/registar" (click)="mobileOpen=false" *ngIf="!auth.isLoggedIn()">Registar</a>
        <button (click)="logout()" *ngIf="auth.isLoggedIn()">Sair</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(10, 15, 46, 0.9);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--glass-border);
      z-index: 1000;
      transition: all 0.3s;
    }

    .navbar.scrolled {
      background: rgba(10, 15, 46, 0.98);
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
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
      background: linear-gradient(135deg, #fff 0%, #6C3BD4 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .logo-text span {
      color: #00D9FF;
      background: none;
      -webkit-background-clip: unset;
      background-clip: unset;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 28px;
    }

    .nav-links a {
      text-decoration: none;
      color: var(--text-secondary);
      font-weight: 500;
      transition: all 0.3s;
      position: relative;
    }

    .nav-links a:hover {
      color: var(--secondary);
    }

    .nav-links a.active {
      color: var(--secondary);
    }

    .nav-links a.active::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #6C3BD4, #00D9FF);
      border-radius: 2px;
    }

    .btn-planejar {
      background: linear-gradient(135deg, #6C3BD4, #00D9FF);
      padding: 10px 20px;
      border-radius: 30px;
      color: white !important;
    }

    .btn-planejar:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(108,59,212,0.4);
    }

    .btn-login, .btn-register, .btn-logout {
      padding: 8px 20px;
      border-radius: 30px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-login {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-secondary);
    }

    .btn-login:hover {
      border-color: var(--secondary);
      color: var(--secondary);
    }

    .btn-register, .btn-logout {
      background: linear-gradient(135deg, #6C3BD4, #00D9FF);
      border: none;
      color: white;
    }

    .btn-logout {
      background: linear-gradient(135deg, #FF2E9A, #6C3BD4);
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .user-name {
      color: var(--secondary);
      font-weight: 500;
    }

    .mobile-btn {
      display: none;
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
    }

    .mobile-menu {
      display: none;
      flex-direction: column;
      padding: 20px;
      background: var(--bg-primary);
      border-top: 1px solid var(--border);
    }

    .mobile-menu.open {
      display: flex;
    }

    .mobile-menu a, .mobile-menu button {
      padding: 12px 0;
      color: white;
      text-decoration: none;
      background: none;
      border: none;
      text-align: left;
      border-bottom: 1px solid var(--border);
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

  constructor(public auth: AuthService, public i18n: I18nService) {
    setInterval(() => this.auth.usuario(), 1000);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 30;
  }

  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }
}