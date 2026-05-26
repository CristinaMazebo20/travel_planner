// modules/auth/pages/login/login.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { I18nService } from '../../../../core/services/i18n.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="brand">
          <svg width="50" height="50" viewBox="0 0 32 32" fill="none">
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
          <h2>Travel<span>ly</span></h2>
        </div>

        <h3>{{ i18n.t('login.titulo') }}</h3>
        <p>{{ i18n.t('login.subtitulo') }}</p>

        <form (ngSubmit)="onSubmit()">
          <div class="input-group">
            <input type="email" [(ngModel)]="email" name="email" required>
            <label>{{ i18n.t('login.email') }}</label>
          </div>

          <div class="input-group">
            <input type="password" [(ngModel)]="senha" name="senha" required>
            <label>{{ i18n.t('login.senha') }}</label>
          </div>

          <div *ngIf="erro" class="error">{{ erro }}</div>

          <button type="submit" [disabled]="carregando" class="btn-login">
            {{ carregando ? i18n.t('login.carregando') : i18n.t('login.entrar') }}
          </button>

          <div class="links">
            <a routerLink="/registar">{{ i18n.t('login.criar_conta') }}</a>
            <a routerLink="/recuperar-senha">{{ i18n.t('login.esqueceu_senha') }}</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0A0F2E 0%, #1A1F4E 100%);
      padding: 20px;
    }
    .login-card {
      background: rgba(17,22,61,0.8);
      backdrop-filter: blur(20px);
      border-radius: 32px;
      padding: 48px;
      width: 100%;
      max-width: 450px;
      border: 1px solid rgba(0,217,255,0.2);
    }
    .brand { text-align: center; margin-bottom: 32px; }
    .brand h2 { font-size: 1.8rem; margin-top: 12px; background: linear-gradient(135deg, #fff 0%, #6C3BD4 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .brand h2 span { color: #00D9FF; background: none; }
    h3 { font-size: 1.5rem; margin-bottom: 8px; text-align: center; color: white; }
    p { color: #A0A8C6; margin-bottom: 32px; text-align: center; }
    .input-group { position: relative; margin-bottom: 24px; }
    .input-group input { width: 100%; padding: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: white; font-size: 1rem; }
    .input-group input:focus { outline: none; border-color: #00D9FF; }
    .input-group label { position: absolute; left: 16px; top: 16px; color: #A0A8C6; transition: all 0.3s; pointer-events: none; }
    .input-group input:focus + label, .input-group input:not(:placeholder-shown) + label { top: -10px; left: 12px; font-size: 0.7rem; background: #1A1F4E; padding: 0 6px; color: #00D9FF; }
    .btn-login { width: 100%; padding: 16px; background: linear-gradient(135deg, #6C3BD4, #00D9FF); border: none; border-radius: 12px; color: white; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 16px; }
    .btn-login:disabled { opacity: 0.6; }
    .error { color: #EF4444; font-size: 0.85rem; margin-top: -12px; margin-bottom: 16px; }
    .links { display: flex; justify-content: space-between; margin-top: 24px; }
    .links a { color: #A0A8C6; text-decoration: none; font-size: 0.85rem; }
    .links a:hover { color: #00D9FF; }
  `]
})
export class Login {
  email = '';
  senha = '';
  erro = '';
  carregando = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    public i18n: I18nService
  ) {}

  onSubmit() {
    if (!this.email || !this.senha) {
      this.erro = this.i18n.t('login.erro_campos');
      return;
    }

    this.carregando = true;
    this.erro = '';

    this.authService.login(this.email, this.senha).subscribe({
      next: (response: any) => {
        this.carregando = false;
        if (response.success) {
          this.notificationService.success(this.i18n.t('login.sucesso'));
          this.router.navigate(['/destinos']);
        } else {
          this.erro = response.message || this.i18n.t('login.erro_credenciais');
        }
      },
      error: () => {
        this.carregando = false;
        this.erro = this.i18n.t('login.erro_conexao');
      }
    });
  }
}