import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DestinoService, Destino } from '../../../../core/services/destino.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-detalhe-destino',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container" *ngIf="destino">
      <!-- Botão voltar -->
      <div class="back-button">
        <a routerLink="/destinos" class="btn-back">← Voltar para destinos</a>
      </div>

      <!-- Imagem principal -->
      <div class="hero-image">
        <img [src]="destino.imagem" [alt]="destino.nome" (error)="destino.imagem = 'https://placehold.co/800x400?text=Destino'">
        <div class="hero-overlay">
          <div class="hero-content">
            <h1>{{ destino.nome }}</h1>
            <p>{{ destino.cidade }}, {{ destino.pais }}</p>
          </div>
        </div>
      </div>

      <!-- Conteúdo -->
      <div class="content-grid">
        <div class="main-content">
          <div class="info-card">
            <h2>📝 Sobre o destino</h2>
            <p>{{ destino.descricao }}</p>
          </div>

          <div class="info-card">
            <h2>✨ Atrações principais</h2>
            <div class="atracoes-grid">
              <div *ngFor="let atracao of destino.atracoes" class="atracao-item">
                {{ atracao }}
              </div>
            </div>
          </div>

          <div class="info-card">
            <h2>📅 Melhor época para visitar</h2>
            <p>{{ destino.melhorEpoca || 'Durante todo o ano' }}</p>
          </div>
        </div>

        <div class="sidebar">
          <div class="price-card">
            <h3>💰 Preço médio</h3>
            <div class="price">{{ destino.preco | number }} Kz</div>
            <p>por pessoa (ida e volta)</p>
            <button class="btn-planejar" routerLink="/planejar">✈️ Planejar viagem</button>
          </div>

          <div class="info-card">
            <h3>⭐ Avaliação</h3>
            <div class="rating">{{ destino.avaliacao }} / 5.0</div>
            <div class="stars">★★★★★</div>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="!destino && !carregando" class="error-container">
      <h2>Destino não encontrado</h2>
      <a routerLink="/destinos" class="btn-back">Voltar para destinos</a>
    </div>

    <div *ngIf="carregando" class="loading">Carregando...</div>
  `,
  styles: [`
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 40px 24px 60px;
    }

    .back-button {
      margin-bottom: 24px;
    }

    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(17, 22, 61, 0.8);
      backdrop-filter: blur(10px);
      padding: 10px 20px;
      border-radius: 30px;
      color: #A0A8C6;
      text-decoration: none;
      border: 1px solid rgba(0,217,255,0.2);
      transition: all 0.3s;
    }

    .btn-back:hover {
      color: #00D9FF;
      border-color: #00D9FF;
    }

    .hero-image {
      position: relative;
      height: 400px;
      border-radius: 24px;
      overflow: hidden;
      margin-bottom: 40px;
    }

    .hero-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0,0,0,0.8));
      padding: 40px;
    }

    .hero-content h1 {
      font-size: 2.5rem;
      margin-bottom: 8px;
      color: white;
    }

    .hero-content p {
      color: #00D9FF;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 32px;
    }

    .info-card {
      background: rgba(17, 22, 61, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 24px;
      border: 1px solid rgba(0,217,255,0.1);
    }

    .info-card h2, .info-card h3 {
      margin-bottom: 16px;
      color: #00D9FF;
    }

    .atracoes-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .atracao-item {
      background: rgba(0,217,255,0.1);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.85rem;
    }

    .price-card {
      background: linear-gradient(135deg, rgba(108,59,212,0.8), rgba(0,217,255,0.8));
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 24px;
      text-align: center;
      margin-bottom: 24px;
    }

    .price {
      font-size: 2rem;
      font-weight: bold;
      margin: 16px 0;
      color: white;
    }

    .btn-planejar {
      width: 100%;
      padding: 12px;
      background: white;
      color: #6C3BD4;
      border: none;
      border-radius: 30px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 16px;
    }

    .rating {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 8px;
      color: white;
    }

    .stars {
      color: #FFD700;
      font-size: 1.2rem;
    }

    .loading, .error-container {
      text-align: center;
      padding: 80px 20px;
      color: #A0A8C6;
    }

    .error-container h2 {
      margin-bottom: 20px;
      color: white;
    }

    @media (max-width: 768px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
      .hero-content h1 {
        font-size: 1.5rem;
      }
      .container {
        padding: 20px 16px 40px;
      }
    }
  `]
})
export class DetalheDestino implements OnInit {
  destino: Destino | null = null;
  carregando = true;

  constructor(
    private route: ActivatedRoute,
    private destinoService: DestinoService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarDestino(parseInt(id));
    } else {
      this.carregando = false;
      this.notificationService.error('Destino não identificado');
    }
  }

  carregarDestino(id: number) {
    this.carregando = true;
    this.destinoService.buscar(id).subscribe({
      next: (response: any) => {
        this.carregando = false;
        if (response.success && response.data) {
          // Garantir que atracoes seja um array
          const data = response.data;
          if (typeof data.atracoes === 'string') {
            data.atracoes = data.atracoes.split(',');
          }
          if (!data.atracoes) {
            data.atracoes = [];
          }
          this.destino = data;
        } else {
          this.notificationService.error('Destino não encontrado');
        }
      },
      error: (err) => {
        this.carregando = false;
        console.error('Erro:', err);
        this.notificationService.error('Erro de conexão');
      }
    });
  }
}