// src/app/modules/perfil/pages/perfil/perfil.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { I18nService } from '../../../../core/services/i18n.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { UsuarioService } from '../../../../core/services/usuario.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="perfil-container">
      <div class="perfil-card">
        <div class="perfil-header">
        </div>

        <div class="avatar-section">
          <div class="avatar">
            <span>{{ getUserInitial() }}</span>
          </div>
          <h2>{{ usuario?.nome }}</h2>
          <p class="email">{{ usuario?.email }}</p>
          <span class="badge" [class.badge-admin]="usuario?.tipo === 'admin'" [class.badge-cliente]="usuario?.tipo === 'cliente'">
            {{ usuario?.tipo === 'admin' ? 'Administrador' : 'Cliente' }}
          </span>
        </div>

        <form (ngSubmit)="salvar()" class="perfil-form">
          <div class="form-group">
            <label>Nome completo</label>
            <input type="text" [(ngModel)]="formData.nome" name="nome" class="form-control" required>
          </div>

          <div class="form-group">
            <label>E-mail</label>
            <input type="email" [(ngModel)]="formData.email" name="email" class="form-control" required>
          </div>

          <div class="form-group">
            <label>Telefone</label>
            <input type="tel" [(ngModel)]="formData.telefone" name="telefone" class="form-control" placeholder="+244 999 999 999">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Nova senha</label>
              <input type="password" [(ngModel)]="formData.novaSenha" name="novaSenha" class="form-control" placeholder="Deixe vazio para manter">
            </div>
            <div class="form-group">
              <label>Confirmar senha</label>
              <input type="password" [(ngModel)]="formData.confirmarSenha" name="confirmarSenha" class="form-control" placeholder="Digite novamente">
            </div>
          </div>

          <div *ngIf="erro" class="error-message">{{ erro }}</div>
          <div *ngIf="sucesso" class="success-message">{{ sucesso }}</div>

          <div class="form-actions">
            <button type="button" class="btn-cancelar" (click)="voltar()">Cancelar</button>
            <button type="submit" class="btn-salvar" [disabled]="salvando">
              {{ salvando ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>

        <div class="logout-section">
          <button class="btn-logout" (click)="logout()">🚪 Sair</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .perfil-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 80px 20px 40px;
      background: var(--bg-primary);
    }
    .perfil-card {
      max-width: 600px;
      width: 100%;
      background: var(--bg-card);
      backdrop-filter: blur(10px);
      border-radius: 32px;
      padding: 40px;
      border: 1px solid var(--border-color);
    }
    .perfil-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }
    .btn-back {
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      padding: 8px 16px;
      border-radius: 10px;
      color: var(--text-secondary);
      cursor: pointer;
    }
    .theme-btn {
      width: 38px;
      height: 38px;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      cursor: pointer;
      font-size: 1.1rem;
    }
    .avatar-section {
      text-align: center;
      margin-bottom: 32px;
    }
    .avatar {
      width: 100px;
      height: 100px;
      background: var(--gradient-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }
    .avatar span { font-size: 3rem; font-weight: bold; color: white; }
    .avatar-section h2 { color: var(--text-primary); margin-bottom: 8px; }
    .email { color: var(--text-secondary); margin-bottom: 12px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; }
    .badge-admin { background: linear-gradient(135deg, #FF2E9A, #6C3BD4); color: white; }
    .badge-cliente { background: rgba(0,217,255,0.2); color: #00D9FF; }
    .perfil-form { margin-top: 24px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; color: var(--text-secondary); margin-bottom: 8px; font-size: 0.85rem; }
    .form-control { width: 100%; padding: 12px; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 10px; color: var(--text-primary); }
    .form-control:focus { outline: none; border-color: var(--color-secondary); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .error-message { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 10px; padding: 12px; color: #EF4444; margin-bottom: 20px; }
    .success-message { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 10px; padding: 12px; color: #10B981; margin-bottom: 20px; }
    .form-actions { display: flex; gap: 16px; justify-content: flex-end; margin-top: 24px; }
    .btn-cancelar, .btn-salvar { padding: 10px 24px; border-radius: 10px; cursor: pointer; }
    .btn-cancelar { background: transparent; border: 1px solid var(--border-color); color: var(--text-secondary); }
    .btn-salvar { background: var(--gradient-primary); border: none; color: white; }
    .btn-salvar:disabled { opacity: 0.6; cursor: not-allowed; }
    .logout-section { margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border-color); }
    .btn-logout { width: 100%; padding: 12px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 10px; color: #EF4444; cursor: pointer; }
    @media (max-width: 640px) {
      .perfil-card { padding: 24px; }
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class Perfil implements OnInit {
  usuario: any = null;
  formData: any = { nome: '', email: '', telefone: '', novaSenha: '', confirmarSenha: '' };
  salvando = false;
  erro = '';
  sucesso = '';

  constructor(
    public auth: AuthService,
    public themeService: ThemeService,
    private notificationService: NotificationService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuario = this.auth.usuario();
    if (this.usuario) {
      this.formData.nome = this.usuario.nome || '';
      this.formData.email = this.usuario.email || '';
      this.formData.telefone = this.usuario.telefone || '';
    }
  }

  voltar() { 
    this.router.navigate(['/destinos']); 
  }
  
  getUserInitial(): string { 
    return (this.usuario?.nome || '').charAt(0).toUpperCase(); 
  }
  
  toggleTheme() { 
    this.themeService.toggleTheme(); 
  }

  salvar() {
    if (!this.formData.nome || !this.formData.email) {
      this.erro = 'Preencha nome e email';
      return;
    }
    if (this.formData.novaSenha && this.formData.novaSenha !== this.formData.confirmarSenha) {
      this.erro = 'As senhas não coincidem';
      return;
    }
    if (this.formData.novaSenha && this.formData.novaSenha.length < 6) {
      this.erro = 'A senha deve ter pelo menos 6 caracteres';
      return;
    }

    this.salvando = true;
    this.erro = '';
    this.sucesso = '';

    const dados: any = { 
      nome: this.formData.nome, 
      email: this.formData.email, 
      telefone: this.formData.telefone 
    };
    
    if (this.formData.novaSenha) {
      dados.senha = this.formData.novaSenha;
    }

    this.usuarioService.atualizarPerfil(dados).subscribe({
      next: (response: any) => {
        this.salvando = false;
        if (response && response.success) {
          this.sucesso = 'Perfil atualizado com sucesso!';
          this.notificationService.success('Perfil atualizado!');
          const usuarioAtualizado = { ...this.usuario, ...dados };
          localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
          this.auth['usuarioSignal'].set(usuarioAtualizado);
          this.usuario = usuarioAtualizado;
          setTimeout(() => this.sucesso = '', 3000);
        } else {
          this.erro = response?.message || 'Erro ao salvar';
        }
      },
      error: () => {
        this.salvando = false;
        this.erro = 'Erro de conexão';
      }
    });
  }

  logout() { 
    this.auth.logout(); 
    this.router.navigate(['/login']); 
  }
}