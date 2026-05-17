import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="recuperar-container">
      <div class="recuperar-card">
        <div class="card-glow"></div>
        
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

        <h3>Recuperar senha</h3>
        <p>Digite seu email para receber instruções</p>

        <form (ngSubmit)="onSubmit()" *ngIf="!enviado">
          <div class="input-group">
            <input type="email" [(ngModel)]="email" name="email" required>
            <label>Email</label>
          </div>

          <div *ngIf="erro" class="error">{{ erro }}</div>

          <button type="submit" [disabled]="carregando" class="btn-recuperar">
            {{ carregando ? 'Enviando...' : 'Enviar instruções' }}
          </button>

          <div class="links">
            <a routerLink="/login">Voltar para o login</a>
          </div>
        </form>

        <div *ngIf="enviado" class="success-card">
          <div class="success-icon">✅</div>
          <h4>Email enviado!</h4>
          <p>{{ mensagem }}</p>
          <button class="btn-login" routerLink="/login">Ir para o login</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recuperar-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0A0F2E 0%, #1A1F4E 100%);
      padding: 20px;
    }

    .recuperar-card {
      position: relative;
      background: rgba(17, 22, 61, 0.8);
      backdrop-filter: blur(20px);
      border-radius: 32px;
      padding: 48px;
      width: 100%;
      max-width: 450px;
      border: 1px solid rgba(0,217,255,0.2);
      overflow: hidden;
    }

    .card-glow {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(108,59,212,0.2) 0%, transparent 70%);
      pointer-events: none;
    }

    .brand {
      text-align: center;
      margin-bottom: 32px;
    }

    .brand h2 {
      font-size: 1.8rem;
      margin-top: 12px;
      background: linear-gradient(135deg, #fff 0%, #6C3BD4 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .brand h2 span {
      color: #00D9FF;
      background: none;
    }

    h3 {
      font-size: 1.5rem;
      margin-bottom: 8px;
      text-align: center;
    }

    p {
      color: #A0A8C6;
      margin-bottom: 32px;
      text-align: center;
    }

    .input-group {
      position: relative;
      margin-bottom: 24px;
    }

    .input-group input {
      width: 100%;
      padding: 16px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      color: white;
      font-size: 1rem;
      transition: all 0.3s;
    }

    .input-group input:focus {
      outline: none;
      border-color: #00D9FF;
      box-shadow: 0 0 15px rgba(0,217,255,0.2);
    }

    .input-group label {
      position: absolute;
      left: 16px;
      top: 16px;
      color: #A0A8C6;
      transition: all 0.3s;
      pointer-events: none;
    }

    .input-group input:focus + label,
    .input-group input:not(:placeholder-shown) + label {
      top: -10px;
      left: 12px;
      font-size: 0.7rem;
      background: #1A1F4E;
      padding: 0 6px;
      color: #00D9FF;
    }

    .btn-recuperar {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #6C3BD4, #00D9FF);
      border: none;
      border-radius: 12px;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 16px;
    }

    .btn-recuperar:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(108,59,212,0.4);
    }

    .btn-recuperar:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-login {
      display: block;
      width: 100%;
      padding: 14px;
      background: transparent;
      border: 1px solid rgba(0,217,255,0.3);
      border-radius: 12px;
      color: #00D9FF;
      font-weight: 600;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      margin-top: 16px;
    }

    .error {
      color: #EF4444;
      font-size: 0.85rem;
      margin-top: -12px;
      margin-bottom: 16px;
    }

    .links {
      text-align: center;
      margin-top: 24px;
    }

    .links a {
      color: #A0A8C6;
      text-decoration: none;
      font-size: 0.85rem;
      transition: color 0.3s;
    }

    .links a:hover {
      color: #00D9FF;
    }

    .success-card {
      text-align: center;
    }

    .success-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .success-card h4 {
      font-size: 1.3rem;
      margin-bottom: 8px;
    }

    .success-card p {
      margin-bottom: 24px;
    }
  `]
})
export class RecuperarSenha {
  email = '';
  erro = '';
  mensagem = '';
  carregando = false;
  enviado = false;

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (!this.email) {
      this.erro = 'Digite seu email';
      return;
    }

    this.carregando = true;
    this.erro = '';

    // Simular requisição rápida (500ms)
    setTimeout(() => {
      this.carregando = false;
      this.enviado = true;
      this.mensagem = `Enviamos instruções de recuperação para ${this.email}`;
    }, 500);
  }
}