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
        <h1>✈️ {{ i18n.t('minhas_viagens.titulo') }}</h1>
        <p>{{ i18n.t('minhas_viagens.subtitulo') }}</p>
      </div>

      <div *ngIf="carregado && viagens.length === 0" class="empty-state">
        <div class="empty-icon">🗺️</div>
        <h3>{{ i18n.t('minhas_viagens.sem_viagens') }}</h3>
        <p>{{ i18n.t('minhas_viagens.sem_viagens_texto') }}</p>
        <a routerLink="/planejar" class="btn-planejar">{{ i18n.t('minhas_viagens.planejar') }}</a>
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
              <span>💰 {{ viagem.orcamento | number }} Kz</span>
              <span *ngIf="viagem.valor_pago && viagem.valor_pago > 0">💳 {{ i18n.t('minhas_viagens.pago') }}: {{ viagem.valor_pago | number }} Kz</span>
            </div>
            <div class="payment-info" *ngIf="viagem.forma_pagamento">
              <span class="payment-badge">{{ getFormaPagamentoTexto(viagem.forma_pagamento) }}</span>
            </div>
            <button class="btn-detalhes" [routerLink]="['/viagem', viagem.id]">{{ i18n.t('minhas_viagens.ver_detalhes') }} →</button>
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
      color: white;
    }
    .page-header p {
      color: #A0A8C6;
    }
    .empty-state {
      text-align: center;
      padding: 60px;
      color: #A0A8C6;
    }
    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    .btn-planejar {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 28px;
      background: linear-gradient(135deg, #6C3BD4, #00D9FF);
      border-radius: 30px;
      color: white;
      text-decoration: none;
    }
    .viagens-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 30px;
    }
    .viagem-card {
      background: rgba(17,22,61,0.8);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(0,217,255,0.1);
      transition: transform 0.3s;
    }
    .viagem-card:hover {
      transform: translateY(-5px);
      border-color: rgba(0,217,255,0.3);
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
      color: white;
    }
    .destino {
      color: #00D9FF;
      font-size: 0.85rem;
      margin-bottom: 12px;
    }
    .date {
      color: #A0A8C6;
      font-size: 0.85rem;
      margin-bottom: 12px;
    }
    .info {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
      font-size: 0.85rem;
      color: #A0A8C6;
    }
    .payment-info {
      margin-bottom: 16px;
    }
    .payment-badge {
      background: rgba(0,217,255,0.1);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.7rem;
      color: #00D9FF;
    }
    .btn-detalhes {
      width: 100%;
      padding: 10px;
      background: transparent;
      border: 1px solid rgba(0,217,255,0.3);
      border-radius: 30px;
      color: #A0A8C6;
      cursor: pointer;
      transition: all 0.3s;
    }
    .btn-detalhes:hover {
      background: linear-gradient(135deg, #6C3BD4, #00D9FF);
      border-color: transparent;
      color: white;
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
      'confirmada': '✅ ' + this.i18n.t('status.confirmada'),
      'planejando': '📝 ' + this.i18n.t('status.planejando'),
      'reservada': '📅 ' + this.i18n.t('status.reservada'),
      'aguardando_pagamento': '⏳ ' + this.i18n.t('status.aguardando')
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