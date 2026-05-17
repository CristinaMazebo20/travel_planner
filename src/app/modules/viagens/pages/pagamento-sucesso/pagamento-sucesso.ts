import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pagamento-sucesso',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="success-container">
      <div class="success-card">
        <div class="success-icon">✅</div>
        <h1>Pagamento Confirmado!</h1>
        <p>Sua viagem foi confirmada com sucesso.</p>
        
        <div class="info-box">
          <h3>📋 Detalhes da Viagem</h3>
          <p><strong>Destino:</strong> {{ destino }}</p>
          <p><strong>Data de início:</strong> {{ dataInicio | date:'dd/MM/yyyy' }}</p>
          <p><strong>Data de fim:</strong> {{ dataFim | date:'dd/MM/yyyy' }}</p>
          <p><strong>Forma de pagamento:</strong> {{ formaPagamento }}</p>
          <p><strong>Valor pago:</strong> {{ valorPago | number }} Kz</p>
        </div>

        <div class="button-group">
          <a routerLink="/minhas-viagens" class="btn-primary">Ver minhas viagens</a>
          <a routerLink="/destinos" class="btn-secondary">Explorar mais destinos</a>
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
      background: linear-gradient(135deg, #0A0F2E 0%, #1A1F4E 100%);
      padding: 40px 20px;
    }
    .success-card {
      background: rgba(17,22,61,0.9);
      backdrop-filter: blur(10px);
      border-radius: 32px;
      padding: 48px;
      max-width: 550px;
      width: 100%;
      text-align: center;
      border: 1px solid rgba(0,217,255,0.2);
    }
    .success-icon { font-size: 64px; margin-bottom: 24px; }
    h1 { color: white; margin-bottom: 16px; }
    p { color: #A0A8C6; margin-bottom: 32px; }
    .info-box { background: rgba(0,217,255,0.05); border-radius: 16px; padding: 20px; margin: 24px 0; text-align: left; }
    .info-box h3 { color: #00D9FF; margin-bottom: 16px; }
    .info-box p { margin-bottom: 8px; color: white; }
    .button-group { display: flex; gap: 16px; justify-content: center; }
    .btn-primary, .btn-secondary { padding: 12px 24px; border-radius: 30px; font-weight: 600; text-decoration: none; }
    .btn-primary { background: linear-gradient(135deg, #6C3BD4, #00D9FF); color: white; }
    .btn-secondary { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #A0A8C6; }
  `]
})
export class PagamentoSucesso implements OnInit {
  destino = '';
  dataInicio = '';
  dataFim = '';
  formaPagamento = '';
  valorPago = 0;

  constructor(private route: ActivatedRoute) {}

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