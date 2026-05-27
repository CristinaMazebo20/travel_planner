// modules/admin/pages/gestao-usuarios/gestao-usuarios.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService, Usuario } from '../../../../core/services/usuario.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { I18nService } from '../../../../core/services/i18n.service';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-gestao-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <div class="header-left">
          <button class="btn-back" (click)="voltar()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {{ i18n.t('common.voltar') }}
          </button>
          <h1>
            <svg class="header-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21"/>
              <circle cx="12" cy="7" r="4"/>
              <path d="M17 3C19.2 3 21 4.8 21 7"/>
              <path d="M7 3C4.8 3 3 4.8 3 7"/>
            </svg>
            {{ i18n.t('usuarios_admin.titulo') }}
          </h1>
        </div>
        <div class="header-right">
          <button class="btn-refresh" (click)="carregarUsuarios()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            {{ i18n.t('common.atualizar') }}
          </button>
        </div>
      </div>

      <div class="table-container">
        <div *ngIf="carregando" class="loading">
          <div class="spinner"></div>
          <p>{{ i18n.t('common.carregando') }}</p>
        </div>

        <table class="admin-table" *ngIf="!carregando">
          <thead>
            <tr>
              <th>ID</th>
              <th>{{ i18n.t('usuarios_admin.nome') }}</th>
              <th>{{ i18n.t('usuarios_admin.email') }}</th>
              <th>{{ i18n.t('usuarios_admin.tipo') }}</th>
              <th>{{ i18n.t('usuarios_admin.telefone') }}</th>
              <th>{{ i18n.t('usuarios_admin.data_cadastro') }}</th>
              <th>{{ i18n.t('common.acoes') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let usuario of usuarios">
              <td>{{ usuario.id }}</td>
              <td>{{ usuario.nome }}</td>
              <td>{{ usuario.email }}</td>
              <td>
                <select 
                  [(ngModel)]="usuario.tipo" 
                  (change)="atualizarTipo(usuario)" 
                  class="tipo-select"
                  [disabled]="usuario.id === adminId">
                  <option value="cliente">{{ i18n.t('usuarios_admin.cliente') }}</option>
                  <option value="admin">{{ i18n.t('usuarios_admin.admin') }}</option>
                </select>
              </td>
              <td>{{ usuario.telefone || '-' }}</td>
              <td>{{ usuario.created_at | date:'dd/MM/yyyy' }}</td>
              <td class="actions">
                <button 
                  class="btn-delete" 
                  (click)="abrirModalConfirmacao(usuario)" 
                  [disabled]="usuario.id === adminId"
                  [title]="usuario.id === adminId ? i18n.t('usuarios_admin.nao_excluir_proprio') : i18n.t('common.excluir')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
                  </svg>
                  {{ i18n.t('common.excluir') }}
                </button>
              </td>
            </tr>
            <tr *ngIf="usuarios.length === 0">
              <td colspan="7" class="empty-table">
                {{ i18n.t('usuarios_admin.nenhum_encontrado') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Confirmação de Exclusão -->
    <div class="modal-overlay" *ngIf="modalConfirmacaoAberto" (click)="fecharModalConfirmacao()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="modal-title">
            <span class="modal-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
              </svg>
            </span>
            <h2>{{ i18n.t('modal.confirmar_exclusao.titulo') }}</h2>
          </div>
          <button class="modal-close" (click)="fecharModalConfirmacao()">✕</button>
        </div>
        <div class="modal-body">
          <p>{{ i18n.t('modal.confirmar_exclusao.mensagem') }}</p>
          <p class="usuario-info">
            <strong>{{ usuarioSelecionado?.nome }}</strong> ({{ usuarioSelecionado?.email }})
          </p>
          <p class="aviso">{{ i18n.t('modal.confirmar_exclusao.aviso') }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" (click)="fecharModalConfirmacao()">{{ i18n.t('common.cancelar') }}</button>
          <button class="btn-confirm-delete" (click)="confirmarExclusao()" [disabled]="excluindo">
            {{ excluindo ? i18n.t('common.excluindo') : i18n.t('common.excluir') }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page { padding: 24px; min-height: 100vh; background: var(--bg-primary); }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .header-left { display: flex; align-items: center; gap: 16px; }
    .header-right { display: flex; align-items: center; gap: 12px; }
    .btn-back { display: flex; align-items: center; gap: 8px; background: var(--bg-input); border: 1px solid var(--border-color); padding: 8px 16px; border-radius: 8px; color: var(--color-secondary); cursor: pointer; transition: all 0.2s; font-size: 0.9rem; }
    .btn-back:hover { background: var(--bg-hover); transform: translateX(-2px); }
    .page-header h1 { display: inline-flex; align-items: center; gap: 8px; color: var(--text-primary); margin: 0; font-size: 1.8rem; }
    .header-icon { stroke: var(--color-secondary); }
    .btn-refresh { display: inline-flex; align-items: center; gap: 8px; background: var(--gradient-primary); border: none; padding: 10px 24px; border-radius: 8px; color: white; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-refresh:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
    .table-container { background: var(--bg-card); border-radius: 12px; overflow-x: auto; border: 1px solid var(--border-color); min-height: 400px; }
    .admin-table { width: 100%; border-collapse: collapse; }
    .admin-table th, .admin-table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid var(--border-color); color: var(--text-secondary); }
    .admin-table th { color: var(--text-primary); font-weight: 600; background: var(--bg-tertiary); }
    .admin-table tr:hover { background: var(--bg-hover); }
    .tipo-select { background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary); padding: 6px 12px; cursor: pointer; }
    .tipo-select:focus { outline: none; border-color: var(--color-secondary); }
    .tipo-select:disabled { opacity: 0.5; cursor: not-allowed; }
    .actions { text-align: center; }
    .btn-delete { display: inline-flex; align-items: center; gap: 6px; background: #EF4444; border: none; padding: 6px 14px; border-radius: 6px; color: white; cursor: pointer; transition: all 0.2s; }
    .btn-delete:hover:not(:disabled) { transform: scale(1.05); background: #dc2626; }
    .btn-delete:disabled { opacity: 0.5; cursor: not-allowed; }
    .empty-table { text-align: center; padding: 60px !important; color: var(--text-secondary); }
    .loading { text-align: center; padding: 60px; color: var(--text-secondary); }
    .spinner { width: 50px; height: 50px; border: 3px solid var(--border-color); border-top-color: var(--color-secondary); border-radius: 50%; margin: 0 auto 20px; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-container { background: var(--bg-modal); border-radius: 20px; width: 450px; max-width: 90%; border: 1px solid var(--border-color); animation: modalFadeIn 0.3s ease; }
    @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--border-color); }
    .modal-title { display: flex; align-items: center; gap: 12px; }
    .modal-icon { display: flex; align-items: center; }
    .modal-title h2 { color: var(--text-primary); margin: 0; font-size: 1.3rem; }
    .modal-close { background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer; transition: color 0.2s; }
    .modal-close:hover { color: #EF4444; }
    .modal-body { padding: 24px; }
    .modal-body p { color: var(--text-secondary); margin-bottom: 16px; }
    .usuario-info { background: var(--bg-hover); padding: 12px; border-radius: 8px; text-align: center; }
    .usuario-info strong { color: var(--text-primary); }
    .aviso { color: #EF4444 !important; font-size: 0.85rem; margin-top: 16px; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 20px 24px; border-top: 1px solid var(--border-color); }
    .btn-cancel, .btn-confirm-delete { padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-cancel { background: transparent; border: 1px solid var(--border-color); color: var(--text-secondary); }
    .btn-cancel:hover { background: var(--bg-hover); }
    .btn-confirm-delete { background: #EF4444; border: none; color: white; }
    .btn-confirm-delete:hover:not(:disabled) { transform: translateY(-2px); background: #dc2626; }
    .btn-confirm-delete:disabled { opacity: 0.5; cursor: not-allowed; }
    @media (max-width: 768px) { 
      .page-header { flex-direction: column; align-items: flex-start; } 
      .header-right { width: 100%; justify-content: flex-end; } 
    }
    body.light-theme .admin-page { background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%); }
    body.light-theme .btn-back { background: #FFFFFF; border-color: #E2E8F0; color: #3B82F6; }
    body.light-theme .btn-back:hover { background: #F1F5F9; }
    body.light-theme .table-container { background: #FFFFFF; border-color: #E2E8F0; }
    body.light-theme .admin-table th { background: #F8FAFC; }
    body.light-theme .modal-container { background: #FFFFFF; }
    body.light-theme .modal-title h2 { color: #1E293B; }
    body.light-theme .tipo-select { background: #F9FAFB; border-color: #E2E8F0; color: #1E293B; }
  `]
})
export class GestaoUsuarios implements OnInit {
  usuarios: Usuario[] = [];
  adminId: number = 0;
  carregando = true;
  
  modalConfirmacaoAberto = false;
  usuarioSelecionado: Usuario | null = null;
  excluindo = false;

  constructor(
    private usuarioService: UsuarioService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public i18n: I18nService,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    const usuario = this.authService.usuario();
    if (usuario && usuario.id) {
      this.adminId = usuario.id;
    }
    this.carregarUsuarios();
  }

  voltar() {
    this.router.navigate(['/admin/dashboard']);
  }

  carregarUsuarios() {
    this.carregando = true;
    this.usuarioService.listar().subscribe({
      next: (response: any) => {
        this.carregando = false;
        if (response && response.success) {
          this.usuarios = response.data || [];
        } else {
          this.notificationService.error(response?.message || this.i18n.t('common.erro'));
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregando = false;
        this.notificationService.error(this.i18n.t('common.erro_conexao'));
        this.cdr.detectChanges();
      }
    });
  }

  atualizarTipo(usuario: Usuario) {
    if (usuario.id === this.adminId) {
      this.notificationService.error(this.i18n.t('usuarios_admin.nao_alterar_proprio'));
      this.carregarUsuarios();
      return;
    }
    
    this.usuarioService.atualizarTipo(usuario.id, usuario.tipo).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.notificationService.success(this.i18n.t('usuarios_admin.tipo_atualizado'));
        } else {
          this.notificationService.error(response?.message || this.i18n.t('common.erro'));
          this.carregarUsuarios();
        }
      },
      error: () => {
        this.notificationService.error(this.i18n.t('common.erro_atualizar_tipo'));
        this.carregarUsuarios();
      }
    });
  }

  abrirModalConfirmacao(usuario: Usuario) {
    this.usuarioSelecionado = usuario;
    this.modalConfirmacaoAberto = true;
  }

  fecharModalConfirmacao() {
    this.modalConfirmacaoAberto = false;
    this.usuarioSelecionado = null;
    this.excluindo = false;
  }

  confirmarExclusao() {
    if (!this.usuarioSelecionado) return;
    
    this.excluindo = true;
    
    this.usuarioService.deletar(this.usuarioSelecionado.id).subscribe({
      next: (response: any) => {
        this.excluindo = false;
        if (response && response.success) {
          this.notificationService.success(this.i18n.t('usuarios_admin.sucesso_excluir'));
          this.fecharModalConfirmacao();
          this.carregarUsuarios();
        } else {
          this.notificationService.error(response?.message || this.i18n.t('common.erro'));
        }
      },
      error: () => {
        this.excluindo = false;
        this.notificationService.error(this.i18n.t('common.erro_excluir_usuario'));
      }
    });
  }
}