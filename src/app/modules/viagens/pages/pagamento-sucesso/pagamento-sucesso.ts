// modules/pagamento/pages/pagamento-sucesso/pagamento-sucesso.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { I18nService } from '../../../../core/services/i18n.service';

@Component({
  selector: 'app-pagamento-sucesso',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="success-container">
      <div class="success-card">
        <div class="success-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h1>{{ i18n.t('pagamento_sucesso.titulo') }}</h1>
        <p>{{ i18n.t('pagamento_sucesso.subtitulo') }}</p>
        
        <div class="info-box">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
            {{ i18n.t('pagamento_sucesso.detalhes') }}
          </h3>
          <p>
            <strong>
              <svg class="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12H22M12 2C14.5 4.5 15.5 8 12 12C8.5 8 9.5 4.5 12 2Z"/>
              </svg>
              {{ i18n.t('pagamento_sucesso.destino') }}:
            </strong> {{ destino }}
          </p>
          <p>
            <strong>
              <svg class="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ i18n.t('pagamento_sucesso.data_inicio') }}:
            </strong> {{ dataInicio | date:'dd/MM/yyyy' }}
          </p>
          <p>
            <strong>
              <svg class="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ i18n.t('pagamento_sucesso.data_fim') }}:
            </strong> {{ dataFim | date:'dd/MM/yyyy' }}
          </p>
          <p>
            <strong>
              <svg class="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
              {{ i18n.t('pagamento_sucesso.forma_pagamento') }}:
            </strong> {{ formaPagamento }}
          </p>
          <p>
            <strong>
              <svg class="info-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              {{ i18n.t('pagamento_sucesso.valor_pago') }}:
            </strong> {{ valorPago | number }} Kz
          </p>
        </div>

        <div class="button-group">
          <a routerLink="/minhas-viagens" class="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M3 15L6 12L9 15L12 12L15 15L18 12L21 15"/>
              <path d="M3 9L6 6L9 9L12 6L15 9L18 6L21 9"/>
            </svg>
            {{ i18n.t('pagamento_sucesso.ver_viagens') }}
          </a>
          <a routerLink="/destinos" class="btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12H22M12 2C14.5 4.5 15.5 8 12 12C8.5 8 9.5 4.5 12 2Z"/>
            </svg>
            {{ i18n.t('pagamento_sucesso.explorar') }}
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
      padding: 40px 20px;
    }
    
    .success-card {
      background: var(--bg-card, rgba(17,22,61,0.9));
      backdrop-filter: blur(10px);
      border-radius: 32px;
      padding: 48px;
      max-width: 550px;
      width: 100%;
      text-align: center;
      border: 1px solid var(--border-color, rgba(0,217,255,0.2));
      transition: all 0.3s ease;
    }
    
    .success-icon { 
      margin-bottom: 24px; 
    }
    
    h1 { 
      color: var(--text-primary, white); 
      margin-bottom: 16px; 
    }
    
    p { 
      color: var(--text-secondary, #A0A8C6); 
      margin-bottom: 32px; 
    }
    
    .info-box { 
      background: var(--bg-hover, rgba(0,217,255,0.05)); 
      border-radius: 16px; 
      padding: 20px; 
      margin: 24px 0; 
      text-align: left; 
    }
    
    .info-box h3 { 
      color: var(--color-secondary, #00D9FF); 
      margin-bottom: 16px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    
    .info-box p { 
      margin-bottom: 8px; 
      color: var(--text-primary, white);
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    .info-icon {
      stroke: var(--color-secondary, #00D9FF);
      display: inline;
    }
    
    .button-group { 
      display: flex; 
      gap: 16px; 
      justify-content: center; 
      flex-wrap: wrap;
    }
    
    .btn-primary, .btn-secondary { 
      padding: 12px 24px; 
      border-radius: 30px; 
      font-weight: 600; 
      text-decoration: none; 
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    
    .btn-primary { 
      background: var(--gradient-primary, linear-gradient(135deg, #6C3BD4, #00D9FF)); 
      color: white; 
    }
    
    .btn-primary:hover { 
      transform: translateY(-2px); 
      box-shadow: 0 4px 15px rgba(108,59,212,0.4); 
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

    /* Light Mode Specific Styles */
    body.light-theme .success-container {
      background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
    }

    body.light-theme .success-card {
      background: #FFFFFF;
      border-color: #E2E8F0;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
    }

    body.light-theme h1 {
      color: #1E293B;
    }

    body.light-theme p {
      color: #64748B;
    }

    body.light-theme .info-box {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
    }

    body.light-theme .info-box h3 {
      color: #3B82F6;
    }

    body.light-theme .info-box p {
      color: #1E293B;
    }

    body.light-theme .btn-primary {
      background: linear-gradient(135deg, #6C3BD4, #3B82F6);
    }

    body.light-theme .btn-secondary {
      border-color: #CBD5E1;
      color: #64748B;
    }

    body.light-theme .btn-secondary:hover {
      border-color: #3B82F6;
      color: #3B82F6;
    }

    /* Responsive */
    @media (max-width: 640px) {
      .success-card {
        padding: 32px 24px;
      }
      
      .button-group {
        flex-direction: column;
      }
      
      .btn-primary, .btn-secondary {
        text-align: center;
        justify-content: center;
      }
    }
  `]
})
export class PagamentoSucesso implements OnInit {
  destino = '';
  dataInicio = '';
  dataFim = '';
  formaPagamento = '';
  valorPago = 0;

  constructor(
    private route: ActivatedRoute,
    public i18n: I18nService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.destino = params['destino'] || '-';
      this.dataInicio = params['data_inicio'] || '';
      this.dataFim = params['data_fim'] || '';
      this.formaPagamento = params['forma_pagamento'] || '-';
      this.valorPago = params['valor_pago'] || 0;
    });
  }
}