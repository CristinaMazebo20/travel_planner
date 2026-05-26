// modules/admin/pages/gestao-viagens/gestao-viagens.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ViagemService } from '../../../../core/services/viagem.service';
import { DestinoService } from '../../../../core/services/destino.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { NotificationService } from '../../../../core/services/notification.service';

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
            Voltar
          </button>
          <div class="title-section">
            <div class="title-icon">✈️</div>
            <div>
              <h1>Gestão de Viagens</h1>
              <p>Visualize e gerencie todas as viagens do sistema</p>
            </div>
          </div>
        </div>
        <div class="stats-badge">
          <span class="stat-value">{{ viagens.length }}</span>
          <span class="stat-label">Total de Viagens</span>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filters-card">
        <div class="filters-grid">
          <div class="filter-group">
            <label>🔍 Buscar</label>
            <input type="text" [(ngModel)]="filtroBusca" (input)="filtrarViagens()" placeholder="Cliente, destino ou título...">
          </div>
          <div class="filter-group">
            <label>📊 Status</label>
            <select [(ngModel)]="filtroStatus" (change)="filtrarViagens()">
              <option value="">Todos os status</option>
              <option value="confirmada">✅ Confirmadas</option>
              <option value="planejando">📝 Planejando</option>
              <option value="reservada">📅 Reservadas</option>
              <option value="aguardando_pagamento">⏳ Aguardando Pagamento</option>
            </select>
          </div>
          <div class="filter-group">
            <label>💰 Pagamento</label>
            <select [(ngModel)]="filtroPagamento" (change)="filtrarViagens()">
              <option value="">Todos</option>
              <option value="pago">✅ Totalmente Pago</option>
              <option value="parcial">📊 Parcialmente Pago</option>
              <option value="nao_pago">❌ Não Pago</option>
            </select>
          </div>
          <div class="filter-group">
            <label>&nbsp;</label>
            <button class="btn-refresh" (click)="carregarViagens()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              Atualizar
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="carregando" class="loading-card">
        <div class="spinner"></div>
        <p>Carregando viagens...</p>
      </div>

      <!-- Tabela -->
      <div *ngIf="!carregando" class="table-card">
        <div class="table-responsive">
          <table class="viagens-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Destino</th>
                <th>Período</th>
                <th>Status</th>
                <th>Valor Total</th>
                <th>Pagamento</th>
                <th>Ações</th>
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
                      Falta: {{ (viagem.orcamento - viagem.valor_pago) | number }} Kz
                    </div>
                    <div class="saldo pago" *ngIf="viagem.valor_pago >= viagem.orcamento">
                      ✅ Totalmente Pago
                    </div>
                  </div>
                </td>
                <td class="actions">
                  <button class="btn-view" (click)="verDetalhes(viagem.id)" title="Ver detalhes">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button class="btn-pagar" (click)="abrirModalPagamento(viagem)" 
                          *ngIf="viagem.valor_pago < viagem.orcamento" title="Registrar pagamento">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="6" width="20" height="12" rx="2"/>
                      <path d="M12 10h4M12 14h2"/>
                    </svg>
                  </button>
                  <button class="btn-delete" (click)="excluir(viagem.id)" title="Excluir">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
                    </svg>
                  </button>
                </td>
              </tr>
              <tr *ngIf="viagensFiltradas.length === 0">
                <td colspan="8" class="empty-state">
                  <div class="empty-icon">📭</div>
                  <p>Nenhuma viagem encontrada</p>
                  <small>Tente ajustar os filtros de busca</small>
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
              <h2>Registrar Pagamento</h2>
            </div>
            <button class="modal-close" (click)="fecharModalPagamento()">✕</button>
          </div>
          <div class="modal-body">
            <div class="viagem-summary">
              <div class="summary-item">
                <span class="summary-label">Cliente</span>
                <span class="summary-value">{{ viagemSelecionada?.cliente_nome }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Destino</span>
                <span class="summary-value">{{ viagemSelecionada?.destino_nome }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Valor Total</span>
                <span class="summary-value highlight">{{ viagemSelecionada?.orcamento | number }} Kz</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Valor Pago</span>
                <span class="summary-value">{{ viagemSelecionada?.valor_pago | number }} Kz</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Saldo</span>
                <span class="summary-value saldo-restante">{{ (viagemSelecionada?.orcamento - viagemSelecionada?.valor_pago) | number }} Kz</span>
              </div>
            </div>
            
            <div class="form-group">
              <label>Valor a Pagar (Kz)</label>
              <input type="number" [(ngModel)]="valorPagamento" class="form-control" 
                     [max]="viagemSelecionada?.orcamento - viagemSelecionada?.valor_pago" [min]="1" placeholder="0">
            </div>
            
            <div class="form-group">
              <label>Forma de Pagamento</label>
              <div class="payment-methods">
                <label class="payment-option">
                  <input type="radio" value="pagar_agora" [(ngModel)]="formaPagamento">
                  <span>💳 Pagamento à vista</span>
                </label>
                <label class="payment-option">
                  <input type="radio" value="sinal" [(ngModel)]="formaPagamento">
                  <span>📝 Sinal (30%)</span>
                </label>
                <label class="payment-option">
                  <input type="radio" value="parcelar" [(ngModel)]="formaPagamento">
                  <span>📆 Parcelado</span>
                </label>
                <label class="payment-option">
                  <input type="radio" value="transferencia" [(ngModel)]="formaPagamento">
                  <span>🏦 Transferência Bancária</span>
                </label>
                <label class="payment-option">
                  <input type="radio" value="multicaixa" [(ngModel)]="formaPagamento">
                  <span>💳 Multicaixa Express</span>
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" (click)="fecharModalPagamento()">Cancelar</button>
            <button class="btn-save" (click)="registrarPagamento()" [disabled]="valorPagamento <= 0">
              Registrar Pagamento
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .viagens-container { padding: 24px; max-width: 1400px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 20px; }
    .header-left { display: flex; align-items: center; gap: 20px; }
    .btn-back { display: flex; align-items: center; gap: 8px; background: rgba(0,217,255,0.1); border: 1px solid rgba(0,217,255,0.3); padding: 8px 16px; border-radius: 12px; color: #00D9FF; cursor: pointer; font-size: 0.9rem; transition: all 0.3s; }
    .btn-back:hover { background: rgba(0,217,255,0.2); transform: translateX(-3px); }
    .title-section { display: flex; align-items: center; gap: 16px; }
    .title-icon { font-size: 48px; background: linear-gradient(135deg, #6C3BD4, #00D9FF); border-radius: 20px; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; font-size: 32px; }
    .title-section h1 { color: white; margin: 0 0 4px 0; font-size: 1.8rem; }
    .title-section p { color: #A0A8C6; margin: 0; font-size: 0.85rem; }
    .stats-badge { background: linear-gradient(135deg, rgba(108,59,212,0.2), rgba(0,217,255,0.1)); border: 1px solid rgba(0,217,255,0.2); border-radius: 20px; padding: 12px 24px; text-align: center; }
    .stat-value { display: block; font-size: 2rem; font-weight: bold; color: #00D9FF; }
    .stat-label { font-size: 0.75rem; color: #A0A8C6; }
    .filters-card { background: rgba(17,22,61,0.8); backdrop-filter: blur(10px); border: 1px solid rgba(0,217,255,0.1); border-radius: 20px; padding: 20px; margin-bottom: 24px; }
    .filters-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .filter-group label { display: block; color: #A0A8C6; font-size: 0.75rem; margin-bottom: 6px; }
    .filter-group input, .filter-group select { width: 100%; padding: 10px 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,217,255,0.2); border-radius: 10px; color: white; font-size: 0.85rem; }
    .filter-group input:focus, .filter-group select:focus { outline: none; border-color: #00D9FF; }
    .btn-refresh { display: flex; align-items: center; gap: 8px; justify-content: center; width: 100%; padding: 10px 12px; background: linear-gradient(135deg, #6C3BD4, #00D9FF); border: none; border-radius: 10px; color: white; cursor: pointer; font-weight: 500; transition: transform 0.2s; }
    .btn-refresh:hover { transform: translateY(-2px); }
    .loading-card { background: rgba(17,22,61,0.8); border-radius: 20px; padding: 60px; text-align: center; border: 1px solid rgba(0,217,255,0.1); }
    .spinner { width: 50px; height: 50px; border: 3px solid rgba(0,217,255,0.1); border-top-color: #00D9FF; border-radius: 50%; margin: 0 auto 20px; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .table-card { background: rgba(17,22,61,0.8); backdrop-filter: blur(10px); border: 1px solid rgba(0,217,255,0.1); border-radius: 20px; overflow: hidden; }
    .table-responsive { overflow-x: auto; }
    .viagens-table { width: 100%; border-collapse: collapse; }
    .viagens-table th { padding: 16px; text-align: left; color: #A0A8C6; font-weight: 500; font-size: 0.8rem; border-bottom: 1px solid rgba(0,217,255,0.1); }
    .viagens-table td { padding: 16px; border-bottom: 1px solid rgba(0,217,255,0.1); color: #A0A8C6; }
    .viagens-table tr:hover { background: rgba(0,217,255,0.05); }
    .id-badge { background: rgba(0,217,255,0.1); padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
    .cliente-info { display: flex; flex-direction: column; }
    .cliente-info strong { color: white; font-size: 0.85rem; }
    .cliente-info small { font-size: 0.7rem; color: #00D9FF; }
    .destino-info { display: flex; align-items: center; gap: 6px; }
    .destino-icon { font-size: 14px; }
    .periodo-info { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; }
    .periodo-arrow { color: #00D9FF; }
    .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
    .status-icon { font-size: 0.75rem; }
    .status-confirmada { background: rgba(16,185,129,0.2); color: #10B981; border: 1px solid rgba(16,185,129,0.3); }
    .status-planejando { background: rgba(245,158,11,0.2); color: #F59E0B; border: 1px solid rgba(245,158,11,0.3); }
    .status-reservada { background: rgba(59,130,246,0.2); color: #3B82F6; border: 1px solid rgba(59,130,246,0.3); }
    .status-aguardando { background: rgba(239,68,68,0.2); color: #EF4444; border: 1px solid rgba(239,68,68,0.3); }
    .valor-total { font-weight: bold; color: white; }
    .pagamento-info { min-width: 160px; }
    .valor-pago { font-size: 0.85rem; margin-bottom: 4px; }
    .progress-wrapper { display: flex; align-items: center; gap: 8px; margin: 8px 0; }
    .progress-bar { flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #6C3BD4, #00D9FF); border-radius: 3px; transition: width 0.3s; }
    .percentual { font-size: 0.7rem; font-weight: 500; color: #00D9FF; }
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
    .empty-state p { color: white; margin: 0; }
    .empty-state small { color: #A0A8C6; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-container { background: #11123D; border-radius: 24px; width: 500px; max-width: 90%; border: 1px solid rgba(0,217,255,0.2); animation: modalFadeIn 0.3s ease; }
    @keyframes modalFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid rgba(0,217,255,0.1); }
    .modal-title { display: flex; align-items: center; gap: 12px; }
    .modal-icon { font-size: 24px; }
    .modal-title h2 { color: white; margin: 0; }
    .modal-close { background: none; border: none; color: #A0A8C6; font-size: 24px; cursor: pointer; transition: color 0.2s; }
    .modal-close:hover { color: #EF4444; }
    .modal-body { padding: 24px; }
    .viagem-summary { background: rgba(0,0,0,0.3); border-radius: 16px; padding: 16px; margin-bottom: 24px; }
    .summary-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .summary-item:last-child { border-bottom: none; }
    .summary-label { color: #A0A8C6; font-size: 0.85rem; }
    .summary-value { color: white; font-weight: 500; }
    .summary-value.highlight { color: #00D9FF; font-size: 1.1rem; }
    .saldo-restante { color: #EF4444; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; color: #A0A8C6; margin-bottom: 8px; font-size: 0.85rem; }
    .form-control { width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,217,255,0.2); border-radius: 12px; color: white; font-size: 1rem; }
    .form-control:focus { outline: none; border-color: #00D9FF; }
    .payment-methods { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .payment-option { display: flex; align-items: center; gap: 8px; padding: 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(0,217,255,0.1); border-radius: 10px; cursor: pointer; transition: all 0.2s; }
    .payment-option:hover { border-color: #00D9FF; background: rgba(0,217,255,0.1); }
    .payment-option input { accent-color: #00D9FF; }
    .payment-option span { color: #A0A8C6; font-size: 0.85rem; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 20px 24px; border-top: 1px solid rgba(0,217,255,0.1); }
    .btn-cancel, .btn-save { padding: 10px 24px; border-radius: 10px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-cancel { background: transparent; border: 1px solid #EF4444; color: #EF4444; }
    .btn-cancel:hover { background: rgba(239,68,68,0.1); }
    .btn-save { background: linear-gradient(135deg, #6C3BD4, #00D9FF); border: none; color: white; }
    .btn-save:hover:not(:disabled) { transform: translateY(-2px); }
    .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class GestaoViagens implements OnInit {
  viagens: any[] = [];
  viagensFiltradas: any[] = [];
  carregando = true;
  filtroBusca = '';
  filtroStatus = '';
  filtroPagamento = '';
  
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
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarViagens();
  }

  voltar() {
    this.router.navigate(['/admin/dashboard']);
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
    if (s === 'confirmada' || s === 'confirmado') return 'Confirmada';
    if (s === 'planejando' || s === 'planejada') return 'Planejando';
    if (s === 'reservada' || s === 'reservado') return 'Reservada';
    if (s === 'aguardando_pagamento' || s === 'aguardando') return 'Aguardando Pagamento';
    return 'Aguardando Pagamento';
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
                  this.notificationService.success(`Carregadas ${this.viagens.length} viagens`);
                }
                this.cdr.detectChanges();
              },
              error: (err) => {
                this.carregando = false;
                this.notificationService.error('Erro ao carregar viagens');
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
      this.notificationService.error('Valor de pagamento inválido');
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
          this.notificationService.success('Pagamento registrado com sucesso!');
          this.fecharModalPagamento();
          this.carregarViagens();
        } else {
          this.notificationService.error('Erro ao registrar pagamento');
        }
      },
      error: () => {
        this.notificationService.error('Erro ao registrar pagamento');
      }
    });
  }

  verDetalhes(id: number) {
    this.router.navigate(['/viagem', id]);
  }

  excluir(id: number) {
    if (confirm('Tem certeza que deseja excluir esta viagem?')) {
      this.viagemService.deletar(id).subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this.notificationService.success('Viagem excluída com sucesso!');
            this.carregarViagens();
          } else {
            this.notificationService.error('Erro ao excluir viagem');
          }
        },
        error: () => {
          this.notificationService.error('Erro ao excluir viagem');
        }
      });
    }
  }
}