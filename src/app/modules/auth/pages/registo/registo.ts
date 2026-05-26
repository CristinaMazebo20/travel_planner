// modules/auth/registro/registro.ts (ou pages/registro/registro.ts)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-registo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <div class="logo">
            <span class="logo-icon">✈️</span>
            <span class="logo-text">Travel<span>ly</span></span>
          </div>
          <h1>Criar Conta</h1>
          <p>Junte-se a nós e comece a planear as suas viagens</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="register-form">
          <div class="form-group">
            <label>Nome Completo</label>
            <div class="input-icon">
              <span class="icon">👤</span>
              <input 
                type="text" 
                [(ngModel)]="nome" 
                name="nome"
                placeholder="Digite seu nome completo"
                required>
            </div>
          </div>

          <div class="form-group">
            <label>E-mail</label>
            <div class="input-icon">
              <span class="icon">📧</span>
              <input 
                type="email" 
                [(ngModel)]="email" 
                name="email"
                placeholder="seu@email.com"
                required>
            </div>
          </div>

          <div class="form-group">
            <label>Senha</label>
            <div class="input-icon">
              <span class="icon">🔒</span>
              <input 
                type="password" 
                [(ngModel)]="senha" 
                name="senha"
                placeholder="Mínimo 6 caracteres"
                required>
            </div>
          </div>

          <div class="form-group">
            <label>Confirmar Senha</label>
            <div class="input-icon">
              <span class="icon">🔒</span>
              <input 
                type="password" 
                [(ngModel)]="confirmarSenha" 
                name="confirmarSenha"
                placeholder="Digite a senha novamente"
                required>
            </div>
          </div>

          <div *ngIf="erro" class="error-message">
            <span>⚠️</span> {{ erro }}
          </div>

          <div *ngIf="sucesso" class="success-message">
            <span>✓</span> {{ sucesso }}
          </div>

          <button type="submit" class="btn-register" [disabled]="carregando">
            <span *ngIf="!carregando">Criar Conta</span>
            <span *ngIf="carregando">⏳ Criando conta...</span>
          </button>

          <div class="login-link">
            Já tem uma conta? <a routerLink="/login">Faça login</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: linear-gradient(135deg, #0A0F2E 0%, #1A1F4E 100%);
    }

    .register-card {
      max-width: 480px;
      width: 100%;
      background: rgba(17, 22, 61, 0.9);
      backdrop-filter: blur(20px);
      border-radius: 32px;
      padding: 48px 40px;
      border: 1px solid rgba(0, 217, 255, 0.2);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .register-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 24px;
    }

    .logo-icon {
      font-size: 32px;
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

    .register-header h1 {
      color: white;
      font-size: 1.8rem;
      margin-bottom: 8px;
    }

    .register-header p {
      color: #A0A8C6;
      font-size: 0.9rem;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      color: #A0A8C6;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .input-icon {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon .icon {
      position: absolute;
      left: 14px;
      font-size: 18px;
    }

    .input-icon input {
      width: 100%;
      padding: 14px 14px 14px 44px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(0, 217, 255, 0.2);
      border-radius: 12px;
      color: white;
      font-size: 0.95rem;
      transition: all 0.3s;
    }

    .input-icon input:focus {
      outline: none;
      border-color: #00D9FF;
      background: rgba(0, 0, 0, 0.5);
    }

    .input-icon input::placeholder {
      color: #4a5075;
    }

    .error-message {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 10px;
      padding: 12px;
      color: #EF4444;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .success-message {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 10px;
      padding: 12px;
      color: #10B981;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-register {
      background: linear-gradient(135deg, #6C3BD4, #00D9FF);
      border: none;
      padding: 14px;
      border-radius: 12px;
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 8px;
    }

    .btn-register:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(108, 59, 212, 0.4);
    }

    .btn-register:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .login-link {
      text-align: center;
      color: #A0A8C6;
      font-size: 0.85rem;
      margin-top: 16px;
    }

    .login-link a {
      color: #00D9FF;
      text-decoration: none;
      font-weight: 500;
    }

    .login-link a:hover {
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .register-card {
        padding: 32px 24px;
      }
    }
  `]
})
export class Registo {
  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  erro = '';
  sucesso = '';
  carregando = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  onSubmit() {
    // Validações
    if (!this.nome || !this.email || !this.senha || !this.confirmarSenha) {
      this.erro = 'Preencha todos os campos';
      this.notificationService.error('Preencha todos os campos');
      return;
    }
    
    if (this.senha !== this.confirmarSenha) {
      this.erro = 'As senhas não coincidem';
      this.notificationService.error('As senhas não coincidem');
      return;
    }
    
    if (this.senha.length < 6) {
      this.erro = 'A senha deve ter pelo menos 6 caracteres';
      this.notificationService.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.erro = 'Digite um e-mail válido';
      this.notificationService.error('Digite um e-mail válido');
      return;
    }

    this.carregando = true;
    this.erro = '';
    this.sucesso = '';

    this.authService.registar({ 
      nome: this.nome, 
      email: this.email, 
      senha: this.senha 
    }).subscribe({
      next: (response: any) => {
        this.carregando = false;
        
        if (response && response.success) {
          this.sucesso = 'Conta criada com sucesso! Redirecionando...';
          this.notificationService.success('Conta criada com sucesso!');
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.erro = response?.message || 'Erro ao criar conta';
          this.notificationService.error(this.erro);
        }
      },
      error: (err) => {
        this.carregando = false;
        console.error('Erro no registo:', err);
        
        let mensagem = 'Erro de conexão';
        if (err.status === 409) {
          mensagem = 'Este e-mail já está registado';
        } else if (err.status === 400) {
          mensagem = 'Dados inválidos. Verifique as informações';
        }
        
        this.erro = mensagem;
        this.notificationService.error(mensagem);
      }
    });
  }
}