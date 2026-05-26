// modules/viagens/pages/minhas-viagens/minhas-viagens.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ViagemService } from '../../../../core/services/viagem.service';
import { DestinoService } from '../../../../core/services/destino.service';
import { AuthService } from '../../../../core/services/auth.service';
import { I18nService } from '../../../../core/services/i18n.service';

interface Viagem {
  id: number;
  titulo: string;
  destino_id: number;
  destino_nome?: string;
  destino_pais?: string;
  destino_imagem?: string;
  data_inicio: string;
  data_fim: string;
  orcamento: number;
  status: string;
  forma_pagamento?: string;
  valor_pago?: number;
}

@Component({
  selector: 'app-minhas-viagens',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>
          <svg class="header-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 15L6 12L9 15L12 12L15 15L18 12L21 15"/>
            <path d="M3 9L6 6L9 9L12 6L15 9L18 6L21 9"/>
            <path d="M3 19L6 16L9 19L12 16L15 19L18 16L21 19"/>
          </svg>
          {{ i18n.t('minhas_viagens.titulo') }}
        </h1>
        <p>{{ i18n.t('minhas_viagens.subtitulo') }}</p>
      </div>

      <div *ngIf="carregado && viagens.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12H22M12 2C14.5 4.5 15.5 8 12 12C8.5 8 9.5 4.5 12 2Z"/>
          </svg>
        </div>
        <h3>{{ i18n.t('minhas_viagens.sem_viagens') }}</h3>
        <p>{{ i18n.t('minhas_viagens.sem_viagens_texto') }}</p>
        <a routerLink="/planejar" class="btn-planejar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {{ i18n.t('minhas_viagens.planejar') }}
        </a>
      </div>

      <div class="viagens-grid" *ngIf="viagens.length > 0">
        <div *ngFor="let viagem of viagens" class="viagem-card">
          <div class="card-image">
            <img [src]="viagem.destino_imagem || 'https://placehold.co/400x200?text=Destino'" [alt]="viagem.destino_nome">
            <div class="card-status" [class.status-confirmada]="viagem.status === 'confirmada'"
                                      [class.status-planejando]="viagem.status === 'planejando'"
                                      [class.status-reservada]="viagem.status === 'reservada'"
                                      [class.status-aguardando]="viagem.status === 'aguardando_pagamento'">
              {{ getStatusTexto(viagem.status) }}
            </div>
          </div>
          <div class="card-content">
            <h3>{{ viagem.titulo }}</h3>
            <p class="destino">{{ viagem.destino_nome }}, {{ viagem.destino_pais }}</p>
            <div class="date">{{ viagem.data_inicio | date:'dd/MM/yyyy' }} - {{ viagem.data_fim | date:'dd/MM/yyyy' }}</div>
            <div class="info">
              <span>
                <svg class="info-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                {{ viagem.orcamento | number }} Kz
              </span>
              <span *ngIf="viagem.valor_pago && viagem.valor_pago > 0">
                <svg class="info-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="5" width="20" height="14" rx="2" ry="2"/>
                  <line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
                {{ i18n.t('minhas_viagens.pago') }}: {{ viagem.valor_pago | number }} Kz
              </span>
            </div>
            <div class="payment-info" *ngIf="viagem.forma_pagamento">
              <span class="payment-badge">{{ getFormaPagamentoTexto(viagem.forma_pagamento) }}</span>
            </div>
            <button class="btn-detalhes" [routerLink]="['/viagem', viagem.id]">
              {{ i18n.t('minhas_viagens.ver_detalhes') }} 
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
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
    .empty-state {
      text-align: center;
      padding: 60px;
      color: var(--text-secondary, #A0A8C6);
    }
    .empty-icon {
      margin-bottom: 20px;
    }
    .btn-planejar {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 20px;
      padding: 12px 28px;
      background: linear-gradient(135deg, #6C3BD4, #00D9FF);
      border-radius: 30px;
      color: white;
      text-decoration: none;
      transition: all 0.3s;
    }
    .btn-planejar:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(108,59,212,0.4);
    }
    .viagens-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 30px;
    }
    .viagem-card {
      background: var(--bg-card, rgba(17,22,61,0.8));
      backdrop-filter: blur(10px);
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid var(--border-color, rgba(0,217,255,0.1));
      transition: transform 0.3s;
    }
    .viagem-card:hover {
      transform: translateY(-5px);
      border-color: var(--color-secondary, #00D9FF);
    }
    .card-image {
      position: relative;
      height: 180px;
      overflow: hidden;
    }
    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .card-status {
      position: absolute;
      top: 15px;
      right: 15px;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .status-confirmada { background: #10B981; color: white; }
    .status-planejando { background: #F59E0B; color: white; }
    .status-reservada { background: #3B82F6; color: white; }
    .status-aguardando { background: #EF4444; color: white; }
    .card-content {
      padding: 20px;
    }
    .card-content h3 {
      font-size: 1.2rem;
      margin-bottom: 6px;
      color: var(--text-primary, white);
    }
    .destino {
      color: var(--color-secondary, #00D9FF);
      font-size: 0.85rem;
      margin-bottom: 12px;
    }
    .date {
      color: var(--text-secondary, #A0A8C6);
      font-size: 0.85rem;
      margin-bottom: 12px;
    }
    .info {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
      font-size: 0.85rem;
      color: var(--text-secondary, #A0A8C6);
    }
    .info-svg {
      stroke: currentColor;
      display: inline;
      vertical-align: middle;
      margin-right: 4px;
    }
    .payment-info {
      margin-bottom: 16px;
    }
    .payment-badge {
      background: rgba(0,217,255,0.1);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.7rem;
      color: var(--color-secondary, #00D9FF);
    }
    .btn-detalhes {
      width: 100%;
      padding: 10px;
      background: transparent;
      border: 1px solid var(--border-color, rgba(0,217,255,0.3));
      border-radius: 30px;
      color: var(--text-secondary, #A0A8C6);
      cursor: pointer;
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .btn-detalhes:hover {
      background: linear-gradient(135deg, #6C3BD4, #00D9FF);
      border-color: transparent;
      color: white;
    }
    @media (max-width: 768px) {
      .viagens-grid {
        grid-template-columns: 1fr;
      }
    }
    /* Light Mode */
    body.light-theme .viagem-card {
      background: #FFFFFF;
      border-color: #E2E8F0;
    }
    body.light-theme .card-content h3 {
      color: #1E293B;
    }
    body.light-theme .date {
      color: #64748B;
    }
    body.light-theme .info {
      color: #64748B;
    }
    body.light-theme .btn-detalhes {
      border-color: #CBD5E1;
      color: #64748B;
    }
    body.light-theme .btn-detalhes:hover {
      background: linear-gradient(135deg, #6C3BD4, #3B82F6);
      color: white;
    }
    body.light-theme .empty-state {
      color: #64748B;
    }
    body.light-theme .page-header h1 {
      color: #1E293B;
    }
    body.light-theme .page-header p {
      color: #64748B;
    }
  `]
})
export class MinhasViagens implements OnInit {
  viagens: Viagem[] = [];
  carregado = false;

  constructor(
    private viagemService: ViagemService,
    private destinoService: DestinoService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    public i18n: I18nService
  ) {}

  ngOnInit() {
    this.carregarViagens();
  }

  getStatusTexto(status: string): string {
    const statusMap: any = {
      'confirmada': this.i18n.t('status.confirmada'),
      'planejando': this.i18n.t('status.planejando'),
      'reservada': this.i18n.t('status.reservada'),
      'aguardando_pagamento': this.i18n.t('status.aguardando')
    };
    return statusMap[status] || status;
  }

  getFormaPagamentoTexto(forma: string): string {
    const formaMap: any = {
      'pagar_agora': this.i18n.t('pagamento.vista'),
      'sinal': this.i18n.t('pagamento.sinal'),
      'parcelar': this.i18n.t('pagamento.parcelado'),
      'reservar': this.i18n.t('pagamento.reserva')
    };
    return formaMap[forma] || forma;
  }

  carregarViagens() {
    const usuario = this.authService.usuario();
    if (!usuario?.id) {
      this.carregado = true;
      return;
    }

    this.destinoService.listar().subscribe({
      next: (responseDestinos: any) => {
        const destinos = responseDestinos.success ? responseDestinos.data : [];
        
        this.viagemService.listarPorUsuario(usuario.id).subscribe({
          next: (responseViagens: any) => {
            if (responseViagens.success && responseViagens.data) {
              this.viagens = responseViagens.data.map((viagem: any) => {
                const destino = destinos.find((d: any) => d.id === viagem.destino_id);
                return {
                  ...viagem,
                  destino_nome: destino?.nome || 'Destino',
                  destino_pais: destino?.pais || '',
                  destino_imagem: destino?.imagem || ''
                };
              });
            }
            this.carregado = true;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Erro:', err);
            this.carregado = true;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Erro ao carregar destinos:', err);
        this.carregado = true;
        this.cdr.detectChanges();
      }
    });
  }
}