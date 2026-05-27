// modules/admin/pages/gestao-destinos/gestao-destinos.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DestinoService, Destino } from '../../../../core/services/destino.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { I18nService } from '../../../../core/services/i18n.service';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-gestao-destinos',
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
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12H22M12 2C14.5 4.5 15.5 8 12 12C8.5 8 9.5 4.5 12 2Z"/>
            </svg>
            {{ i18n.t('destinos_admin.titulo') }}
          </h1>
        </div>
        <div class="header-right">
          <button class="btn-add" (click)="abrirModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {{ i18n.t('destinos_admin.novo') }}
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
              <th>{{ i18n.t('destinos_admin.imagem') }}</th>
              <th>{{ i18n.t('destinos_admin.nome') }}</th>
              <th>{{ i18n.t('destinos_admin.pais') }}</th>
              <th>{{ i18n.t('destinos_admin.cidade') }}</th>
              <th>{{ i18n.t('destinos_admin.preco') }}</th>
              <th>{{ i18n.t('common.acoes') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let destino of destinos">
              <td>{{ destino.id }}</td>
              <td>
                <img [src]="destino.imagem || 'https://placehold.co/50x50?text=Sem+Imagem'" 
                     class="table-img" 
                     [alt]="destino.nome">
               </td>
              <td>{{ destino.nome }}</td>
              <td>{{ destino.pais }}</td>
              <td>{{ destino.cidade }}</td>
              <td>{{ destino.preco | number }} Kz</td>
              <td class="actions">
                <button class="btn-edit" (click)="editar(destino)" title="{{ i18n.t('common.editar') }}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M17 3L21 7L7 21H3V17L17 3Z"/>
                    <path d="M14 6L18 10" stroke="currentColor"/>
                  </svg>
                </button>
                <button class="btn-delete" (click)="abrirModalConfirmacao(destino)" title="{{ i18n.t('common.excluir') }}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
                  </svg>
                </button>
              </td>
            </tr>
            <tr *ngIf="destinos.length === 0">
              <td colspan="7" class="empty-table">
                {{ i18n.t('destinos_admin.nenhum_encontrado') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal de Destino -->
      <div class="modal" *ngIf="modalAberto" (click)="fecharModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12H22M12 2C14.5 4.5 15.5 8 12 12C8.5 8 9.5 4.5 12 2Z"/>
              </svg>
              {{ editando ? i18n.t('common.editar') : i18n.t('common.novo') }} {{ i18n.t('destinos_admin.destino') }}
            </h2>
            <button class="close" (click)="fecharModal()">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>{{ i18n.t('destinos_admin.nome') }} *</label>
              <input type="text" [(ngModel)]="destinoForm.nome" class="form-control" required>
            </div>
            <div class="form-group">
              <label>{{ i18n.t('destinos_admin.pais') }} *</label>
              <input type="text" [(ngModel)]="destinoForm.pais" class="form-control" required>
            </div>
            <div class="form-group">
              <label>{{ i18n.t('destinos_admin.cidade') }} *</label>
              <input type="text" [(ngModel)]="destinoForm.cidade" class="form-control" required>
            </div>
            <div class="form-group">
              <label>{{ i18n.t('destinos_admin.preco') }} (Kz) *</label>
              <input type="number" [(ngModel)]="destinoForm.preco" class="form-control" required>
            </div>
            <div class="form-group">
              <label>{{ i18n.t('destinos_admin.imagem') }}</label>
              <input type="text" [(ngModel)]="destinoForm.imagem" class="form-control" placeholder="https://exemplo.com/imagem.jpg">
            </div>
            <div class="form-group">
              <label>{{ i18n.t('destinos_admin.descricao') }}</label>
              <textarea rows="3" [(ngModel)]="destinoForm.descricao" class="form-control" [placeholder]="i18n.t('destinos_admin.descricao_placeholder')"></textarea>
            </div>
            <div class="form-group">
              <label>{{ i18n.t('destinos_admin.avaliacao') }} (0-5)</label>
              <input type="number" [(ngModel)]="destinoForm.avaliacao" class="form-control" min="0" max="5" step="0.1">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" (click)="fecharModal()">{{ i18n.t('common.cancelar') }}</button>
            <button class="btn-save" (click)="salvar()" [disabled]="!isFormValido()">{{ i18n.t('common.salvar') }}</button>
          </div>
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
            <p class="destino-info">
              <strong>{{ destinoSelecionado?.nome }}</strong> ({{ destinoSelecionado?.cidade }}, {{ destinoSelecionado?.pais }})
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
    </div>
  `,
  styles: [`
    .admin-page { 
      padding: 24px; 
      min-height: 100vh;
      background: var(--bg-primary);
    }

    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .header-left { display: flex; align-items: center; gap: 16px; }
    .header-right { display: flex; align-items: center; gap: 12px; }
    
    .btn-back { display: flex; align-items: center; gap: 8px; background: var(--bg-input); border: 1px solid var(--border-color); padding: 8px 16px; border-radius: 8px; color: var(--color-secondary); cursor: pointer; transition: all 0.2s; font-size: 0.9rem; }
    .btn-back:hover { background: var(--bg-hover); transform: translateX(-2px); }
    
    .page-header h1 { display: inline-flex; align-items: center; gap: 8px; color: var(--text-primary); margin: 0; font-size: 1.8rem; }
    .header-icon { stroke: var(--color-secondary); }
    
    .btn-add { display: inline-flex; align-items: center; gap: 8px; background: var(--gradient-primary); border: none; padding: 10px 24px; border-radius: 8px; color: white; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-add:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
    
    .table-container { background: var(--bg-card); border-radius: 12px; overflow-x: auto; border: 1px solid var(--border-color); min-height: 400px; }
    .admin-table { width: 100%; border-collapse: collapse; }
    .admin-table th, .admin-table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid var(--border-color); color: var(--text-secondary); }
    .admin-table th { color: var(--text-primary); font-weight: 600; background: var(--bg-tertiary); }
    .admin-table tr:hover { background: var(--bg-hover); }
    .table-img { width: 50px; height: 50px; border-radius: 8px; object-fit: cover; }
    .actions { display: flex; gap: 8px; }
    .btn-edit, .btn-delete { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
    .btn-edit { background: #3B82F6; color: white; }
    .btn-delete { background: #EF4444; color: white; }
    .btn-edit:hover, .btn-delete:hover { transform: scale(1.05); }
    .empty-table { text-align: center; padding: 60px !important; color: var(--text-secondary); }
    .loading { text-align: center; padding: 60px; color: var(--text-secondary); }
    .spinner { width: 50px; height: 50px; border: 3px solid var(--border-color); border-top-color: var(--color-secondary); border-radius: 50%; margin: 0 auto 20px; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    /* Modal de Destino */
    .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: var(--bg-modal); border-radius: 16px; width: 550px; max-width: 90%; border: 1px solid var(--border-color); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--border-color); }
    .modal-header h2 { display: inline-flex; align-items: center; gap: 8px; color: var(--text-primary); margin: 0; font-size: 1.3rem; }
    .close { background: none; border: none; color: var(--text-secondary); font-size: 28px; cursor: pointer; }
    .close:hover { color: #EF4444; }
    .modal-body { padding: 24px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; color: var(--text-secondary); margin-bottom: 8px; font-size: 0.9rem; }
    .form-control { width: 100%; padding: 10px; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); font-size: 0.9rem; }
    .form-control:focus { outline: none; border-color: var(--color-secondary); }
    textarea.form-control { resize: vertical; font-family: inherit; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 20px 24px; border-top: 1px solid var(--border-color); }
    .btn-cancel, .btn-save { padding: 8px 20px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
    .btn-cancel { background: transparent; border: 1px solid #EF4444; color: #EF4444; }
    .btn-save { background: var(--gradient-primary); border: none; color: white; }
    .btn-cancel:hover, .btn-save:hover { transform: translateY(-2px); }
    .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Modal de Confirmação de Exclusão */
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1001; }
    .modal-container { background: var(--bg-modal); border-radius: 20px; width: 450px; max-width: 90%; border: 1px solid var(--border-color); animation: modalFadeIn 0.3s ease; }
    @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .modal-container .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--border-color); }
    .modal-title { display: flex; align-items: center; gap: 12px; }
    .modal-icon { display: flex; align-items: center; }
    .modal-title h2 { color: var(--text-primary); margin: 0; font-size: 1.3rem; }
    .modal-close { background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer; transition: color 0.2s; }
    .modal-close:hover { color: #EF4444; }
    .modal-container .modal-body { padding: 24px; }
    .modal-container .modal-body p { color: var(--text-secondary); margin-bottom: 16px; }
    .destino-info { background: var(--bg-hover); padding: 12px; border-radius: 8px; text-align: center; }
    .destino-info strong { color: var(--text-primary); }
    .aviso { color: #EF4444 !important; font-size: 0.85rem; margin-top: 16px; }
    .modal-container .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 20px 24px; border-top: 1px solid var(--border-color); }
    .btn-confirm-delete { background: #EF4444; border: none; color: white; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-confirm-delete:hover:not(:disabled) { transform: translateY(-2px); background: #dc2626; }
    .btn-confirm-delete:disabled { opacity: 0.5; cursor: not-allowed; }
    
    @media (max-width: 768px) {
      .page-header { flex-direction: column; align-items: flex-start; }
      .header-right { width: 100%; justify-content: flex-end; }
    }

    /* Light Mode */
    body.light-theme .admin-page { background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%); }
    body.light-theme .btn-back { background: #FFFFFF; border-color: #E2E8F0; color: #3B82F6; }
    body.light-theme .btn-back:hover { background: #F1F5F9; }
    body.light-theme .table-container { background: #FFFFFF; border-color: #E2E8F0; }
    body.light-theme .admin-table th { background: #F8FAFC; }
    body.light-theme .modal-content { background: #FFFFFF; }
    body.light-theme .modal-header h2 { color: #1E293B; }
    body.light-theme .form-control { background: #F9FAFB; border-color: #E2E8F0; color: #1E293B; }
    body.light-theme .modal-container { background: #FFFFFF; }
    body.light-theme .modal-title h2 { color: #1E293B; }
  `]
})
export class GestaoDestinos implements OnInit {
  destinos: Destino[] = [];
  destinoForm: Destino = { id: 0, nome: '', pais: '', cidade: '', descricao: '', imagem: '', preco: 0, avaliacao: 0 };
  editando = false;
  modalAberto = false;
  carregando = true;
  
  // Modal de confirmação de exclusão
  modalConfirmacaoAberto = false;
  destinoSelecionado: Destino | null = null;
  excluindo = false;

  constructor(
    private destinoService: DestinoService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public i18n: I18nService,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.carregarDestinos();
  }

  voltar() {
    this.router.navigate(['/admin/dashboard']);
  }

  abrirModal() {
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.cancelar();
  }

  abrirModalConfirmacao(destino: Destino) {
    this.destinoSelecionado = destino;
    this.modalConfirmacaoAberto = true;
  }

  fecharModalConfirmacao() {
    this.modalConfirmacaoAberto = false;
    this.destinoSelecionado = null;
    this.excluindo = false;
  }

  confirmarExclusao() {
    if (!this.destinoSelecionado) return;
    
    this.excluindo = true;
    
    this.destinoService.deletar(this.destinoSelecionado.id).subscribe({
      next: (response: any) => {
        this.excluindo = false;
        if (response && response.success) {
          this.notificationService.success(this.i18n.t('common.sucesso_excluir'));
          this.fecharModalConfirmacao();
          this.carregarDestinos();
        } else {
          this.notificationService.error(response?.message || this.i18n.t('common.erro'));
        }
      },
      error: () => {
        this.excluindo = false;
        this.notificationService.error(this.i18n.t('common.erro_excluir'));
      }
    });
  }

  isFormValido(): boolean {
    return !!(this.destinoForm.nome && this.destinoForm.pais && this.destinoForm.cidade && this.destinoForm.preco > 0);
  }

  carregarDestinos() {
    this.carregando = true;
    this.destinoService.listar().subscribe({
      next: (response: any) => {
        this.carregando = false;
        if (response && response.success) {
          this.destinos = response.data || [];
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

  salvar() {
    if (!this.isFormValido()) {
      this.notificationService.error(this.i18n.t('common.erro_campos'));
      return;
    }
    
    if (this.editando) {
      this.destinoService.atualizar(this.destinoForm).subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this.notificationService.success(this.i18n.t('common.sucesso_atualizar'));
            this.carregarDestinos();
            this.fecharModal();
          } else {
            this.notificationService.error(response?.message || this.i18n.t('common.erro'));
          }
        },
        error: () => this.notificationService.error(this.i18n.t('common.erro_atualizar'))
      });
    } else {
      this.destinoService.criar(this.destinoForm).subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this.notificationService.success(this.i18n.t('common.sucesso_criar'));
            this.carregarDestinos();
            this.fecharModal();
          } else {
            this.notificationService.error(response?.message || this.i18n.t('common.erro'));
          }
        },
        error: () => this.notificationService.error(this.i18n.t('common.erro_criar'))
      });
    }
  }

  editar(destino: Destino) {
    this.destinoForm = { ...destino };
    this.editando = true;
    this.abrirModal();
  }

  cancelar() {
    this.destinoForm = { id: 0, nome: '', pais: '', cidade: '', descricao: '', imagem: '', preco: 0, avaliacao: 0 };
    this.editando = false;
  }
}