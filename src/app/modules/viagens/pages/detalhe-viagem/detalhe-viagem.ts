import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ViagemService } from '../../../../core/services/viagem.service';
import { DestinoService } from '../../../../core/services/destino.service';
import { NotificationService } from '../../../../core/services/notification.service';

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
        <a routerLink="/minhas-viagens" class="btn-back">← Voltar para minhas viagens</a>
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
          <h3>📅 Datas da Viagem</h3>
          <p><strong>Data de início:</strong> {{ viagem.data_inicio | date:'dd/MM/yyyy' }}</p>
          <p><strong>Data de fim:</strong> {{ viagem.data_fim | date:'dd/MM/yyyy' }}</p>
          <p><strong>Duração:</strong> {{ calcularDuracao() }} dias</p>
          <button *ngIf="podeEditarDados()" class="btn-edit-small" (click)="abrirModalEdicaoDados()">
            ✏️ Editar datas
          </button>
        </div>

        <div class="info-card">
          <h3>📍 Destino</h3>
          <p><strong>Destino:</strong> {{ viagem.destino_nome }}</p>
          <p><strong>País:</strong> {{ viagem.destino_pais }}</p>
          <p><strong>Descrição:</strong> {{ viagem.destino_descricao || 'Informações não disponíveis' }}</p>
        </div>

        <div class="info-card">
          <h3>💰 Financeiro</h3>
          <p><strong>Orçamento total:</strong> {{ viagem.orcamento | number }} Kz</p>
          <p><strong>Valor pago:</strong> {{ (viagem.valor_pago || 0) | number }} Kz</p>
          <p><strong>Saldo restante:</strong> {{ (viagem.orcamento - (viagem.valor_pago || 0)) | number }} Kz</p>
          <p *ngIf="viagem.forma_pagamento"><strong>Forma de pagamento:</strong> {{ getFormaPagamentoTexto(viagem.forma_pagamento) }}</p>
        </div>

        <div class="info-card">
          <h3>📋 Status da Viagem</h3>
          <p><strong>Status atual:</strong> {{ getStatusTexto(viagem.status) }}</p>
          <p><strong>Data do planejamento:</strong> {{ viagem.created_at | date:'dd/MM/yyyy HH:mm' }}</p>
        </div>
      </div>

      <!-- Ações baseadas no status -->
      <div class="actions">
        <!-- Editar dados (só aparece se status = planejando) -->
        <div class="actions-group" *ngIf="podeEditarDados()">
          <button class="btn-editar-dados" (click)="abrirModalEdicaoDados()">
            ✏️ Editar viagem
          </button>
        </div>

        <!-- Ações de pagamento (aparece se não confirmada/cancelada/concluída) -->
        <div class="actions-group" *ngIf="podeEditarPagamento()">
          <button class="btn-pagar" (click)="abrirModalPagamento()">
            💳 Adicionar pagamento
          </button>
          <button class="btn-concluir" *ngIf="(viagem.valor_pago || 0) < viagem.orcamento" (click)="abrirModalConcluirPagamento()">
            ✅ Concluir pagamento
          </button>
        </div>

        <!-- Cancelar (só se não cancelada/concluída) -->
        <div class="actions-group" *ngIf="podeCancelar()">
          <button class="btn-cancelar" (click)="abrirModalCancelamento()">
            ❌ Cancelar viagem
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Edição de Dados -->
    <div class="modal" *ngIf="modalEdicaoDadosAberto" (click)="fecharModal($event)">
      <div class="modal-content">
        <div class="modal-header">
          <h3>✏️ Editar Viagem</h3>
          <button class="modal-close" (click)="fecharModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Título da viagem</label>
            <input type="text" class="form-control" [(ngModel)]="viagemEdit.titulo">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Data de início</label>
              <input type="date" class="form-control" [(ngModel)]="viagemEdit.data_inicio">
            </div>
            <div class="form-group">
              <label>Data de fim</label>
              <input type="date" class="form-control" [(ngModel)]="viagemEdit.data_fim">
            </div>
          </div>
          <div class="form-group">
            <label>Orçamento (Kz)</label>
            <input type="number" class="form-control" [(ngModel)]="viagemEdit.orcamento">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" (click)="fecharModal()">Cancelar</button>
          <button class="btn-save" (click)="salvarEdicaoDados()" [disabled]="salvando">Salvar alterações</button>
        </div>
      </div>
    </div>

    <!-- Modal de Adicionar Pagamento -->
    <div class="modal" *ngIf="modalPagamentoAberto" (click)="fecharModal($event)">
      <div class="modal-content">
        <div class="modal-header">
          <h3>💳 Adicionar Pagamento</h3>
          <button class="modal-close" (click)="fecharModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Valor a pagar (Kz)</label>
            <input type="number" class="form-control" [(ngModel)]="valorPagamento" placeholder="0">
            <small>Saldo restante: {{ (viagem!.orcamento - (viagem!.valor_pago || 0)) | number }} Kz</small>
          </div>
          <div class="form-group">
            <label>Forma de pagamento</label>
            <select class="form-control" [(ngModel)]="formaPagamentoSelecionada">
              <option value="pix">PIX</option>
              <option value="cartao">Cartão de Crédito</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="transferencia">Transferência Bancária</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" (click)="fecharModal()">Cancelar</button>
          <button class="btn-save" (click)="adicionarPagamento()" [disabled]="salvando">Adicionar pagamento</button>
        </div>
      </div>
    </div>

    <!-- Modal de Concluir Pagamento -->
    <div class="modal" *ngIf="modalConcluirPagamentoAberto" (click)="fecharModal($event)">
      <div class="modal-content">
        <div class="modal-header">
          <h3>✅ Concluir Pagamento</h3>
          <button class="modal-close" (click)="fecharModal()">×</button>
        </div>
        <div class="modal-body">
          <p>Deseja concluir o pagamento total da viagem?</p>
          <p><strong>Valor restante:</strong> {{ (viagem!.orcamento - (viagem!.valor_pago || 0)) | number }} Kz</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" (click)="fecharModal()">Cancelar</button>
          <button class="btn-save" (click)="concluirPagamento()" [disabled]="salvando">Confirmar pagamento</button>
        </div>
      </div>
    </div>

    <!-- Modal de Cancelamento -->
    <div class="modal" *ngIf="modalCancelamentoAberto" (click)="fecharModal($event)">
      <div class="modal-content">
        <div class="modal-header">
          <h3>❌ Cancelar Viagem</h3>
          <button class="modal-close" (click)="fecharModal()">×</button>
        </div>
        <div class="modal-body">
          <p>Tem certeza que deseja cancelar esta viagem?</p>
          <p class="warning">Esta ação não pode ser desfeita.</p>
          <p *ngIf="(viagem!.valor_pago || 0) > 0" class="warning">
            ⚠️ Você receberá reembolso de {{ (viagem!.valor_pago || 0) | number }} Kz conforme política de cancelamento.
          </p>
          <p *ngIf="(viagem!.valor_pago || 0) === 0" class="warning">
            ⚠️ Nenhum valor foi pago, cancelamento gratuito.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" (click)="fecharModal()">Voltar</button>
          <button class="btn-confirm-cancel" (click)="confirmarCancelamento()" [disabled]="salvando">Sim, cancelar viagem</button>
        </div>
      </div>
    </div>

    <div *ngIf="!viagem" class="error-container">
      <h2>Viagem não encontrada</h2>
      <a routerLink="/minhas-viagens" class="btn-back">Voltar para minhas viagens</a>
    </div>
  `,
  styles: [`
    .container { max-width: 1000px; margin: 0 auto; padding: 40px 24px; }
    .back-button { margin-bottom: 24px; }
    .btn-back { display: inline-flex; align-items: center; gap: 8px; background: rgba(17,22,61,0.8); backdrop-filter: blur(10px); padding: 10px 20px; border-radius: 30px; color: #A0A8C6; text-decoration: none; border: 1px solid rgba(0,217,255,0.2); }
    .btn-back:hover { color: #00D9FF; border-color: #00D9FF; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
    .header h1 { font-size: 2rem; color: white; margin: 0; }
    .status-badge { padding: 6px 16px; border-radius: 30px; font-size: 0.85rem; font-weight: 500; }
    .status-confirmada { background: #10B981; color: white; }
    .status-planejando { background: #F59E0B; color: white; }
    .status-reservada { background: #3B82F6; color: white; }
    .status-aguardando { background: #EF4444; color: white; }
    .status-cancelada { background: #6B7280; color: white; }
    .destino-imagem { height: 300px; border-radius: 24px; overflow: hidden; margin-bottom: 32px; }
    .destino-imagem img { width: 100%; height: 100%; object-fit: cover; }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 32px; }
    .info-card { background: rgba(17,22,61,0.8); backdrop-filter: blur(10px); border-radius: 20px; padding: 24px; border: 1px solid rgba(0,217,255,0.1); }
    .info-card h3 { color: #00D9FF; margin-bottom: 16px; }
    .info-card p { color: #A0A8C6; margin-bottom: 8px; }
    .info-card p strong { color: white; }
    .btn-edit-small { margin-top: 12px; padding: 6px 12px; background: rgba(0,217,255,0.1); border: 1px solid rgba(0,217,255,0.3); border-radius: 20px; color: #00D9FF; cursor: pointer; font-size: 0.75rem; }
    
    .actions { display: flex; flex-direction: column; gap: 16px; margin-top: 24px; }
    .actions-group { display: flex; gap: 16px; justify-content: flex-end; flex-wrap: wrap; }
    .btn-editar-dados, .btn-pagar, .btn-concluir, .btn-cancelar { padding: 12px 24px; border-radius: 30px; font-weight: 600; cursor: pointer; transition: all 0.3s; border: none; }
    .btn-editar-dados { background: linear-gradient(135deg, #6C3BD4, #00D9FF); color: white; }
    .btn-pagar { background: linear-gradient(135deg, #6C3BD4, #00D9FF); color: white; }
    .btn-concluir { background: #10B981; color: white; }
    .btn-cancelar { background: transparent; border: 1px solid #EF4444; color: #EF4444; }
    
    /* Modal */
    .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: #1A1F4E; border-radius: 24px; max-width: 500px; width: 90%; overflow: hidden; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid rgba(0,217,255,0.2); }
    .modal-header h3 { margin: 0; color: white; }
    .modal-close { background: none; border: none; color: white; font-size: 24px; cursor: pointer; }
    .modal-body { padding: 24px; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 20px; border-top: 1px solid rgba(0,217,255,0.2); }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 8px; color: #00D9FF; }
    .form-control { width: 100%; padding: 12px; background: rgba(10,15,46,0.9); border: 1px solid rgba(0,217,255,0.2); border-radius: 12px; color: white; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .btn-cancel, .btn-save, .btn-confirm-cancel { padding: 10px 20px; border-radius: 30px; font-weight: 600; cursor: pointer; }
    .btn-cancel { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #A0A8C6; }
    .btn-save { background: linear-gradient(135deg, #6C3BD4, #00D9FF); border: none; color: white; }
    .btn-confirm-cancel { background: #EF4444; border: none; color: white; }
    .warning { color: #EF4444; margin-top: 8px; }
    .error-container { text-align: center; padding: 80px; color: #A0A8C6; }
    @media (max-width: 768px) { .info-grid { grid-template-columns: 1fr; } .header { flex-direction: column; align-items: flex-start; } .form-row { grid-template-columns: 1fr; } .actions-group { justify-content: center; } }
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarViagem(parseInt(id));
    }
  }

  // ==================== REGRAS DE PERMISSÃO ====================
  
  podeEditarDados(): boolean {
    // Só pode editar dados se ainda não pagou nada e não está cancelada
    return this.viagem?.status === 'planejando';
  }

  podeEditarPagamento(): boolean {
    // Pode editar pagamento se não está confirmada, cancelada ou concluída
    const status = this.viagem?.status;
    return status !== 'confirmada' && status !== 'cancelada' && status !== 'concluida';
  }

  podeCancelar(): boolean {
    // Pode cancelar se não está cancelada ou concluída
    const status = this.viagem?.status;
    return status !== 'cancelada' && status !== 'concluida';
  }

  // ==================== UTILITÁRIOS ====================
  
  getStatusTexto(status: string): string {
    const statusMap: any = {
      'confirmada': '✅ Confirmada',
      'planejando': '📝 Planejando',
      'reservada': '📅 Reservada',
      'aguardando_pagamento': '⏳ Aguardando pagamento',
      'cancelada': '❌ Cancelada'
    };
    return statusMap[status] || status;
  }

  getFormaPagamentoTexto(forma: string): string {
    const formaMap: any = {
      'pagar_agora': 'Pagamento à vista',
      'sinal': 'Sinal (30%)',
      'parcelar': 'Parcelado',
      'reservar': 'Reserva',
      'pix': 'PIX',
      'cartao': 'Cartão de Crédito',
      'dinheiro': 'Dinheiro',
      'transferencia': 'Transferência Bancária'
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
          this.notificationService.error('Viagem não encontrada');
        }
      },
      error: () => {
        this.notificationService.error('Erro ao carregar viagem');
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
          this.notificationService.success('Viagem atualizada com sucesso!');
          this.fecharModal();
          this.carregarViagem(this.viagemEdit.id);
        } else {
          this.notificationService.error(response.message || 'Erro ao atualizar viagem');
        }
      },
      error: () => {
        this.salvando = false;
        this.notificationService.error('Erro de conexão');
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
      this.notificationService.error('Digite um valor válido');
      return;
    }

    const saldoRestante = (this.viagem.orcamento || 0) - (this.viagem.valor_pago || 0);
    if (this.valorPagamento > saldoRestante) {
      this.notificationService.error('Valor excede o saldo restante');
      return;
    }

    this.salvando = true;
    const novoValorPago = (this.viagem.valor_pago || 0) + this.valorPagamento;
    const novoStatus = novoValorPago >= (this.viagem.orcamento || 0) ? 'confirmada' : 'aguardando_pagamento';

    this.viagemService.atualizarPagamento(this.viagem.id, novoValorPago, this.formaPagamentoSelecionada, novoStatus).subscribe({
      next: (response: any) => {
        this.salvando = false;
        if (response.success) {
          this.notificationService.success('Pagamento adicionado com sucesso!');
          this.fecharModal();
          this.carregarViagem(this.viagem!.id);
        } else {
          this.notificationService.error(response.message || 'Erro ao adicionar pagamento');
        }
      },
      error: () => {
        this.salvando = false;
        this.notificationService.error('Erro de conexão');
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
          this.notificationService.success('Pagamento concluído com sucesso! Viagem confirmada.');
          this.fecharModal();
          this.carregarViagem(this.viagem!.id);
        } else {
          this.notificationService.error(response.message || 'Erro ao concluir pagamento');
        }
      },
      error: () => {
        this.salvando = false;
        this.notificationService.error('Erro de conexão');
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
          this.notificationService.success('Viagem cancelada com sucesso!');
          this.fecharModal();
          this.router.navigate(['/minhas-viagens']);
        } else {
          this.notificationService.error(response.message || 'Erro ao cancelar viagem');
        }
      },
      error: () => {
        this.salvando = false;
        this.notificationService.error('Erro de conexão');
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