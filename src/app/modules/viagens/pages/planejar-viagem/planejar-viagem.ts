// modules/planejar/pages/planejar-viagem/planejar-viagem.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ViagemService } from '../../../../core/services/viagem.service';
import { DestinoService, Destino } from '../../../../core/services/destino.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { I18nService } from '../../../../core/services/i18n.service';

@Component({
  selector: 'app-planejar-viagem',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>
          <svg class="header-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 15L6 12L9 15L12 12L15 15L18 12L21 15"/>
            <path d="M3 9L6 6L9 9L12 6L15 9L18 6L21 9"/>
            <path d="M3 19L6 16L9 19L12 16L15 19L18 16L21 19"/>
          </svg>
          {{ i18n.t('planejar.titulo') }}
        </h1>
        <p>{{ i18n.t('planejar.subtitulo') }}</p>
      </div>

      <div class="form-container">
        <form #viagemForm="ngForm">
          <div class="form-grid">
            <div class="input-group full-width">
              <label>
                <svg class="label-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12H22M12 2C14.5 4.5 15.5 8 12 12C8.5 8 9.5 4.5 12 2Z"/>
                </svg>
                {{ i18n.t('planejar.destino') }}
              </label>
              <input type="text" list="destinosList" class="form-control" [(ngModel)]="destinoSelecionadoNome" name="destinoSelecionadoNome" [placeholder]="i18n.t('planejar.destino_placeholder')" (input)="onDestinoChange()" autocomplete="off">
              <datalist id="destinosList">
                <option *ngFor="let destino of destinos" [value]="destino.nome">
                  {{ destino.nome }} - {{ destino.cidade }}, {{ destino.pais }} ({{ destino.preco | number }} Kz)
                </option>
              </datalist>
            </div>

            <div class="input-group">
              <label>
                <svg class="label-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  <circle cx="12" cy="12" r="4"/>
                </svg>
                {{ i18n.t('planejar.titulo_viagem') }}
              </label>
              <input type="text" class="form-control" [(ngModel)]="viagem.titulo" name="titulo" [placeholder]="i18n.t('planejar.titulo_placeholder')" required>
            </div>

            <div class="input-group">
              <label>
                <svg class="label-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ i18n.t('planejar.data_inicio') }}
              </label>
              <input type="date" class="form-control" [(ngModel)]="viagem.data_inicio" name="data_inicio" required>
            </div>

            <div class="input-group">
              <label>
                <svg class="label-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ i18n.t('planejar.data_fim') }}
              </label>
              <input type="date" class="form-control" [(ngModel)]="viagem.data_fim" name="data_fim" required>
            </div>

            <!-- Forma de Pagamento -->
            <div class="input-group full-width">
              <label>
                <svg class="label-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
                {{ i18n.t('planejar.forma_pagamento') }}
              </label>
              <div class="payment-options">
                <label class="payment-option" [class.active]="formaPagamento === 'pagar_agora'">
                  <input type="radio" value="pagar_agora" [(ngModel)]="formaPagamento" name="formaPagamento">
                  <span class="payment-option-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  </span>
                  <span class="payment-option-text">{{ i18n.t('planejar.pagar_agora') }}</span>
                </label>
                <label class="payment-option" [class.active]="formaPagamento === 'sinal'">
                  <input type="radio" value="sinal" [(ngModel)]="formaPagamento" name="formaPagamento">
                  <span class="payment-option-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                  </span>
                  <span class="payment-option-text">{{ i18n.t('planejar.sinal') }}</span>
                </label>
                <label class="payment-option" [class.active]="formaPagamento === 'reservar'">
                  <input type="radio" value="reservar" [(ngModel)]="formaPagamento" name="formaPagamento">
                  <span class="payment-option-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </span>
                  <span class="payment-option-text">{{ i18n.t('planejar.reservar') }}</span>
                </label>
                <label class="payment-option" [class.active]="formaPagamento === 'parcelar'">
                  <input type="radio" value="parcelar" [(ngModel)]="formaPagamento" name="formaPagamento">
                  <span class="payment-option-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                      <path d="M8 14H16M12 14V18"/>
                    </svg>
                  </span>
                  <span class="payment-option-text">{{ i18n.t('planejar.parcelar') }}</span>
                </label>
              </div>
            </div>

            <!-- Parcelamento -->
            <div class="input-group full-width" *ngIf="formaPagamento === 'parcelar'">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {{ i18n.t('planejar.numero_parcelas') }}
              </label>
              <select [(ngModel)]="numeroParcelas" class="form-control" name="numeroParcelas">
                <option [value]="3">3x {{ i18n.t('planejar.sem_juros') }}</option>
                <option [value]="6">6x {{ i18n.t('planejar.com_juros_5') }}</option>
                <option [value]="12">12x {{ i18n.t('planejar.com_juros_8') }}</option>
              </select>
              <small class="helper-text">{{ i18n.t('planejar.valor_parcela') }}: {{ calcularValorParcela() | number }} Kz</small>
            </div>
          </div>

          <!-- Resumo do Pagamento -->
          <div class="payment-summary" *ngIf="orcamentoMinimo > 0">
            <h4>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              {{ i18n.t('planejar.resumo_pagamento') }}
            </h4>
            <div class="summary-row">
              <span>{{ i18n.t('planejar.valor_total') }}</span>
              <span class="summary-value">{{ orcamentoMinimo | number }} Kz</span>
            </div>
            <div class="summary-row" *ngIf="formaPagamento === 'sinal'">
              <span>{{ i18n.t('planejar.sinal_valor') }}</span>
              <span class="summary-value highlight">{{ orcamentoMinimo * 0.3 | number }} Kz</span>
            </div>
            <div class="summary-row" *ngIf="formaPagamento === 'sinal'">
              <span>{{ i18n.t('planejar.restante') }}</span>
              <span class="summary-value">{{ orcamentoMinimo * 0.7 | number }} Kz</span>
            </div>
            <div class="summary-row total" *ngIf="formaPagamento === 'pagar_agora'">
              <span>{{ i18n.t('planejar.total_pagar') }}</span>
              <span class="summary-value total-value">{{ orcamentoMinimo | number }} Kz</span>
            </div>
            <div class="summary-row total" *ngIf="formaPagamento === 'parcelar' && valorPagamento > 0">
              <span>{{ i18n.t('planejar.valor_primeira_parcela') }}</span>
              <span class="summary-value total-value">{{ valorPagamento | number }} Kz</span>
            </div>
            <div class="summary-row" *ngIf="formaPagamento === 'reservar'">
              <span>{{ i18n.t('planejar.valor_reserva') }}</span>
              <span class="summary-value">0 Kz</span>
            </div>
            <div class="summary-note" *ngIf="formaPagamento === 'reservar'">
              <small>{{ i18n.t('planejar.reserva_obs') }}</small>
            </div>
          </div>

          <div class="button-group">
            <button type="button" class="btn-primary" (click)="processarPagamento()" [disabled]="!viagem.destino_id">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              {{ getBotaoTexto() }}
            </button>
            <button type="button" class="btn-secondary" routerLink="/minhas-viagens">{{ i18n.t('common.cancelar') }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Pagamento -->
    <div class="modal" *ngIf="modalPagamentoAberto" (click)="fecharModal($event)">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
            {{ i18n.t('planejar.pagamento_seguro') }}
          </h3>
          <button class="modal-close" (click)="fecharModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="payment-methods">
            <button class="payment-method" (click)="simularPagamento('cartao')">
              <span class="method-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                  <circle cx="7.5" cy="15.5" r="1.5"/>
                  <circle cx="16.5" cy="15.5" r="1.5"/>
                </svg>
              </span>
              <span>{{ i18n.t('planejar.cartao_credito') }}</span>
            </button>
            <button class="payment-method" (click)="simularPagamento('pix')">
              <span class="method-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M3 9L12 3L21 9L12 15L3 9Z"/>
                  <path d="M12 15V21M9 18H15"/>
                </svg>
              </span>
              <span>{{ i18n.t('planejar.pix') }}</span>
            </button>
            <button class="payment-method" (click)="simularPagamento('multicaixa')">
              <span class="method-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="4" y="5" width="16" height="14" rx="2"/>
                  <path d="M9 9h6M9 12h4"/>
                </svg>
              </span>
              <span>{{ i18n.t('planejar.multicaixa') }}</span>
            </button>
          </div>
          
          <div *ngIf="pagamentoSimulado" class="payment-details">
            <div class="success-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h4>{{ i18n.t('planejar.pagamento_simulado') }}</h4>
            <div class="payment-info-card">
              <p><strong>{{ i18n.t('planejar.valor') }}:</strong> <span class="amount">{{ valorPagamento | number }} Kz</span></p>
              <p><strong>{{ i18n.t('planejar.forma') }}:</strong> {{ formaPagamentoSelecionada }}</p>
            </div>
            <button class="btn-confirm" (click)="confirmarPagamento()">{{ i18n.t('planejar.confirmar_viagem') }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { 
      max-width: 1000px; 
      margin: 0 auto; 
      padding: 40px 24px; 
    }
    
    .page-header { 
      text-align: center; 
      margin-bottom: 48px; 
    }
    
    .page-header h1 { 
      font-size: 2rem; 
      margin-bottom: 8px; 
      color: var(--text-primary, white);
      display: inline-flex;
      align-items: center;
      gap: 12px;
    }
    
    .header-icon {
      stroke: var(--color-secondary, #00D9FF);
    }
    
    .page-header p { 
      color: var(--text-secondary, #A0A8C6); 
    }
    
    .form-container { 
      background: var(--bg-card, rgba(17,22,61,0.8)); 
      backdrop-filter: blur(10px); 
      border-radius: 24px; 
      padding: 40px; 
      border: 1px solid var(--border-color, rgba(0,217,255,0.1)); 
    }
    
    .form-grid { 
      display: grid; 
      grid-template-columns: repeat(2, 1fr); 
      gap: 24px; 
    }
    
    .full-width { 
      grid-column: span 2; 
    }
    
    .input-group { 
      display: flex; 
      flex-direction: column; 
      gap: 8px; 
    }
    
    .input-group label { 
      font-size: 0.85rem; 
      color: var(--color-secondary, #00D9FF); 
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    
    .label-icon {
      stroke: var(--color-secondary, #00D9FF);
    }
    
    .form-control { 
      padding: 14px 16px; 
      background: var(--bg-input, rgba(10,15,46,0.9)); 
      border: 1px solid var(--border-color, rgba(0,217,255,0.2)); 
      border-radius: 12px; 
      color: var(--text-primary, white); 
      font-size: 1rem; 
      transition: all 0.3s;
    }
    
    .form-control:focus { 
      outline: none; 
      border-color: var(--color-secondary, #00D9FF); 
    }
    
    select.form-control {
      cursor: pointer;
    }
    
    .helper-text {
      color: var(--text-secondary, #A0A8C6);
      font-size: 0.75rem;
      margin-top: 4px;
    }
    
    /* Payment Options - Cards Estilizados */
    .payment-options { 
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px; 
      margin-top: 8px; 
    }
    
    .payment-option { 
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      cursor: pointer; 
      padding: 16px 12px; 
      background: rgba(0,217,255,0.05); 
      border: 2px solid rgba(0,217,255,0.1);
      border-radius: 16px; 
      transition: all 0.3s ease;
      text-align: center;
    }
    
    .payment-option:hover { 
      background: rgba(0,217,255,0.1);
      border-color: rgba(0,217,255,0.3);
      transform: translateY(-2px);
    }
    
    .payment-option.active {
      background: linear-gradient(135deg, rgba(108,59,212,0.2), rgba(0,217,255,0.15));
      border-color: var(--color-secondary, #00D9FF);
      box-shadow: 0 4px 12px rgba(0,217,255,0.2);
    }
    
    .payment-option input {
      display: none;
    }
    
    .payment-option-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: rgba(0,217,255,0.1);
      border-radius: 50%;
      transition: all 0.3s;
    }
    
    .payment-option.active .payment-option-icon {
      background: var(--gradient-primary, linear-gradient(135deg, #6C3BD4, #00D9FF));
    }
    
    .payment-option-icon svg {
      stroke: var(--color-secondary, #00D9FF);
      width: 24px;
      height: 24px;
    }
    
    .payment-option.active .payment-option-icon svg {
      stroke: white;
    }
    
    .payment-option-text {
      color: var(--text-primary, white);
      font-size: 0.85rem;
      font-weight: 500;
    }
    
    .payment-option.active .payment-option-text {
      color: var(--color-secondary, #00D9FF);
    }
    
    /* Payment Summary */
    .payment-summary { 
      margin-top: 32px; 
      padding: 24px; 
      background: rgba(0,217,255,0.05); 
      border-radius: 20px; 
      border: 1px solid rgba(0,217,255,0.1);
    }
    
    .payment-summary h4 { 
      margin-bottom: 20px; 
      color: var(--color-secondary, #00D9FF);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 1rem;
    }
    
    .summary-row { 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      padding: 12px 0; 
      border-bottom: 1px solid var(--border-color, rgba(255,255,255,0.08)); 
    }
    
    .summary-row.total { 
      border-top: 1px solid rgba(0,217,255,0.2); 
      margin-top: 8px; 
      padding-top: 16px;
      border-bottom: none;
    }
    
    .summary-value {
      font-weight: 500;
      color: var(--text-primary, white);
    }
    
    .total-value { 
      color: var(--color-secondary, #00D9FF); 
      font-size: 1.2rem; 
      font-weight: 700;
    }
    
    .highlight { 
      color: #F59E0B; 
      font-weight: 600; 
    }
    
    .summary-note {
      margin-top: 12px;
      text-align: center;
    }
    
    .summary-note small {
      color: var(--text-secondary, #A0A8C6);
      font-size: 0.75rem;
    }
    
    /* Button Group */
    .button-group { 
      display: flex; 
      gap: 16px; 
      justify-content: flex-end; 
      margin-top: 32px; 
    }
    
    .btn-primary, .btn-secondary { 
      padding: 14px 32px; 
      border-radius: 40px; 
      font-weight: 600; 
      cursor: pointer; 
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 0.9rem;
    }
    
    .btn-primary { 
      background: var(--gradient-primary, linear-gradient(135deg, #6C3BD4, #00D9FF)); 
      border: none; 
      color: white; 
    }
    
    .btn-primary:disabled { 
      opacity: 0.5; 
      cursor: not-allowed; 
      transform: none;
    }
    
    .btn-primary:hover:not(:disabled) { 
      transform: translateY(-2px); 
      box-shadow: 0 6px 20px rgba(108,59,212,0.4); 
    }
    
    .btn-secondary { 
      background: transparent; 
      border: 1px solid var(--border-color, rgba(255,255,255,0.2)); 
      color: var(--text-secondary, #A0A8C6); 
    }
    
    .btn-secondary:hover { 
      border-color: var(--color-secondary, #00D9FF); 
      color: var(--color-secondary, #00D9FF); 
      transform: translateY(-2px);
    }
    
    /* Modal */
    .modal { 
      position: fixed; 
      top: 0; 
      left: 0; 
      right: 0; 
      bottom: 0; 
      background: rgba(0,0,0,0.85); 
      backdrop-filter: blur(8px);
      display: flex; 
      align-items: center; 
      justify-content: center; 
      z-index: 1000; 
    }
    
    .modal-content { 
      background: var(--bg-modal, #1A1F4E); 
      border-radius: 28px; 
      max-width: 480px; 
      width: 90%; 
      overflow: hidden; 
      border: 1px solid var(--border-color, rgba(0,217,255,0.2)); 
      animation: modalFadeIn 0.3s ease;
    }
    
    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    .modal-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      padding: 20px 24px; 
      border-bottom: 1px solid var(--border-color, rgba(0,217,255,0.15)); 
    }
    
    .modal-header h3 { 
      color: var(--text-primary, white); 
      margin: 0;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 1.2rem;
    }
    
    .modal-close { 
      background: none; 
      border: none; 
      color: var(--text-secondary, #A0A8C6); 
      font-size: 28px; 
      cursor: pointer; 
      transition: all 0.2s;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    
    .modal-close:hover { 
      color: #EF4444; 
      background: rgba(239,68,68,0.1);
    }
    
    .modal-body { 
      padding: 28px 24px; 
    }
    
    .payment-methods { 
      display: flex; 
      flex-direction: column; 
      gap: 12px; 
    }
    
    .payment-method { 
      padding: 16px 20px; 
      background: rgba(0,217,255,0.08); 
      border: 1px solid rgba(0,217,255,0.15); 
      border-radius: 16px; 
      color: var(--text-primary, white); 
      cursor: pointer; 
      font-size: 1rem; 
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      gap: 14px;
      font-weight: 500;
    }
    
    .payment-method:hover { 
      background: rgba(0,217,255,0.15); 
      border-color: var(--color-secondary, #00D9FF);
      transform: translateX(4px); 
    }
    
    .method-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(0,217,255,0.1);
      border-radius: 12px;
    }
    
    .method-icon svg {
      stroke: var(--color-secondary, #00D9FF);
    }
    
    .payment-details { 
      text-align: center; 
      margin-top: 24px; 
      animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .success-icon { 
      margin-bottom: 20px; 
    }
    
    .payment-info-card {
      background: rgba(0,217,255,0.08);
      border-radius: 16px;
      padding: 16px;
      margin: 20px 0;
      text-align: left;
    }
    
    .payment-info-card p {
      margin: 8px 0;
      color: var(--text-primary, white);
    }
    
    .payment-info-card .amount {
      color: #10B981;
      font-weight: 700;
      font-size: 1.1rem;
    }
    
    .payment-details h4 { 
      color: var(--text-primary, white); 
      margin-bottom: 8px;
      font-size: 1.1rem;
    }
    
    .btn-confirm { 
      margin-top: 16px; 
      padding: 14px 32px; 
      background: #10B981; 
      border: none; 
      border-radius: 40px; 
      color: white; 
      cursor: pointer; 
      transition: all 0.3s;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .btn-confirm:hover { 
      transform: translateY(-2px); 
      background: #059669; 
      box-shadow: 0 4px 12px rgba(16,185,129,0.3);
    }
    
    @media (max-width: 768px) { 
      .form-grid { 
        grid-template-columns: 1fr; 
      } 
      .full-width { 
        grid-column: span 1; 
      }
      .payment-options {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }
      .payment-option {
        padding: 12px 8px;
      }
      .payment-option-icon {
        width: 40px;
        height: 40px;
      }
      .button-group {
        flex-direction: column;
      }
      .btn-primary, .btn-secondary {
        justify-content: center;
      }
    }

    /* Light Mode Specific */
    body.light-theme .form-container {
      background: #FFFFFF;
      border-color: #E2E8F0;
    }

    body.light-theme .form-control {
      background: #F9FAFB;
      border-color: #E2E8F0;
      color: #1E293B;
    }

    body.light-theme .form-control::placeholder {
      color: #94A3B8;
    }

    body.light-theme .payment-option {
      background: #F1F5F9;
      border-color: #E2E8F0;
    }

    body.light-theme .payment-option:hover {
      background: #E2E8F0;
    }

    body.light-theme .payment-option.active {
      background: linear-gradient(135deg, rgba(108,59,212,0.1), rgba(59,130,246,0.08));
      border-color: #3B82F6;
    }

    body.light-theme .payment-option-text {
      color: #1E293B;
    }

    body.light-theme .payment-option.active .payment-option-text {
      color: #3B82F6;
    }

    body.light-theme .payment-summary {
      background: #F8FAFC;
      border-color: #E2E8F0;
    }

    body.light-theme .summary-row {
      border-bottom-color: #E2E8F0;
    }

    body.light-theme .summary-value {
      color: #1E293B;
    }

    body.light-theme .btn-secondary {
      border-color: #CBD5E1;
      color: #64748B;
    }

    body.light-theme .btn-secondary:hover {
      border-color: #3B82F6;
      color: #3B82F6;
    }

    body.light-theme .modal-content {
      background: #FFFFFF;
    }

    body.light-theme .modal-header h3 {
      color: #1E293B;
    }

    body.light-theme .modal-header {
      border-bottom-color: #E2E8F0;
    }

    body.light-theme .modal-close {
      color: #64748B;
    }

    body.light-theme .payment-method {
      background: #F1F5F9;
      border-color: #E2E8F0;
      color: #1E293B;
    }

    body.light-theme .payment-method:hover {
      background: #E2E8F0;
    }

    body.light-theme .payment-info-card {
      background: #F1F5F9;
    }

    body.light-theme .payment-info-card p {
      color: #1E293B;
    }

    body.light-theme .payment-details h4 {
      color: #1E293B;
    }

    body.light-theme .page-header h1 {
      color: #1E293B;
    }

    body.light-theme .page-header p {
      color: #64748B;
    }
  `]
})
export class PlanejarViagem implements OnInit {
  destinos: Destino[] = [];
  destinoSelecionadoNome = '';
  viagem = {
    destino_id: null as number | null,
    titulo: '',
    data_inicio: '',
    data_fim: '',
    orcamento: null as number | null
  };
  orcamentoMinimo = 0;
  formaPagamento = 'pagar_agora';
  numeroParcelas = 3;
  modalPagamentoAberto = false;
  pagamentoSimulado = false;
  valorPagamento = 0;
  formaPagamentoSelecionada = '';
  viagemTemp: any = null;
  carregando = false;

  constructor(
    private viagemService: ViagemService,
    private destinoService: DestinoService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    public i18n: I18nService
  ) {}

  ngOnInit() { 
    this.carregarDestinos(); 
  }

  carregarDestinos() {
    this.destinoService.listar().subscribe({
      next: (response: any) => { 
        if (response.success && response.data) {
          this.destinos = response.data;
        }
      },
      error: (err) => console.error('Erro:', err)
    });
  }

  onDestinoChange() {
    const destino = this.destinos.find(d => d.nome === this.destinoSelecionadoNome);
    if (destino) {
      this.viagem.destino_id = destino.id;
      this.orcamentoMinimo = destino.preco;
    } else {
      this.viagem.destino_id = null;
      this.orcamentoMinimo = 0;
    }
  }

  calcularValorParcela(): number {
    if (!this.orcamentoMinimo) return 0;
    let valor = this.orcamentoMinimo / this.numeroParcelas;
    if (this.numeroParcelas === 6) valor *= 1.05;
    if (this.numeroParcelas === 12) valor *= 1.08;
    return valor;
  }

  getBotaoTexto(): string {
    const opcoes: any = {
      'pagar_agora': this.i18n.t('planejar.btn_pagar_agora'),
      'sinal': this.i18n.t('planejar.btn_sinal'),
      'reservar': this.i18n.t('planejar.btn_reservar'),
      'parcelar': this.i18n.t('planejar.btn_parcelar')
    };
    return opcoes[this.formaPagamento] || this.i18n.t('planejar.btn_continuar');
  }

  getValorPagamento(): number {
    if (this.formaPagamento === 'pagar_agora') return this.orcamentoMinimo;
    if (this.formaPagamento === 'sinal') return this.orcamentoMinimo * 0.3;
    if (this.formaPagamento === 'parcelar') return this.calcularValorParcela();
    return 0;
  }

  processarPagamento() {
    const usuario = this.authService.usuario();
    if (!usuario?.id) {
      this.notificationService.error(this.i18n.t('planejar.erro_login'));
      this.router.navigate(['/login']);
      return;
    }
    if (!this.viagem.destino_id || !this.viagem.titulo || !this.viagem.data_inicio || !this.viagem.data_fim) {
      this.notificationService.error(this.i18n.t('planejar.erro_campos'));
      return;
    }

    this.valorPagamento = this.getValorPagamento();
    
    if (this.formaPagamento === 'reservar') {
      this.salvarViagem();
    } else {
      this.modalPagamentoAberto = true;
    }
  }

  simularPagamento(forma: string) {
    const formas: any = {
      'cartao': this.i18n.t('planejar.cartao_credito'),
      'pix': this.i18n.t('planejar.pix'),
      'multicaixa': this.i18n.t('planejar.multicaixa')
    };
    this.formaPagamentoSelecionada = formas[forma];
    this.pagamentoSimulado = true;
  }

  confirmarPagamento() {
    this.modalPagamentoAberto = false;
    this.pagamentoSimulado = false;
    this.salvarViagem();
  }

  salvarViagem() {
    const usuario = this.authService.usuario();
    if (!usuario?.id) return;

    let status = 'planejando';
    let valor_pago = 0;
    let parcelas = 1;

    switch(this.formaPagamento) {
      case 'pagar_agora':
        status = 'confirmada';
        valor_pago = this.valorPagamento;
        break;
      case 'sinal':
        status = 'aguardando_pagamento';
        valor_pago = this.valorPagamento;
        break;
      case 'parcelar':
        status = 'confirmada';
        valor_pago = this.calcularValorParcela();
        parcelas = this.numeroParcelas;
        break;
      case 'reservar':
        status = 'reservada';
        valor_pago = 0;
        break;
    }

    const dados = {
      utilizador_id: usuario.id,
      destino_id: this.viagem.destino_id || 0,
      titulo: this.viagem.titulo,
      data_inicio: this.viagem.data_inicio,
      data_fim: this.viagem.data_fim,
      orcamento: this.orcamentoMinimo,
      status: status,
      forma_pagamento: this.formaPagamento,
      valor_pago: valor_pago,
      parcelas: parcelas
    };

    this.carregando = true;
    this.viagemService.criar(dados).subscribe({
      next: (response: any) => {
        this.carregando = false;
        if (response.success) {
          let mensagem = status === 'confirmada' 
            ? this.i18n.t('planejar.sucesso_confirmada') 
            : this.i18n.t('planejar.sucesso_planejada');
          this.notificationService.success(mensagem);
          
          let formaPagamentoTexto = '';
          switch(this.formaPagamento) {
            case 'pagar_agora': formaPagamentoTexto = this.i18n.t('planejar.pagamento_vista'); break;
            case 'sinal': formaPagamentoTexto = this.i18n.t('planejar.sinal_texto'); break;
            case 'parcelar': formaPagamentoTexto = this.i18n.t('planejar.parcelado_texto') + ` ${this.numeroParcelas}x`; break;
            case 'reservar': formaPagamentoTexto = this.i18n.t('planejar.reserva_texto'); break;
          }
          
          this.router.navigate(['/pagamento-sucesso'], {
            queryParams: {
              destino: this.destinoSelecionadoNome,
              data_inicio: this.viagem.data_inicio,
              data_fim: this.viagem.data_fim,
              forma_pagamento: formaPagamentoTexto,
              valor_pago: this.valorPagamento
            }
          });
        } else {
          this.notificationService.error(response.message || this.i18n.t('planejar.erro_criar'));
        }
      },
      error: () => {
        this.carregando = false;
        this.notificationService.error(this.i18n.t('planejar.erro_conexao'));
      }
    });
  }

  fecharModal(event?: MouseEvent) {
    if (!event || (event.target as HTMLElement).classList.contains('modal')) {
      this.modalPagamentoAberto = false;
      this.pagamentoSimulado = false;
    }
  }
}