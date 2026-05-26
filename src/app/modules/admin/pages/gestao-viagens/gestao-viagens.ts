// modules/admin/pages/gestao-viagens/gestao-viagens.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ViagemService } from '../../../../core/services/viagem.service';
import { DestinoService } from '../../../../core/services/destino.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { I18nService } from '../../../../core/services/i18n.service';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-gestao-viagens',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="viagens-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <button class="btn-back" (click)="voltar()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {{ i18n.t('common.voltar') }}
          </button>
          <div class="title-section">
            <div class="title-icon">✈️</div>
            <div>
              <h1>{{ i18n.t('gestao_viagens.titulo') }}</h1>
              <p>{{ i18n.t('gestao_viagens.subtitulo') }}</p>
            </div>
          </div>
        </div>
        <div class="header-right">
          <div class="stats-badge">
            <span class="stat-value">{{ viagens.length }}</span>
            <span class="stat-label">{{ i18n.t('gestao_viagens.total') }}</span>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-card">
        <div class="filters-grid">
          <div class="filter-group">
            <label>🔍 {{ i18n.t('common.buscar') }}</label>
            <input type="text" [(ngModel)]="filtroBusca" (input)="filtrarViagens()" [placeholder]="i18n.t('gestao_viagens.buscar_placeholder')">
          </div>
          <div class="filter-group">
            <label>📊 {{ i18n.t('gestao_viagens.filtrar_status') }}</label>
            <select [(ngModel)]="filtroStatus" (change)="filtrarViagens()">
              <option value="">{{ i18n.t('gestao_viagens.todos_status') }}</option>
              <option value="confirmada">✅ {{ i18n.t('gestao_viagens.confirmadas') }}</option>
              <option value="planejando">📝 {{ i18n.t('gestao_viagens.planejando') }}</option>
              <option value="reservada">📅 {{ i18n.t('gestao_viagens.reservadas') }}</option>
              <option value="aguardando_pagamento">⏳ {{ i18n.t('gestao_viagens.aguardando') }}</option>
            </select>
          </div>
          <div class="filter-group">
            <label>💰 {{ i18n.t('gestao_viagens.filtrar_pagamento') }}</label>
            <select [(ngModel)]="filtroPagamento" (change)="filtrarViagens()">
              <option value="">{{ i18n.t('gestao_viagens.todos_pagamentos') }}</option>
              <option value="pago">✅ {{ i18n.t('gestao_viagens.totalmente_pago') }}</option>
              <option value="parcial">📊 {{ i18n.t('gestao_viagens.parcialmente_pago') }}</option>
              <option value="nao_pago">❌ {{ i18n.t('gestao_viagens.nao_pago') }}</option>
            </select>
          </div>
          <div class="filter-group">
            <label>&nbsp;</label>
            <button class="btn-refresh" (click)="carregarViagens()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              {{ i18n.t('common.atualizar') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="carregando" class="loading-card">
        <div class="spinner"></div>
        <p>{{ i18n.t('common.carregando') }}</p>
      </div>

      <!-- Tabela -->
      <div *ngIf="!carregando" class="table-card">
        <div class="table-responsive">
          <table class="viagens-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{{ i18n.t('gestao_viagens.cliente') }}</th>
                <th>{{ i18n.t('gestao_viagens.destino') }}</th>
                <th>{{ i18n.t('gestao_viagens.periodo') }}</th>
                <th>{{ i18n.t('gestao_viagens.status') }}</th>
                <th>{{ i18n.t('gestao_viagens.valor_total') }}</th>
                <th>{{ i18n.t('gestao_viagens.pagamento') }}</th>
                <th>{{ i18n.t('common.acoes') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let viagem of viagensFiltradas">
                <td><span class="id-badge">#{{ viagem.id }}</span></td>
                <td>
                  <div class="cliente-info">
                    <strong>{{ viagem.cliente_nome }}</strong>
                    <small>{{ viagem.cliente_email }}</small>
                  </div>
                </td>
                <td>
                  <div class="destino-info">
                    <span class="destino-icon">📍</span>
                    {{ viagem.destino_nome }}
                  </div>
                </td>
                <td>
                  <div class="periodo-info">
                    <div>{{ viagem.data_inicio | date:'dd/MM/yy' }}</div>
                    <div class="periodo-arrow">→</div>
                    <div>{{ viagem.data_fim | date:'dd/MM/yy' }}</div>
                  </div>
                </td>
                <td>
                  <span class="status-badge" 
                        [class.status-confirmada]="viagem.status === 'confirmada'"
                        [class.status-planejando]="viagem.status === 'planejando'"
                        [class.status-reservada]="viagem.status === 'reservada'"
                        [class.status-aguardando]="viagem.status === 'aguardando_pagamento'">
                    <span class="status-icon">{{ getStatusIcon(viagem.status) }}</span>
                    {{ getStatusTexto(viagem.status) }}
                  </span>
                </td>
                <td><div class="valor-total">{{ viagem.orcamento | number }} Kz</div></td>
                <td>
                  <div class="pagamento-info">
                    <div class="valor-pago">{{ viagem.valor_pago | number }} Kz</div>
                    <div class="progress-wrapper">
                      <div class="progress-bar">
                        <div class="progress-fill" [style.width.%]="(viagem.valor_pago / viagem.orcamento) * 100"></div>
                      </div>
                      <span class="percentual">{{ (viagem.valor_pago / viagem.orcamento) * 100 | number:'1.0-0' }}%</span>
                    </div>
                    <div class="saldo" *ngIf="viagem.valor_pago < viagem.orcamento">
                      {{ i18n.t('gestao_viagens.falta') }}: {{ (viagem.orcamento - viagem.valor_pago) | number }} Kz
                    </div>
                    <div class="saldo pago" *ngIf="viagem.valor_pago >= viagem.orcamento">
                      ✅ {{ i18n.t('gestao_viagens.totalmente_pago_texto') }}
                    </div>
                  </div>
                </td>
                <td class="actions">
                  <button class="btn-view" (click)="verDetalhes(viagem.id)" title="{{ i18n.t('common.ver') }}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button class="btn-pagar" (click)="abrirModalPagamento(viagem)" 
                          *ngIf="viagem.valor_pago < viagem.orcamento" title="{{ i18n.t('gestao_viagens.registrar_pagamento') }}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="6" width="20" height="12" rx="2"/>
                      <path d="M12 10h4M12 14h2"/>
                    </svg>
                  </button>
                  <button class="btn-delete" (click)="excluir(viagem.id)" title="{{ i18n.t('common.excluir') }}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
                    </svg>
                  </button>
                </td>
              </tr>
              <tr *ngIf="viagensFiltradas.length === 0">
                <td colspan="8" class="empty-state">
                  <div class="empty-icon">📭</div>
                  <p>{{ i18n.t('gestao_viagens.nenhuma_encontrada') }}</p>
                  <small>{{ i18n.t('gestao_viagens.ajuste_filtros') }}</small>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal de Pagamento -->
      <div class="modal-overlay" *ngIf="modalPagamentoAberto" (click)="fecharModalPagamento()">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title">
              <span class="modal-icon">💰</span>
              <h2>{{ i18n.t('gestao_viagens.registrar_pagamento') }}</h2>
            </div>
            <button class="modal-close" (click)="fecharModalPagamento()">✕</button>
          </div>
          <div class="modal-body">
            <div class="viagem-summary">
              <div class="summary-item">
                <span class="summary-label">{{ i18n.t('gestao_viagens.cliente') }}</span>
                <span class="summary-value">{{ viagemSelecionada?.cliente_nome }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">{{ i18n.t('gestao_viagens.destino') }}</span>
                <span class="summary-value">{{ viagemSelecionada?.destino_nome }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">{{ i18n.t('gestao_viagens.valor_total') }}</span>
                <span class="summary-value highlight">{{ viagemSelecionada?.orcamento | number }} Kz</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">{{ i18n.t('gestao_viagens.valor_pago') }}</span>
                <span class="summary-value">{{ viagemSelecionada?.valor_pago | number }} Kz</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">{{ i18n.t('gestao_viagens.saldo') }}</span>
                <span class="summary-value saldo-restante">{{ (viagemSelecionada?.orcamento - viagemSelecionada?.valor_pago) | number }} Kz</span>
              </div>
            </div>
            
            <div class="form-group">
              <label>{{ i18n.t('gestao_viagens.valor_pagar') }} (Kz)</label>
              <input type="number" [(ngModel)]="valorPagamento" class="form-control" 
                     [max]="viagemSelecionada?.orcamento - viagemSelecionada?.valor_pago" [min]="1" placeholder="0">
            </div>
            
            <div class="form-group">
              <label>{{ i18n.t('gestao_viagens.forma_pagamento') }}</label>
              <div class="payment-methods">
                <label class="payment-option">
                  <input type="radio" value="pagar_agora" [(ngModel)]="formaPagamento">
                  <span>💳 {{ i18n.t('gestao_viagens.pagamento_vista') }}</span>
                </label>
                <label class="payment-option">
                  <input type="radio" value="sinal" [(ngModel)]="formaPagamento">
                  <span>📝 {{ i18n.t('gestao_viagens.sinal') }}</span>
                </label>
                <label class="payment-option">
                  <input type="radio" value="parcelar" [(ngModel)]="formaPagamento">
                  <span>📆 {{ i18n.t('gestao_viagens.parcelado') }}</span>
                </label>
                <label class="payment-option">
                  <input type="radio" value="transferencia" [(ngModel)]="formaPagamento">
                  <span>🏦 {{ i18n.t('gestao_viagens.transferencia') }}</span>
                </label>
                <label class="payment-option">
                  <input type="radio" value="multicaixa" [(ngModel)]="formaPagamento">
                  <span>💳 {{ i18n.t('gestao_viagens.multicaixa') }}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" (click)="fecharModalPagamento()">{{ i18n.t('common.cancelar') }}</button>
            <button class="btn-save" (click)="registrarPagamento()" [disabled]="valorPagamento <= 0">
              {{ i18n.t('gestao_viagens.registrar_pagamento') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .viagens-container { 
      padding: 24px; 
      max-width: 1400px; 
      margin: 0 auto; 
      min-height: 100vh;
      background: var(--bg-primary);
    }
    
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 20px; }
    .header-left { display: flex; align-items: center; gap: 20px; }
    .header-right { display: flex; align-items: center; gap: 12px; }
    
    .btn-back { display: flex; align-items: center; gap: 8px; background: var(--bg-input); border: 1px solid var(--border-color); padding: 8px 16px; border-radius: 12px; color: var(--color-secondary); cursor: pointer; font-size: 0.9rem; transition: all 0.3s; }
    .btn-back:hover { background: var(--bg-hover); transform: translateX(-3px); }
    
    /* Language Selector */
    .lang-selector { position: relative; }
    .lang-btn { display: flex; align-items: center; gap: 6px; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; color: var(--color-secondary); cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
    .lang-btn:hover { background: var(--bg-hover); }
    .lang-icon { transition: transform 0.2s; }
    .lang-selector:hover .lang-icon { transform: rotate(180deg); }
    .lang-dropdown { position: absolute; top: 100%; right: 0; margin-top: 8px; background: var(--bg-card-solid); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; min-width: 140px; z-index: 100; box-shadow: var(--shadow-lg); }
    .lang-item { display: block; width: 100%; padding: 10px 16px; background: transparent; border: none; color: var(--text-secondary); font-size: 0.85rem; cursor: pointer; text-align: left; transition: all 0.2s; }
    .lang-item:hover { background: var(--bg-hover); color: var(--color-secondary); }
    .lang-item.active { background: var(--gradient-primary); color: white; }
    
    /* Theme Button */
    .theme-btn { background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 8px; width: 36px; height: 36px; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .theme-btn:hover { background: var(--bg-hover); transform: scale(1.05); }
    
    .title-section { display: flex; align-items: center; gap: 16px; }
    .title-icon { font-size: 48px; background: var(--gradient-primary); border-radius: 20px; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; font-size: 32px; }
    .title-section h1 { color: var(--text-primary); margin: 0 0 4px 0; font-size: 1.8rem; }
    .title-section p { color: var(--text-secondary); margin: 0; font-size: 0.85rem; }
    
    .stats-badge { background: linear-gradient(135deg, rgba(108,59,212,0.2), rgba(0,217,255,0.1)); border: 1px solid var(--border-color); border-radius: 20px; padding: 12px 24px; text-align: center; }
    .stat-value { display: block; font-size: 2rem; font-weight: bold; color: var(--color-secondary); }
    .stat-label { font-size: 0.75rem; color: var(--text-secondary); }
    
    .filters-card { background: var(--bg-card); backdrop-filter: blur(10px); border: 1px solid var(--border-color); border-radius: 20px; padding: 20px; margin-bottom: 24px; }
    .filters-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .filter-group label { display: block; color: var(--text-secondary); font-size: 0.75rem; margin-bottom: 6px; }
    .filter-group input, .filter-group select { width: 100%; padding: 10px 12px; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 10px; color: var(--text-primary); font-size: 0.85rem; }
    .filter-group input:focus, .filter-group select:focus { outline: none; border-color: var(--color-secondary); }
    
    .btn-refresh { display: flex; align-items: center; gap: 8px; justify-content: center; width: 100%; padding: 10px 12px; background: var(--gradient-primary); border: none; border-radius: 10px; color: white; cursor: pointer; font-weight: 500; transition: transform 0.2s; }
    .btn-refresh:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
    
    .loading-card { background: var(--bg-card); border-radius: 20px; padding: 60px; text-align: center; border: 1px solid var(--border-color); }
    .spinner { width: 50px; height: 50px; border: 3px solid var(--border-color); border-top-color: var(--color-secondary); border-radius: 50%; margin: 0 auto 20px; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    .table-card { background: var(--bg-card); backdrop-filter: blur(10px); border: 1px solid var(--border-color); border-radius: 20px; overflow: hidden; }
    .table-responsive { overflow-x: auto; }
    .viagens-table { width: 100%; border-collapse: collapse; }
    .viagens-table th { padding: 16px; text-align: left; color: var(--text-secondary); font-weight: 500; font-size: 0.8rem; border-bottom: 1px solid var(--border-color); }
    .viagens-table td { padding: 16px; border-bottom: 1px solid var(--border-color); color: var(--text-secondary); }
    .viagens-table tr:hover { background: var(--bg-hover); }
    
    .id-badge { background: var(--bg-hover); padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
    .cliente-info { display: flex; flex-direction: column; }
    .cliente-info strong { color: var(--text-primary); font-size: 0.85rem; }
    .cliente-info small { font-size: 0.7rem; color: var(--color-secondary); }
    .destino-info { display: flex; align-items: center; gap: 6px; }
    .destino-icon { font-size: 14px; }
    .periodo-info { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; }
    .periodo-arrow { color: var(--color-secondary); }
    
    .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
    .status-icon { font-size: 0.75rem; }
    .status-confirmada { background: rgba(16,185,129,0.2); color: #10B981; border: 1px solid rgba(16,185,129,0.3); }
    .status-planejando { background: rgba(245,158,11,0.2); color: #F59E0B; border: 1px solid rgba(245,158,11,0.3); }
    .status-reservada { background: rgba(59,130,246,0.2); color: #3B82F6; border: 1px solid rgba(59,130,246,0.3); }
    .status-aguardando { background: rgba(239,68,68,0.2); color: #EF4444; border: 1px solid rgba(239,68,68,0.3); }
    
    .valor-total { font-weight: bold; color: var(--text-primary); }
    .pagamento-info { min-width: 160px; }
    .valor-pago { font-size: 0.85rem; margin-bottom: 4px; color: var(--text-primary); }
    .progress-wrapper { display: flex; align-items: center; gap: 8px; margin: 8px 0; }
    .progress-bar { flex: 1; height: 6px; background: var(--bg-tertiary); border-radius: 3px; overflow: hidden; }
    .progress-fill { height: 100%; background: var(--gradient-primary); border-radius: 3px; transition: width 0.3s; }
    .percentual { font-size: 0.7rem; font-weight: 500; color: var(--color-secondary); }
    .saldo { font-size: 0.7rem; color: #EF4444; margin-top: 4px; }
    .saldo.pago { color: #10B981; }
    
    .actions { display: flex; gap: 8px; }
    .btn-view, .btn-pagar, .btn-delete { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
    .btn-view { background: rgba(59,130,246,0.2); color: #3B82F6; }
    .btn-pagar { background: rgba(16,185,129,0.2); color: #10B981; }
    .btn-delete { background: rgba(239,68,68,0.2); color: #EF4444; }
    .btn-view:hover, .btn-pagar:hover, .btn-delete:hover { transform: scale(1.1); }
    
    .empty-state { text-align: center; padding: 60px; }
    .empty-icon { font-size: 48px; margin-bottom: 16px; }
    .empty-state p { color: var(--text-primary); margin: 0; }
    .empty-state small { color: var(--text-secondary); }
    
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-container { background: var(--bg-modal); border-radius: 24px; width: 500px; max-width: 90%; border: 1px solid var(--border-color); animation: modalFadeIn 0.3s ease; }
    @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--border-color); }
    .modal-title { display: flex; align-items: center; gap: 12px; }
    .modal-icon { font-size: 24px; }
    .modal-title h2 { color: var(--text-primary); margin: 0; }
    .modal-close { background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer; transition: color 0.2s; }
    .modal-close:hover { color: #EF4444; }
    .modal-body { padding: 24px; }
    .viagem-summary { background: var(--bg-hover); border-radius: 16px; padding: 16px; margin-bottom: 24px; }
    .summary-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-color); }
    .summary-item:last-child { border-bottom: none; }
    .summary-label { color: var(--text-secondary); font-size: 0.85rem; }
    .summary-value { color: var(--text-primary); font-weight: 500; }
    .summary-value.highlight { color: var(--color-secondary); font-size: 1.1rem; }
    .saldo-restante { color: #EF4444; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; color: var(--text-secondary); margin-bottom: 8px; font-size: 0.85rem; }
    .form-control { width: 100%; padding: 12px; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 12px; color: var(--text-primary); font-size: 1rem; }
    .form-control:focus { outline: none; border-color: var(--color-secondary); }
    .payment-methods { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .payment-option { display: flex; align-items: center; gap: 8px; padding: 10px; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 10px; cursor: pointer; transition: all 0.2s; }
    .payment-option:hover { border-color: var(--color-secondary); background: var(--bg-hover); }
    .payment-option input { accent-color: var(--color-secondary); }
    .payment-option span { color: var(--text-secondary); font-size: 0.85rem; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 20px 24px; border-top: 1px solid var(--border-color); }
    .btn-cancel, .btn-save { padding: 10px 24px; border-radius: 10px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-cancel { background: transparent; border: 1px solid #EF4444; color: #EF4444; }
    .btn-cancel:hover { background: rgba(239,68,68,0.1); }
    .btn-save { background: var(--gradient-primary); border: none; color: white; }
    .btn-save:hover:not(:disabled) { transform: translateY(-2px); box-shadow: var(--shadow-md); }
    .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
    
    @media (max-width: 768px) {
      .page-header { flex-direction: column; align-items: flex-start; }
      .header-right { width: 100%; justify-content: flex-end; }
    }

    /* Light Mode */
    body.light-theme .viagens-container {
      background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
    }
    
    body.light-theme .btn-back {
      background: #FFFFFF;
      border-color: #E2E8F0;
      color: #3B82F6;
    }
    body.light-theme .btn-back:hover {
      background: #F1F5F9;
    }
    
    body.light-theme .lang-btn {
      background: #FFFFFF;
      border-color: #E2E8F0;
      color: #3B82F6;
    }
    body.light-theme .lang-btn:hover {
      background: #F1F5F9;
    }
    body.light-theme .lang-dropdown {
      background: #FFFFFF;
      border-color: #E2E8F0;
    }
    body.light-theme .lang-item {
      color: #64748B;
    }
    body.light-theme .lang-item:hover {
      background: #F1F5F9;
      color: #3B82F6;
    }
    
    body.light-theme .theme-btn {
      background: #FFFFFF;
      border-color: #E2E8F0;
    }
    body.light-theme .theme-btn:hover {
      background: #F1F5F9;
    }
    
    body.light-theme .filters-card {
      background: #FFFFFF;
      border-color: #E2E8F0;
    }
    body.light-theme .filter-group input, 
    body.light-theme .filter-group select {
      background: #F9FAFB;
      border-color: #E2E8F0;
      color: #1E293B;
    }
    
    body.light-theme .table-card {
      background: #FFFFFF;
      border-color: #E2E8F0;
    }
    body.light-theme .viagens-table th {
      background: #F8FAFC;
    }
    
    body.light-theme .modal-container {
      background: #FFFFFF;
    }
    body.light-theme .modal-title h2 {
      color: #1E293B;
    }
    body.light-theme .form-control {
      background: #F9FAFB;
      border-color: #E2E8F0;
      color: #1E293B;
    }
    body.light-theme .payment-option {
      background: #F9FAFB;
      border-color: #E2E8F0;
    }
    body.light-theme .payment-option span {
      color: #64748B;
    }
  `]
})
export class GestaoViagens implements OnInit {
  viagens: any[] = [];
  viagensFiltradas: any[] = [];
  carregando = true;
  filtroBusca = '';
  filtroStatus = '';
  filtroPagamento = '';
  langMenuOpen = false;
  
  modalPagamentoAberto = false;
  viagemSelecionada: any = null;
  valorPagamento: number = 0;
  formaPagamento: string = 'pagar_agora';

  constructor(
    private viagemService: ViagemService,
    private destinoService: DestinoService,
    private usuarioService: UsuarioService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public i18n: I18nService,
    public themeService: ThemeService
  ) {
    document.addEventListener('click', (event) => {
      if (!(event.target as Element).closest('.lang-selector')) {
        this.langMenuOpen = false;
      }
    });
  }

  ngOnInit() {
    this.carregarViagens();
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

  getStatusIcon(status: string): string {
    const s = status?.toLowerCase() || '';
    if (s === 'confirmada' || s === 'confirmado') return '✅';
    if (s === 'planejando' || s === 'planejada') return '📝';
    if (s === 'reservada' || s === 'reservado') return '📅';
    if (s === 'aguardando_pagamento' || s === 'aguardando') return '⏳';
    return '⏳';
  }

  getStatusTexto(status: string): string {
    const s = status?.toLowerCase() || '';
    if (s === 'confirmada' || s === 'confirmado') return this.i18n.t('status.confirmada');
    if (s === 'planejando' || s === 'planejada') return this.i18n.t('status.planejando');
    if (s === 'reservada' || s === 'reservado') return this.i18n.t('status.reservada');
    if (s === 'aguardando_pagamento' || s === 'aguardando') return this.i18n.t('status.aguardando');
    return this.i18n.t('status.aguardando');
  }

  carregarViagens() {
    this.carregando = true;
    this.cdr.detectChanges();
    
    this.usuarioService.listar().subscribe({
      next: (resUsuarios: any) => {
        const usuarios = resUsuarios?.success ? resUsuarios.data : [];
        const usuariosMap = new Map();
        usuarios.forEach((u: any) => {
          usuariosMap.set(u.id, { nome: u.nome, email: u.email });
        });
        
        this.destinoService.listar().subscribe({
          next: (resDestinos: any) => {
            const destinos = resDestinos?.success ? resDestinos.data : [];
            const destinosMap = new Map();
            destinos.forEach((d: any) => {
              destinosMap.set(d.id, d.nome);
            });
            
            this.viagemService.listar().subscribe({
              next: (resViagens: any) => {
                this.carregando = false;
                if (resViagens?.success && resViagens.data) {
                  this.viagens = resViagens.data.map((viagem: any) => {
                    const usuario = usuariosMap.get(viagem.utilizador_id) || { nome: 'Desconhecido', email: '-' };
                    return {
                      ...viagem,
                      cliente_nome: usuario.nome,
                      cliente_email: usuario.email,
                      destino_nome: destinosMap.get(viagem.destino_id) || 'Destino',
                      valor_pago: viagem.valor_pago || 0
                    };
                  });
                  this.filtrarViagens();
                  this.notificationService.success(`${this.i18n.t('gestao_viagens.carregadas')} ${this.viagens.length} ${this.i18n.t('gestao_viagens.viagens')}`);
                }
                this.cdr.detectChanges();
              },
              error: (err) => {
                this.carregando = false;
                this.notificationService.error(this.i18n.t('common.erro_conexao'));
                this.cdr.detectChanges();
              }
            });
          }
        });
      }
    });
  }

  filtrarViagens() {
    this.viagensFiltradas = this.viagens.filter(viagem => {
      const matchBusca = !this.filtroBusca || 
        viagem.titulo?.toLowerCase().includes(this.filtroBusca.toLowerCase()) ||
        viagem.cliente_nome?.toLowerCase().includes(this.filtroBusca.toLowerCase()) ||
        viagem.destino_nome?.toLowerCase().includes(this.filtroBusca.toLowerCase());
      
      const matchStatus = !this.filtroStatus || viagem.status === this.filtroStatus;
      
      let matchPagamento = true;
      const percentualPago = (viagem.valor_pago / viagem.orcamento) * 100;
      if (this.filtroPagamento === 'pago') {
        matchPagamento = percentualPago === 100;
      } else if (this.filtroPagamento === 'parcial') {
        matchPagamento = percentualPago > 0 && percentualPago < 100;
      } else if (this.filtroPagamento === 'nao_pago') {
        matchPagamento = percentualPago === 0;
      }
      
      return matchBusca && matchStatus && matchPagamento;
    });
  }

  abrirModalPagamento(viagem: any) {
    this.viagemSelecionada = viagem;
    this.valorPagamento = viagem.orcamento - viagem.valor_pago;
    this.modalPagamentoAberto = true;
  }

  fecharModalPagamento() {
    this.modalPagamentoAberto = false;
    this.viagemSelecionada = null;
    this.valorPagamento = 0;
  }

  registrarPagamento() {
    if (this.valorPagamento <= 0) {
      this.notificationService.error(this.i18n.t('gestao_viagens.erro_valor_invalido'));
      return;
    }
    
    const novoValorPago = this.viagemSelecionada.valor_pago + this.valorPagamento;
    const percentualPago = (novoValorPago / this.viagemSelecionada.orcamento) * 100;
    
    let novoStatus = this.viagemSelecionada.status;
    if (percentualPago === 100) {
      novoStatus = 'confirmada';
    } else if (percentualPago > 0 && percentualPago < 100) {
      novoStatus = 'aguardando_pagamento';
    }
    
    const viagemAtualizada = {
      ...this.viagemSelecionada,
      valor_pago: novoValorPago,
      forma_pagamento: this.formaPagamento,
      status: novoStatus
    };
    
    this.viagemService.atualizar(viagemAtualizada).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.notificationService.success(this.i18n.t('gestao_viagens.pagamento_sucesso'));
          this.fecharModalPagamento();
          this.carregarViagens();
        } else {
          this.notificationService.error(this.i18n.t('common.erro'));
        }
      },
      error: () => {
        this.notificationService.error(this.i18n.t('common.erro_conexao'));
      }
    });
  }

  verDetalhes(id: number) {
    this.router.navigate(['/viagem', id]);
  }

  excluir(id: number) {
    if (confirm(this.i18n.t('gestao_viagens.confirmar_excluir'))) {
      this.viagemService.deletar(id).subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this.notificationService.success(this.i18n.t('gestao_viagens.sucesso_excluir'));
            this.carregarViagens();
          } else {
            this.notificationService.error(this.i18n.t('common.erro'));
          }
        },
        error: () => {
          this.notificationService.error(this.i18n.t('common.erro_conexao'));
        }
      });
    }
  }
}