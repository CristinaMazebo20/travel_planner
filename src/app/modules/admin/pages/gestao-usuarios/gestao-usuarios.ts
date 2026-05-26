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
          <button class="btn-back" (click)="voltar()">← {{ i18n.t('common.voltar') }}</button>
          <h1>👥 {{ i18n.t('usuarios_admin.titulo') }}</h1>
        </div>
        <div class="header-right">
        <button class="btn-refresh" (click)="carregarUsuarios()">🔄 {{ i18n.t('common.atualizar') }}</button>
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
                  🗑️ {{ i18n.t('common.excluir') }}
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
            <span class="modal-icon">⚠️</span>
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
    .admin-page { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .header-left { display: flex; align-items: center; gap: 16px; }
    .header-right { display: flex; align-items: center; gap: 12px; }
    .btn-back { background: rgba(0, 217, 255, 0.1); border: 1px solid rgba(0, 217, 255, 0.3); padding: 8px 16px; border-radius: 8px; color: #00D9FF; cursor: pointer; transition: all 0.2s; font-size: 0.9rem; }
    .btn-back:hover { background: rgba(0, 217, 255, 0.2); transform: translateX(-2px); }
    .page-header h1 { color: white; margin: 0; font-size: 1.8rem; }
    
    /* Language Selector */
    .lang-selector { position: relative; }
    .lang-btn { display: flex; align-items: center; gap: 6px; background: rgba(0, 217, 255, 0.1); border: 1px solid rgba(0, 217, 255, 0.3); border-radius: 8px; padding: 8px 12px; color: #00D9FF; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
    .lang-btn:hover { background: rgba(0, 217, 255, 0.2); }
    .lang-icon { transition: transform 0.2s; }
    .lang-selector:hover .lang-icon { transform: rotate(180deg); }
    .lang-dropdown { position: absolute; top: 100%; right: 0; margin-top: 8px; background: var(--bg-card-solid, #11123D); border: 1px solid rgba(0, 217, 255, 0.2); border-radius: 12px; overflow: hidden; min-width: 140px; z-index: 100; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); }
    .lang-item { display: block; width: 100%; padding: 10px 16px; background: transparent; border: none; color: var(--text-secondary, #A0A8C6); font-size: 0.85rem; cursor: pointer; text-align: left; transition: all 0.2s; }
    .lang-item:hover { background: rgba(0, 217, 255, 0.1); color: #00D9FF; }
    .lang-item.active { background: linear-gradient(135deg, #6C3BD4, #00D9FF); color: white; }
    
    /* Theme Button */
    .theme-btn { background: rgba(0, 217, 255, 0.1); border: 1px solid rgba(0, 217, 255, 0.3); border-radius: 8px; width: 36px; height: 36px; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .theme-btn:hover { background: rgba(0, 217, 255, 0.2); transform: scale(1.05); }
    
    .btn-refresh { background: linear-gradient(135deg, #6C3BD4, #00D9FF); border: none; padding: 10px 24px; border-radius: 8px; color: white; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-refresh:hover { transform: translateY(-2px); }
    .table-container { background: rgba(17, 22, 61, 0.8); border-radius: 12px; overflow-x: auto; border: 1px solid rgba(0, 217, 255, 0.1); min-height: 400px; }
    .admin-table { width: 100%; border-collapse: collapse; }
    .admin-table th, .admin-table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid rgba(0, 217, 255, 0.1); color: #A0A8C6; }
    .admin-table th { color: white; font-weight: 600; background: rgba(0, 0, 0, 0.3); }
    .admin-table tr:hover { background: rgba(0, 217, 255, 0.05); }
    .tipo-select { background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(0, 217, 255, 0.3); border-radius: 6px; color: white; padding: 6px 12px; cursor: pointer; }
    .tipo-select:focus { outline: none; border-color: #00D9FF; }
    .tipo-select:disabled { opacity: 0.5; cursor: not-allowed; }
    .actions { text-align: center; }
    .btn-delete { background: #EF4444; border: none; padding: 6px 14px; border-radius: 6px; color: white; cursor: pointer; transition: all 0.2s; }
    .btn-delete:hover:not(:disabled) { transform: scale(1.05); background: #dc2626; }
    .btn-delete:disabled { opacity: 0.5; cursor: not-allowed; }
    .empty-table { text-align: center; padding: 60px !important; color: #A0A8C6; }
    .loading { text-align: center; padding: 60px; color: #A0A8C6; }
    .spinner { width: 50px; height: 50px; border: 3px solid rgba(0, 217, 255, 0.1); border-top-color: #00D9FF; border-radius: 50%; margin: 0 auto 20px; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    /* Modal de Confirmação */
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-container { background: var(--bg-modal, #11123D); border-radius: 20px; width: 450px; max-width: 90%; border: 1px solid rgba(0, 217, 255, 0.2); animation: modalFadeIn 0.3s ease; }
    @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid rgba(0, 217, 255, 0.1); }
    .modal-title { display: flex; align-items: center; gap: 12px; }
    .modal-icon { font-size: 24px; }
    .modal-title h2 { color: white; margin: 0; font-size: 1.3rem; }
    .modal-close { background: none; border: none; color: #A0A8C6; font-size: 24px; cursor: pointer; transition: color 0.2s; }
    .modal-close:hover { color: #EF4444; }
    .modal-body { padding: 24px; }
    .modal-body p { color: #A0A8C6; margin-bottom: 16px; }
    .usuario-info { background: rgba(0, 217, 255, 0.05); padding: 12px; border-radius: 8px; text-align: center; }
    .usuario-info strong { color: white; }
    .aviso { color: #EF4444 !important; font-size: 0.85rem; margin-top: 16px; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 20px 24px; border-top: 1px solid rgba(0, 217, 255, 0.1); }
    .btn-cancel, .btn-confirm-delete { padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-cancel { background: transparent; border: 1px solid #A0A8C6; color: #A0A8C6; }
    .btn-cancel:hover { background: rgba(160, 168, 198, 0.1); }
    .btn-confirm-delete { background: #EF4444; border: none; color: white; }
    .btn-confirm-delete:hover:not(:disabled) { transform: translateY(-2px); background: #dc2626; }
    .btn-confirm-delete:disabled { opacity: 0.5; cursor: not-allowed; }
    
    @media (max-width: 768px) {
      .page-header { flex-direction: column; align-items: flex-start; }
      .header-right { width: 100%; justify-content: flex-end; }
    }
  `]
})
export class GestaoUsuarios implements OnInit {
  usuarios: Usuario[] = [];
  adminId: number = 0;
  carregando = true;
  langMenuOpen = false;
  
  // Modal de confirmação
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
  ) {
    // Fechar dropdown ao clicar fora
    document.addEventListener('click', (event) => {
      if (!(event.target as Element).closest('.lang-selector')) {
        this.langMenuOpen = false;
      }
    });
  }

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