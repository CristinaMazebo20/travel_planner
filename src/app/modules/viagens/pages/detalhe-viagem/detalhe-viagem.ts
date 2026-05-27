// modules/viagens/pages/detalhe-viagem/detalhe-viagem.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ViagemService } from '../../../../core/services/viagem.service';
import { DestinoService } from '../../../../core/services/destino.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { I18nService } from '../../../../core/services/i18n.service';

interface Viagem {
  id: number;
  titulo: string;
  destino_id: number;
  destino_nome?: string;
  destino_pais?: string;
  destino_descricao?: string;
  destino_imagem?: string;
  data_inicio: string;
  data_fim: string;
  orcamento: number;
  status: string;
  forma_pagamento?: string;
  valor_pago?: number;
  created_at: string;
}

@Component({
  selector: 'app-detalhe-viagem',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container" *ngIf="viagem">
      <div class="back-button">
        <a routerLink="/minhas-viagens" class="btn-back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {{ i18n.t('detalhe_viagem.voltar') }}
        </a>
      </div>

      <div class="header">
        <h1>{{ viagem.titulo }}</h1>
        <div class="status-badge" [class.status-confirmada]="viagem.status === 'confirmada'"
                                  [class.status-planejando]="viagem.status === 'planejando'"
                                  [class.status-reservada]="viagem.status === 'reservada'"
                                  [class.status-aguardando]="viagem.status === 'aguardando_pagamento'"
                                  [class.status-cancelada]="viagem.status === 'cancelada'">
          {{ getStatusTexto(viagem.status) }}
        </div>
      </div>

      <div class="destino-imagem">
        <img [src]="viagem.destino_imagem || 'https://placehold.co/800x400?text=Destino'" [alt]="viagem.destino_nome">
      </div>

      <div class="info-grid">
        <div class="info-card">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {{ i18n.t('detalhe_viagem.datas_viagem') }}
          </h3>
          <p><strong>{{ i18n.t('detalhe_viagem.data_inicio') }}:</strong> {{ viagem.data_inicio | date:'dd/MM/yyyy' }}</p>
          <p><strong>{{ i18n.t('detalhe_viagem.data_fim') }}:</strong> {{ viagem.data_fim | date:'dd/MM/yyyy' }}</p>
          <p><strong>{{ i18n.t('detalhe_viagem.duracao') }}:</strong> {{ calcularDuracao() }} {{ i18n.t('detalhe_viagem.dias') }}</p>
          <button *ngIf="podeEditarDados()" class="btn-edit-small" (click)="abrirModalEdicaoDados()">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 3L21 7L7 21H3V17L17 3Z"/>
              <path d="M14 6L18 10" stroke="currentColor"/>
            </svg>
            {{ i18n.t('detalhe_viagem.editar_datas') }}
          </button>
        </div>

        <div class="info-card">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="3"/>
            </svg>
            {{ i18n.t('detalhe_viagem.destino') }}
          </h3>
          <p><strong>{{ i18n.t('detalhe_viagem.destino') }}:</strong> {{ viagem.destino_nome }}</p>
          <p><strong>{{ i18n.t('detalhe_viagem.pais') }}:</strong> {{ viagem.destino_pais }}</p>
          <p><strong>{{ i18n.t('detalhe_viagem.descricao') }}:</strong> {{ viagem.destino_descricao || i18n.t('detalhe_viagem.descricao_indisponivel') }}</p>
        </div>

        <div class="info-card">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            {{ i18n.t('detalhe_viagem.financeiro') }}
          </h3>
          <p><strong>{{ i18n.t('detalhe_viagem.orcamento_total') }}:</strong> {{ viagem.orcamento | number }} Kz</p>
          <p><strong>{{ i18n.t('detalhe_viagem.valor_pago') }}:</strong> {{ (viagem.valor_pago || 0) | number }} Kz</p>
          <p><strong>{{ i18n.t('detalhe_viagem.saldo_restante') }}:</strong> {{ (viagem.orcamento - (viagem.valor_pago || 0)) | number }} Kz</p>
          <p *ngIf="viagem.forma_pagamento"><strong>{{ i18n.t('detalhe_viagem.forma_pagamento') }}:</strong> {{ getFormaPagamentoTexto(viagem.forma_pagamento) }}</p>
        </div>

        <div class="info-card">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {{ i18n.t('detalhe_viagem.status_viagem') }}
          </h3>
          <p><strong>{{ i18n.t('detalhe_viagem.status_atual') }}:</strong> {{ getStatusTexto(viagem.status) }}</p>
          <p><strong>{{ i18n.t('detalhe_viagem.data_planejamento') }}:</strong> {{ viagem.created_at | date:'dd/MM/yyyy HH:mm' }}</p>
        </div>
      </div>

      <!-- Ações baseadas no status -->
      <div class="actions">
        <div class="actions-group" *ngIf="podeEditarDados()">
          <button class="btn-editar-dados" (click)="abrirModalEdicaoDados()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 3L21 7L7 21H3V17L17 3Z"/>
              <path d="M14 6L18 10" stroke="currentColor"/>
            </svg>
            {{ i18n.t('detalhe_viagem.editar_viagem') }}
          </button>
        </div>

        <div class="actions-group" *ngIf="podeEditarPagamento()">
          <button class="btn-pagar" (click)="abrirModalPagamento()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="6" width="20" height="12" rx="2"/>
              <path d="M12 10h4M12 14h2"/>
            </svg>
            {{ i18n.t('detalhe_viagem.adicionar_pagamento') }}
          </button>
          <button class="btn-concluir" *ngIf="(viagem.valor_pago || 0) < viagem.orcamento" (click)="abrirModalConcluirPagamento()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {{ i18n.t('detalhe_viagem.concluir_pagamento') }}
          </button>
        </div>

        <div class="actions-group" *ngIf="podeCancelar()">
          <button class="btn-cancelar" (click)="abrirModalCancelamento()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            {{ i18n.t('detalhe_viagem.cancelar_viagem') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Edição de Dados -->
    <div class="modal" *ngIf="modalEdicaoDadosAberto" (click)="fecharModal($event)">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 3L21 7L7 21H3V17L17 3Z"/>
              <path d="M14 6L18 10" stroke="currentColor"/>
            </svg>
            {{ i18n.t('modal.editar_viagem.titulo') }}
          </h3>
          <button class="modal-close" (click)="fecharModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>{{ i18n.t('modal.editar_viagem.titulo_viagem') }}</label>
            <input type="text" class="form-control" [(ngModel)]="viagemEdit.titulo">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>{{ i18n.t('modal.editar_viagem.data_inicio') }}</label>
              <input type="date" class="form-control" [(ngModel)]="viagemEdit.data_inicio">
            </div>
            <div class="form-group">
              <label>{{ i18n.t('modal.editar_viagem.data_fim') }}</label>
              <input type="date" class="form-control" [(ngModel)]="viagemEdit.data_fim">
            </div>
          </div>
          <div class="form-group">
            <label>{{ i18n.t('modal.editar_viagem.orcamento') }}</label>
            <input type="number" class="form-control" [(ngModel)]="viagemEdit.orcamento">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" (click)="fecharModal()">{{ i18n.t('common.cancelar') }}</button>
          <button class="btn-save" (click)="salvarEdicaoDados()" [disabled]="salvando">{{ i18n.t('modal.editar_viagem.salvar') }}</button>
        </div>
      </div>
    </div>

    <!-- Modal de Adicionar Pagamento -->
    <div class="modal" *ngIf="modalPagamentoAberto" (click)="fecharModal($event)">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
            {{ i18n.t('modal.pagamento.titulo') }}
          </h3>
          <button class="modal-close" (click)="fecharModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>{{ i18n.t('modal.pagamento.valor') }}</label>
            <input type="number" class="form-control" [(ngModel)]="valorPagamento" placeholder="0">
            <small>{{ i18n.t('modal.pagamento.saldo_restante') }}: {{ (viagem!.orcamento - (viagem!.valor_pago || 0)) | number }} Kz</small>
          </div>
          <div class="form-group">
            <label>{{ i18n.t('modal.pagamento.forma') }}</label>
            <select class="form-control" [(ngModel)]="formaPagamentoSelecionada">
              <option value="pix">{{ i18n.t('pagamento.pix') }}</option>
              <option value="cartao">{{ i18n.t('pagamento.cartao') }}</option>
              <option value="dinheiro">{{ i18n.t('pagamento.dinheiro') }}</option>
              <option value="transferencia">{{ i18n.t('pagamento.transferencia') }}</option>
            </select>
          </div>
          <div class="payment-value-info" *ngIf="valorPagamento > 0">
            <p><strong>{{ i18n.t('modal.pagamento.valor_a_pagar') }}:</strong> {{ valorPagamento | number }} Kz</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" (click)="fecharModal()">{{ i18n.t('common.cancelar') }}</button>
          <button class="btn-save" (click)="adicionarPagamento()" [disabled]="salvando || valorPagamento <= 0">{{ i18n.t('modal.pagamento.adicionar') }}</button>
        </div>
      </div>
    </div>

    <!-- Modal de Concluir Pagamento -->
    <div class="modal" *ngIf="modalConcluirPagamentoAberto" (click)="fecharModal($event)">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {{ i18n.t('modal.concluir_pagamento.titulo') }}
          </h3>
          <button class="modal-close" (click)="fecharModal()">×</button>
        </div>
        <div class="modal-body">
          <p>{{ i18n.t('modal.concluir_pagamento.mensagem') }}</p>
          <p><strong>{{ i18n.t('modal.concluir_pagamento.valor_restante') }}:</strong> {{ (viagem!.orcamento - (viagem!.valor_pago || 0)) | number }} Kz</p>
          <p><strong>{{ i18n.t('modal.pagamento.valor_a_pagar') }}:</strong> {{ (viagem!.orcamento - (viagem!.valor_pago || 0)) | number }} Kz</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" (click)="fecharModal()">{{ i18n.t('common.cancelar') }}</button>
          <button class="btn-save" (click)="concluirPagamento()" [disabled]="salvando">{{ i18n.t('modal.concluir_pagamento.confirmar') }}</button>
        </div>
      </div>
    </div>

    <!-- Modal de Cancelamento -->
    <div class="modal" *ngIf="modalCancelamentoAberto" (click)="fecharModal($event)">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            {{ i18n.t('modal.cancelar.titulo') }}
          </h3>
          <button class="modal-close" (click)="fecharModal()">×</button>
        </div>
        <div class="modal-body">
          <p>{{ i18n.t('modal.cancelar.mensagem') }}</p>
          <p class="warning">{{ i18n.t('modal.cancelar.aviso_irreversivel') }}</p>
          
          <!-- Mostra o valor do reembolso corretamente -->
          <div class="reembolso-info" *ngIf="(viagem!.valor_pago || 0) > 0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <div class="reembolso-texto">
              <strong>{{ i18n.t('modal.cancelar.reembolso') }}</strong>
              <span class="reembolso-valor">{{ (viagem!.valor_pago || 0) | number }} Kz</span>
            </div>
            <small>{{ i18n.t('modal.cancelar.reembolso_politica') }}</small>
          </div>
          
          <div class="sem-reembolso" *ngIf="(viagem!.valor_pago || 0) === 0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
            </svg>
            <span>{{ i18n.t('modal.cancelar.reembolso_zero') }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" (click)="fecharModal()">{{ i18n.t('modal.cancelar.voltar') }}</button>
          <button class="btn-confirm-cancel" (click)="confirmarCancelamento()" [disabled]="salvando">
            {{ salvando ? i18n.t('common.processando') : i18n.t('modal.cancelar.confirmar') }}
          </button>
        </div>
      </div>
    </div>

    <div *ngIf="!viagem" class="error-container">
      <h2>{{ i18n.t('detalhe_viagem.viagem_nao_encontrada') }}</h2>
      <a routerLink="/minhas-viagens" class="btn-back">{{ i18n.t('detalhe_viagem.voltar') }}</a>
    </div>
  `,
  styles: [`
    .container { max-width: 1000px; margin: 0 auto; padding: 40px 24px; }
    .back-button { margin-bottom: 24px; }
    .btn-back { display: inline-flex; align-items: center; gap: 8px; background: var(--bg-card, rgba(17,22,61,0.8)); backdrop-filter: blur(10px); padding: 10px 20px; border-radius: 30px; color: var(--text-secondary, #A0A8C6); text-decoration: none; border: 1px solid var(--border-color, rgba(0,217,255,0.2)); transition: all 0.3s; }
    .btn-back:hover { color: var(--color-secondary, #00D9FF); border-color: var(--color-secondary, #00D9FF); }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .header h1 { font-size: 2rem; color: var(--text-primary, white); margin: 0; }
    .status-badge { padding: 6px 16px; border-radius: 30px; font-size: 0.85rem; font-weight: 500; }
    .status-confirmada { background: #10B981; color: white; }
    .status-planejando { background: #F59E0B; color: white; }
    .status-reservada { background: #3B82F6; color: white; }
    .status-aguardando { background: #EF4444; color: white; }
    .status-cancelada { background: #6B7280; color: white; }
    .destino-imagem { height: 300px; border-radius: 24px; overflow: hidden; margin-bottom: 32px; }
    .destino-imagem img { width: 100%; height: 100%; object-fit: cover; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 32px; }
    .info-card { background: var(--bg-card, rgba(17,22,61,0.8)); backdrop-filter: blur(10px); border-radius: 20px; padding: 24px; border: 1px solid var(--border-color, rgba(0,217,255,0.1)); }
    .info-card h3 { display: inline-flex; align-items: center; gap: 8px; color: var(--color-secondary, #00D9FF); margin-bottom: 16px; }
    .info-card p { color: var(--text-secondary, #A0A8C6); margin-bottom: 8px; }
    .info-card p strong { color: var(--text-primary, white); }
    .btn-edit-small { margin-top: 12px; padding: 6px 12px; background: rgba(0,217,255,0.1); border: 1px solid rgba(0,217,255,0.3); border-radius: 20px; color: var(--color-secondary, #00D9FF); cursor: pointer; font-size: 0.75rem; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; }
    .btn-edit-small:hover { background: rgba(0,217,255,0.2); transform: translateY(-2px); }
    
    .actions { display: flex; flex-direction: column; gap: 16px; margin-top: 24px; }
    .actions-group { display: flex; gap: 16px; justify-content: flex-end; flex-wrap: wrap; }
    .btn-editar-dados, .btn-pagar, .btn-concluir, .btn-cancelar { padding: 12px 24px; border-radius: 30px; font-weight: 600; cursor: pointer; transition: all 0.3s; border: none; display: inline-flex; align-items: center; gap: 8px; }
    .btn-editar-dados { background: var(--gradient-primary, linear-gradient(135deg, #6C3BD4, #00D9FF)); color: white; }
    .btn-pagar { background: var(--gradient-primary, linear-gradient(135deg, #6C3BD4, #00D9FF)); color: white; }
    .btn-concluir { background: #10B981; color: white; }
    .btn-cancelar { background: transparent; border: 1px solid #EF4444; color: #EF4444; }
    .btn-editar-dados:hover, .btn-pagar:hover, .btn-concluir:hover, .btn-cancelar:hover { transform: translateY(-2px); }
    
    /* Modal */
    .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: var(--bg-modal, #1A1F4E); border-radius: 24px; max-width: 500px; width: 90%; overflow: hidden; border: 1px solid var(--border-color, rgba(0,217,255,0.2)); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid var(--border-color, rgba(0,217,255,0.2)); }
    .modal-header h3 { margin: 0; color: var(--text-primary, white); display: inline-flex; align-items: center; gap: 8px; }
    .modal-close { background: none; border: none; color: var(--text-secondary, white); font-size: 24px; cursor: pointer; transition: color 0.2s; }
    .modal-close:hover { color: #EF4444; }
    .modal-body { padding: 24px; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 20px; border-top: 1px solid var(--border-color, rgba(0,217,255,0.2)); }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 8px; color: var(--color-secondary, #00D9FF); }
    .form-control { width: 100%; padding: 12px; background: var(--bg-input, rgba(10,15,46,0.9)); border: 1px solid var(--border-color, rgba(0,217,255,0.2)); border-radius: 12px; color: var(--text-primary, white); transition: all 0.2s; }
    .form-control:focus { outline: none; border-color: var(--color-secondary, #00D9FF); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .btn-cancel, .btn-save, .btn-confirm-cancel { padding: 10px 20px; border-radius: 30px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-cancel { background: transparent; border: 1px solid var(--border-color, rgba(255,255,255,0.2)); color: var(--text-secondary, #A0A8C6); }
    .btn-save { background: var(--gradient-primary, linear-gradient(135deg, #6C3BD4, #00D9FF)); border: none; color: white; }
    .btn-confirm-cancel { background: #EF4444; border: none; color: white; }
    .btn-cancel:hover, .btn-save:hover, .btn-confirm-cancel:hover { transform: translateY(-2px); }
    
    .payment-value-info {
      background: rgba(0,217,255,0.1);
      border-radius: 12px;
      padding: 12px;
      margin-top: 16px;
      text-align: center;
    }
    .payment-value-info p { margin: 0; color: var(--text-primary, white); }
    .payment-value-info strong { color: var(--color-secondary, #00D9FF); }
    
    .reembolso-info {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 16px;
      padding: 16px;
      margin: 16px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      text-align: center;
    }
    .reembolso-info svg { margin-bottom: 4px; }
    .reembolso-texto { display: flex; flex-direction: column; gap: 4px; }
    .reembolso-texto strong { color: #F59E0B; font-size: 0.9rem; }
    .reembolso-valor { font-size: 1.3rem; font-weight: bold; color: #F59E0B; }
    .reembolso-info small { color: var(--text-secondary, #A0A8C6); font-size: 0.7rem; }
    
    .sem-reembolso {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 16px;
      padding: 16px;
      margin: 16px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      color: #EF4444;
    }
    
    .warning { color: #EF4444; font-size: 0.85rem; margin-top: 8px; text-align: center; }
    
    .error-container { text-align: center; padding: 80px; color: var(--text-secondary, #A0A8C6); }
    
    @media (max-width: 768px) { 
      .info-grid { grid-template-columns: 1fr; } 
      .header { flex-direction: column; align-items: flex-start; } 
      .form-row { grid-template-columns: 1fr; } 
      .actions-group { justify-content: center; } 
    }

    /* Light Mode */
    body.light-theme .btn-back {
      background: #FFFFFF;
      border-color: #E2E8F0;
      color: #64748B;
    }
    body.light-theme .btn-back:hover {
      border-color: #3B82F6;
      color: #3B82F6;
    }
    body.light-theme .header h1 {
      color: #1E293B;
    }
    body.light-theme .info-card {
      background: #FFFFFF;
      border-color: #E2E8F0;
    }
    body.light-theme .info-card h3 {
      color: #3B82F6;
    }
    body.light-theme .info-card p {
      color: #64748B;
    }
    body.light-theme .info-card p strong {
      color: #1E293B;
    }
    body.light-theme .btn-edit-small {
      background: #F1F5F9;
      border-color: #E2E8F0;
      color: #3B82F6;
    }
    body.light-theme .modal-content {
      background: #FFFFFF;
    }
    body.light-theme .modal-header {
      border-bottom-color: #E2E8F0;
    }
    body.light-theme .modal-header h3 {
      color: #1E293B;
    }
    body.light-theme .modal-close {
      color: #64748B;
    }
    body.light-theme .form-group label {
      color: #3B82F6;
    }
    body.light-theme .form-control {
      background: #F9FAFB;
      border-color: #E2E8F0;
      color: #1E293B;
    }
    body.light-theme .btn-cancel {
      border-color: #CBD5E1;
      color: #64748B;
    }
    body.light-theme .btn-cancel:hover {
      background: #F1F5F9;
    }
    body.light-theme .payment-value-info {
      background: #F1F5F9;
    }
    body.light-theme .payment-value-info p {
      color: #1E293B;
    }
    body.light-theme .reembolso-info {
      background: #FEF3C7;
      border-color: #FDE68A;
    }
    body.light-theme .reembolso-info small {
      color: #64748B;
    }
    body.light-theme .sem-reembolso {
      background: #FEE2E2;
      border-color: #FECACA;
    }
  `]
})
export class DetalheViagem implements OnInit {
  viagem: Viagem | null = null;
  viagemEdit: any = {};
  modalEdicaoDadosAberto = false;
  modalPagamentoAberto = false;
  modalConcluirPagamentoAberto = false;
  modalCancelamentoAberto = false;
  valorPagamento = 0;
  formaPagamentoSelecionada = 'pix';
  salvando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private viagemService: ViagemService,
    private destinoService: DestinoService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    public i18n: I18nService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarViagem(parseInt(id));
    }
  }

  podeEditarDados(): boolean {
    return this.viagem?.status === 'planejando';
  }

  podeEditarPagamento(): boolean {
    const status = this.viagem?.status;
    return status !== 'confirmada' && status !== 'cancelada' && status !== 'concluida';
  }

  podeCancelar(): boolean {
    const status = this.viagem?.status;
    return status !== 'cancelada' && status !== 'concluida';
  }

  getStatusTexto(status: string): string {
    const statusMap: any = {
      'confirmada': this.i18n.t('status.confirmada'),
      'planejando': this.i18n.t('status.planejando'),
      'reservada': this.i18n.t('status.reservada'),
      'aguardando_pagamento': this.i18n.t('status.aguardando'),
      'cancelada': this.i18n.t('status.cancelada')
    };
    return statusMap[status] || status;
  }

  getFormaPagamentoTexto(forma: string): string {
    const formaMap: any = {
      'pagar_agora': this.i18n.t('pagamento.vista'),
      'sinal': this.i18n.t('pagamento.sinal'),
      'parcelar': this.i18n.t('pagamento.parcelado'),
      'reservar': this.i18n.t('pagamento.reserva'),
      'pix': this.i18n.t('pagamento.pix'),
      'cartao': this.i18n.t('pagamento.cartao'),
      'dinheiro': this.i18n.t('pagamento.dinheiro'),
      'transferencia': this.i18n.t('pagamento.transferencia')
    };
    return formaMap[forma] || forma;
  }

  calcularDuracao(): number {
    if (!this.viagem?.data_inicio || !this.viagem?.data_fim) return 0;
    const inicio = new Date(this.viagem.data_inicio);
    const fim = new Date(this.viagem.data_fim);
    const diff = fim.getTime() - inicio.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  carregarViagem(id: number) {
    this.viagemService.buscar(id).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.viagem = response.data;
          this.cdr.detectChanges();
          if (this.viagem && this.viagem.destino_id) {
            this.carregarDetalhesDestino(this.viagem.destino_id);
          }
        } else {
          this.notificationService.error(this.i18n.t('detalhe_viagem.viagem_nao_encontrada'));
        }
      },
      error: () => {
        this.notificationService.error(this.i18n.t('common.erro'));
      }
    });
  }

  carregarDetalhesDestino(destinoId: number) {
    this.destinoService.buscar(destinoId).subscribe({
      next: (response: any) => {
        if (response.success && response.data && this.viagem) {
          this.viagem.destino_nome = response.data.nome;
          this.viagem.destino_pais = response.data.pais;
          this.viagem.destino_descricao = response.data.descricao;
          this.viagem.destino_imagem = response.data.imagem;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Erro ao carregar destino:', err)
    });
  }

  abrirModalEdicaoDados() {
    if (this.viagem && this.podeEditarDados()) {
      this.viagemEdit = {
        id: this.viagem.id,
        titulo: this.viagem.titulo,
        data_inicio: this.viagem.data_inicio,
        data_fim: this.viagem.data_fim,
        orcamento: this.viagem.orcamento
      };
      this.modalEdicaoDadosAberto = true;
    }
  }

  salvarEdicaoDados() {
    this.salvando = true;
    this.viagemService.atualizar(this.viagemEdit).subscribe({
      next: (response: any) => {
        this.salvando = false;
        if (response.success) {
          this.notificationService.success(this.i18n.t('common.sucesso'));
          this.fecharModal();
          this.carregarViagem(this.viagemEdit.id);
        } else {
          this.notificationService.error(response.message || this.i18n.t('common.erro'));
        }
      },
      error: () => {
        this.salvando = false;
        this.notificationService.error(this.i18n.t('common.erro'));
      }
    });
  }

  abrirModalPagamento() {
    if (this.viagem) {
      this.valorPagamento = (this.viagem.orcamento || 0) - (this.viagem.valor_pago || 0);
      this.modalPagamentoAberto = true;
    }
  }

  abrirModalConcluirPagamento() {
    this.modalConcluirPagamentoAberto = true;
  }

  adicionarPagamento() {
    if (!this.viagem || this.valorPagamento <= 0) {
      this.notificationService.error(this.i18n.t('common.erro'));
      return;
    }

    const saldoRestante = (this.viagem.orcamento || 0) - (this.viagem.valor_pago || 0);
    if (this.valorPagamento > saldoRestante) {
      this.notificationService.error(this.i18n.t('common.erro'));
      return;
    }

    this.salvando = true;
    const novoValorPago = (this.viagem.valor_pago || 0) + this.valorPagamento;
    const novoStatus = novoValorPago >= (this.viagem.orcamento || 0) ? 'confirmada' : 'aguardando_pagamento';

    this.viagemService.atualizarPagamento(this.viagem.id, novoValorPago, this.formaPagamentoSelecionada, novoStatus).subscribe({
      next: (response: any) => {
        this.salvando = false;
        if (response.success) {
          this.notificationService.success(this.i18n.t('common.sucesso'));
          this.fecharModal();
          this.carregarViagem(this.viagem!.id);
        } else {
          this.notificationService.error(response.message || this.i18n.t('common.erro'));
        }
      },
      error: () => {
        this.salvando = false;
        this.notificationService.error(this.i18n.t('common.erro'));
      }
    });
  }

  concluirPagamento() {
    if (!this.viagem) return;

    this.salvando = true;
    const saldoRestante = (this.viagem.orcamento || 0) - (this.viagem.valor_pago || 0);
    const novoValorPago = (this.viagem.valor_pago || 0) + saldoRestante;

    this.viagemService.atualizarPagamento(this.viagem.id, novoValorPago, this.viagem.forma_pagamento || 'pix', 'confirmada').subscribe({
      next: (response: any) => {
        this.salvando = false;
        if (response.success) {
          this.notificationService.success(this.i18n.t('common.sucesso'));
          this.fecharModal();
          this.carregarViagem(this.viagem!.id);
        } else {
          this.notificationService.error(response.message || this.i18n.t('common.erro'));
        }
      },
      error: () => {
        this.salvando = false;
        this.notificationService.error(this.i18n.t('common.erro'));
      }
    });
  }

  abrirModalCancelamento() {
    if (this.viagem) {
      console.log('Valor pago para reembolso:', this.viagem.valor_pago);
    }
    this.modalCancelamentoAberto = true;
  }

  confirmarCancelamento() {
    if (!this.viagem) return;

    this.salvando = true;
    this.viagemService.deletar(this.viagem.id).subscribe({
      next: (response: any) => {
        this.salvando = false;
        if (response && response.success) {
          this.notificationService.success(this.i18n.t('common.sucesso'));
          this.fecharModal();
          this.router.navigate(['/minhas-viagens']);
        } else {
          this.notificationService.error(response?.message || this.i18n.t('common.erro'));
        }
      },
      error: (error) => {
        this.salvando = false;
        console.error('Erro ao cancelar:', error);
        this.notificationService.error(this.i18n.t('common.erro_conexao'));
      }
    });
  }

  fecharModal(event?: MouseEvent) {
    if (!event || (event.target as HTMLElement).classList.contains('modal')) {
      this.modalEdicaoDadosAberto = false;
      this.modalPagamentoAberto = false;
      this.modalConcluirPagamentoAberto = false;
      this.modalCancelamentoAberto = false;
    }
  }
}