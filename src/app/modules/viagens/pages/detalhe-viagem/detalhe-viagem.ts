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
        <a routerLink="/minhas-viagens" class="btn-back">← {{ i18n.t('detalhe_viagem.voltar') }}</a>
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
          <h3>📅 {{ i18n.t('detalhe_viagem.datas_viagem') }}</h3>
          <p><strong>{{ i18n.t('detalhe_viagem.data_inicio') }}:</strong> {{ viagem.data_inicio | date:'dd/MM/yyyy' }}</p>
          <p><strong>{{ i18n.t('detalhe_viagem.data_fim') }}:</strong> {{ viagem.data_fim | date:'dd/MM/yyyy' }}</p>
          <p><strong>{{ i18n.t('detalhe_viagem.duracao') }}:</strong> {{ calcularDuracao() }} {{ i18n.t('detalhe_viagem.dias') }}</p>
          <button *ngIf="podeEditarDados()" class="btn-edit-small" (click)="abrirModalEdicaoDados()">
            ✏️ {{ i18n.t('detalhe_viagem.editar_datas') }}
          </button>
        </div>

        <div class="info-card">
          <h3>📍 {{ i18n.t('detalhe_viagem.destino') }}</h3>
          <p><strong>{{ i18n.t('detalhe_viagem.destino') }}:</strong> {{ viagem.destino_nome }}</p>
          <p><strong>{{ i18n.t('detalhe_viagem.pais') }}:</strong> {{ viagem.destino_pais }}</p>
          <p><strong>{{ i18n.t('detalhe_viagem.descricao') }}:</strong> {{ viagem.destino_descricao || i18n.t('detalhe_viagem.descricao_indisponivel') }}</p>
        </div>

        <div class="info-card">
          <h3>💰 {{ i18n.t('detalhe_viagem.financeiro') }}</h3>
          <p><strong>{{ i18n.t('detalhe_viagem.orcamento_total') }}:</strong> {{ viagem.orcamento | number }} Kz</p>
          <p><strong>{{ i18n.t('detalhe_viagem.valor_pago') }}:</strong> {{ (viagem.valor_pago || 0) | number }} Kz</p>
          <p><strong>{{ i18n.t('detalhe_viagem.saldo_restante') }}:</strong> {{ (viagem.orcamento - (viagem.valor_pago || 0)) | number }} Kz</p>
          <p *ngIf="viagem.forma_pagamento"><strong>{{ i18n.t('detalhe_viagem.forma_pagamento') }}:</strong> {{ getFormaPagamentoTexto(viagem.forma_pagamento) }}</p>
        </div>

        <div class="info-card">
          <h3>📋 {{ i18n.t('detalhe_viagem.status_viagem') }}</h3>
          <p><strong>{{ i18n.t('detalhe_viagem.status_atual') }}:</strong> {{ getStatusTexto(viagem.status) }}</p>
          <p><strong>{{ i18n.t('detalhe_viagem.data_planejamento') }}:</strong> {{ viagem.created_at | date:'dd/MM/yyyy HH:mm' }}</p>
        </div>
      </div>

      <!-- Ações baseadas no status -->
      <div class="actions">
        <!-- Editar dados (só aparece se status = planejando) -->
        <div class="actions-group" *ngIf="podeEditarDados()">
          <button class="btn-editar-dados" (click)="abrirModalEdicaoDados()">
            ✏️ {{ i18n.t('detalhe_viagem.editar_viagem') }}
          </button>
        </div>

        <!-- Ações de pagamento (aparece se não confirmada/cancelada/concluída) -->
        <div class="actions-group" *ngIf="podeEditarPagamento()">
          <button class="btn-pagar" (click)="abrirModalPagamento()">
            💳 {{ i18n.t('detalhe_viagem.adicionar_pagamento') }}
          </button>
          <button class="btn-concluir" *ngIf="(viagem.valor_pago || 0) < viagem.orcamento" (click)="abrirModalConcluirPagamento()">
            ✅ {{ i18n.t('detalhe_viagem.concluir_pagamento') }}
          </button>
        </div>

        <!-- Cancelar (só se não cancelada/concluída) -->
        <div class="actions-group" *ngIf="podeCancelar()">
          <button class="btn-cancelar" (click)="abrirModalCancelamento()">
            ❌ {{ i18n.t('detalhe_viagem.cancelar_viagem') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Edição de Dados -->
    <div class="modal" *ngIf="modalEdicaoDadosAberto" (click)="fecharModal($event)">
      <div class="modal-content">
        <div class="modal-header">
          <h3>✏️ {{ i18n.t('modal.editar_viagem.titulo') }}</h3>
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
          <h3>💳 {{ i18n.t('modal.pagamento.titulo') }}</h3>
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
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" (click)="fecharModal()">{{ i18n.t('common.cancelar') }}</button>
          <button class="btn-save" (click)="adicionarPagamento()" [disabled]="salvando">{{ i18n.t('modal.pagamento.adicionar') }}</button>
        </div>
      </div>
    </div>

    <!-- Modal de Concluir Pagamento -->
    <div class="modal" *ngIf="modalConcluirPagamentoAberto" (click)="fecharModal($event)">
      <div class="modal-content">
        <div class="modal-header">
          <h3>✅ {{ i18n.t('modal.concluir_pagamento.titulo') }}</h3>
          <button class="modal-close" (click)="fecharModal()">×</button>
        </div>
        <div class="modal-body">
          <p>{{ i18n.t('modal.concluir_pagamento.mensagem') }}</p>
          <p><strong>{{ i18n.t('modal.concluir_pagamento.valor_restante') }}:</strong> {{ (viagem!.orcamento - (viagem!.valor_pago || 0)) | number }} Kz</p>
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
          <h3>❌ {{ i18n.t('modal.cancelar.titulo') }}</h3>
          <button class="modal-close" (click)="fecharModal()">×</button>
        </div>
        <div class="modal-body">
          <p>{{ i18n.t('modal.cancelar.mensagem') }}</p>
          <p class="warning">{{ i18n.t('modal.cancelar.aviso_irreversivel') }}</p>
          <p *ngIf="(viagem!.valor_pago || 0) > 0" class="warning">
            ⚠️ {{ i18n.t('modal.cancelar.reembolso') }} {{ (viagem!.valor_pago || 0) | number }} Kz {{ i18n.t('modal.cancelar.reembolso_politica') }}
          </p>
          <p *ngIf="(viagem!.valor_pago || 0) === 0" class="warning">
            ⚠️ {{ i18n.t('modal.cancelar.reembolso_zero') }}
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" (click)="fecharModal()">{{ i18n.t('modal.cancelar.voltar') }}</button>
          <button class="btn-confirm-cancel" (click)="confirmarCancelamento()" [disabled]="salvando">{{ i18n.t('modal.cancelar.confirmar') }}</button>
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
    .info-card h3 { color: var(--color-secondary, #00D9FF); margin-bottom: 16px; }
    .info-card p { color: var(--text-secondary, #A0A8C6); margin-bottom: 8px; }
    .info-card p strong { color: var(--text-primary, white); }
    .btn-edit-small { margin-top: 12px; padding: 6px 12px; background: rgba(0,217,255,0.1); border: 1px solid rgba(0,217,255,0.3); border-radius: 20px; color: var(--color-secondary, #00D9FF); cursor: pointer; font-size: 0.75rem; transition: all 0.2s; }
    .btn-edit-small:hover { background: rgba(0,217,255,0.2); transform: translateY(-2px); }
    
    .actions { display: flex; flex-direction: column; gap: 16px; margin-top: 24px; }
    .actions-group { display: flex; gap: 16px; justify-content: flex-end; flex-wrap: wrap; }
    .btn-editar-dados, .btn-pagar, .btn-concluir, .btn-cancelar { padding: 12px 24px; border-radius: 30px; font-weight: 600; cursor: pointer; transition: all 0.3s; border: none; }
    .btn-editar-dados { background: var(--gradient-primary, linear-gradient(135deg, #6C3BD4, #00D9FF)); color: white; }
    .btn-pagar { background: var(--gradient-primary, linear-gradient(135deg, #6C3BD4, #00D9FF)); color: white; }
    .btn-concluir { background: #10B981; color: white; }
    .btn-cancelar { background: transparent; border: 1px solid #EF4444; color: #EF4444; }
    .btn-editar-dados:hover, .btn-pagar:hover, .btn-concluir:hover, .btn-cancelar:hover { transform: translateY(-2px); }
    
    /* Modal */
    .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: var(--bg-modal, #1A1F4E); border-radius: 24px; max-width: 500px; width: 90%; overflow: hidden; border: 1px solid var(--border-color, rgba(0,217,255,0.2)); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid var(--border-color, rgba(0,217,255,0.2)); }
    .modal-header h3 { margin: 0; color: var(--text-primary, white); }
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
    .warning { color: #EF4444; margin-top: 8px; }
    .error-container { text-align: center; padding: 80px; color: var(--text-secondary, #A0A8C6); }
    
    @media (max-width: 768px) { 
      .info-grid { grid-template-columns: 1fr; } 
      .header { flex-direction: column; align-items: flex-start; } 
      .form-row { grid-template-columns: 1fr; } 
      .actions-group { justify-content: center; } 
    }

    /* Light Mode Specific Styles */
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

    body.light-theme .btn-edit-small:hover {
      background: #E2E8F0;
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

  // ==================== REGRAS DE PERMISSÃO ====================
  
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

  // ==================== UTILITÁRIOS ====================
  
  getStatusTexto(status: string): string {
    const statusMap: any = {
      'confirmada': '✅ ' + this.i18n.t('status.confirmada'),
      'planejando': '📝 ' + this.i18n.t('status.planejando'),
      'reservada': '📅 ' + this.i18n.t('status.reservada'),
      'aguardando_pagamento': '⏳ ' + this.i18n.t('status.aguardando'),
      'cancelada': '❌ ' + this.i18n.t('status.cancelada')
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

  // ==================== CARREGAMENTO ====================
  
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

  // ==================== EDIÇÃO DE DADOS ====================
  
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

  // ==================== PAGAMENTOS ====================
  
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

  // ==================== CANCELAMENTO ====================
  
  abrirModalCancelamento() {
    this.modalCancelamentoAberto = true;
  }

  confirmarCancelamento() {
    if (!this.viagem) return;

    this.salvando = true;
    this.viagemService.deletar(this.viagem.id).subscribe({
      next: (response: any) => {
        this.salvando = false;
        if (response.success) {
          this.notificationService.success(this.i18n.t('common.sucesso'));
          this.fecharModal();
          this.router.navigate(['/minhas-viagens']);
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

  // ==================== MODAL ====================
  
  fecharModal(event?: MouseEvent) {
    if (!event || (event.target as HTMLElement).classList.contains('modal')) {
      this.modalEdicaoDadosAberto = false;
      this.modalPagamentoAberto = false;
      this.modalConcluirPagamentoAberto = false;
      this.modalCancelamentoAberto = false;
    }
  }
}