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
        <h1>✈️ {{ i18n.t('planejar.titulo') }}</h1>
        <p>{{ i18n.t('planejar.subtitulo') }}</p>
      </div>

      <div class="form-container">
        <form #viagemForm="ngForm">
          <div class="form-grid">
            <div class="input-group full-width">
              <label>🌍 {{ i18n.t('planejar.destino') }}</label>
              <input type="text" list="destinosList" class="form-control" [(ngModel)]="destinoSelecionadoNome" name="destinoSelecionadoNome" [placeholder]="i18n.t('planejar.destino_placeholder')" (input)="onDestinoChange()" autocomplete="off">
              <datalist id="destinosList">
                <option *ngFor="let destino of destinos" [value]="destino.nome">
                  {{ destino.nome }} - {{ destino.cidade }}, {{ destino.pais }} ({{ destino.preco | number }} Kz)
                </option>
              </datalist>
            </div>

            <div class="input-group">
              <label>📝 {{ i18n.t('planejar.titulo_viagem') }}</label>
              <input type="text" class="form-control" [(ngModel)]="viagem.titulo" name="titulo" [placeholder]="i18n.t('planejar.titulo_placeholder')" required>
            </div>

            <div class="input-group">
              <label>📅 {{ i18n.t('planejar.data_inicio') }}</label>
              <input type="date" class="form-control" [(ngModel)]="viagem.data_inicio" name="data_inicio" required>
            </div>

            <div class="input-group">
              <label>📅 {{ i18n.t('planejar.data_fim') }}</label>
              <input type="date" class="form-control" [(ngModel)]="viagem.data_fim" name="data_fim" required>
            </div>

            <!-- Forma de Pagamento -->
            <div class="input-group full-width">
              <label>💳 {{ i18n.t('planejar.forma_pagamento') }}</label>
              <div class="payment-options">
                <label class="payment-option">
                  <input type="radio" value="pagar_agora" [(ngModel)]="formaPagamento" name="formaPagamento">
                  <span>💰 {{ i18n.t('planejar.pagar_agora') }}</span>
                </label>
                <label class="payment-option">
                  <input type="radio" value="sinal" [(ngModel)]="formaPagamento" name="formaPagamento">
                  <span>📝 {{ i18n.t('planejar.sinal') }}</span>
                </label>
                <label class="payment-option">
                  <input type="radio" value="reservar" [(ngModel)]="formaPagamento" name="formaPagamento">
                  <span>📅 {{ i18n.t('planejar.reservar') }}</span>
                </label>
                <label class="payment-option">
                  <input type="radio" value="parcelar" [(ngModel)]="formaPagamento" name="formaPagamento">
                  <span>📆 {{ i18n.t('planejar.parcelar') }}</span>
                </label>
              </div>
            </div>

            <!-- Parcelamento -->
            <div class="input-group" *ngIf="formaPagamento === 'parcelar'">
              <label>📆 {{ i18n.t('planejar.numero_parcelas') }}</label>
              <select [(ngModel)]="numeroParcelas" class="form-control" name="numeroParcelas">
                <option [value]="3">3x {{ i18n.t('planejar.sem_juros') }}</option>
                <option [value]="6">6x {{ i18n.t('planejar.com_juros_5') }}</option>
                <option [value]="12">12x {{ i18n.t('planejar.com_juros_8') }}</option>
              </select>
              <small>{{ i18n.t('planejar.valor_parcela') }}: {{ calcularValorParcela() | number }} Kz</small>
            </div>
          </div>

          <!-- Resumo do Pagamento -->
          <div class="payment-summary" *ngIf="orcamentoMinimo > 0">
            <h4>💰 {{ i18n.t('planejar.resumo_pagamento') }}</h4>
            <div class="summary-row">
              <span>{{ i18n.t('planejar.valor_total') }}:</span>
              <span>{{ orcamentoMinimo | number }} Kz</span>
            </div>
            <div class="summary-row" *ngIf="formaPagamento === 'sinal'">
              <span>{{ i18n.t('planejar.sinal_valor') }}:</span>
              <span class="highlight">{{ orcamentoMinimo * 0.3 | number }} Kz</span>
            </div>
            <div class="summary-row" *ngIf="formaPagamento === 'sinal'">
              <span>{{ i18n.t('planejar.restante') }}:</span>
              <span>{{ orcamentoMinimo * 0.7 | number }} Kz</span>
            </div>
            <div class="summary-row total" *ngIf="formaPagamento === 'pagar_agora'">
              <span>{{ i18n.t('planejar.total_pagar') }}:</span>
              <span class="total-value">{{ orcamentoMinimo | number }} Kz</span>
            </div>
            <div class="summary-row" *ngIf="formaPagamento === 'reservar'">
              <span>{{ i18n.t('planejar.valor_reserva') }}:</span>
              <span>0 Kz</span>
              <small>{{ i18n.t('planejar.reserva_obs') }}</small>
            </div>
          </div>

          <div class="button-group">
            <button type="button" class="btn-primary" (click)="processarPagamento()" [disabled]="!viagem.destino_id">
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
          <h3>💳 {{ i18n.t('planejar.pagamento_seguro') }}</h3>
          <button class="modal-close" (click)="fecharModal()">×</button>
        </div>
        <div class="modal-body">
          <div class="payment-methods">
            <button class="payment-method" (click)="simularPagamento('cartao')">
              💳 {{ i18n.t('planejar.cartao_credito') }}
            </button>
            <button class="payment-method" (click)="simularPagamento('pix')">
              📱 {{ i18n.t('planejar.pix') }}
            </button>
            <button class="payment-method" (click)="simularPagamento('multicaixa')">
              🏦 {{ i18n.t('planejar.multicaixa') }}
            </button>
          </div>
          
          <div *ngIf="pagamentoSimulado" class="payment-details">
            <div class="success-icon">✅</div>
            <h4>{{ i18n.t('planejar.pagamento_simulado') }}</h4>
            <p><strong>{{ i18n.t('planejar.valor') }}:</strong> {{ valorPagamento | number }} Kz</p>
            <p><strong>{{ i18n.t('planejar.forma') }}:</strong> {{ formaPagamentoSelecionada }}</p>
            <button class="btn-confirm" (click)="confirmarPagamento()">{{ i18n.t('planejar.confirmar_viagem') }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 900px; margin: 0 auto; padding: 40px 24px; }
    .page-header { text-align: center; margin-bottom: 48px; }
    .page-header h1 { font-size: 2rem; margin-bottom: 8px; color: white; }
    .page-header p { color: #A0A8C6; }
    .form-container { background: rgba(17,22,61,0.8); backdrop-filter: blur(10px); border-radius: 24px; padding: 40px; border: 1px solid rgba(0,217,255,0.1); }
    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
    .full-width { grid-column: span 2; }
    .input-group { display: flex; flex-direction: column; gap: 8px; }
    .input-group label { font-size: 0.85rem; color: #00D9FF; font-weight: 500; }
    .form-control { padding: 14px 16px; background: rgba(10,15,46,0.9); border: 1px solid rgba(0,217,255,0.2); border-radius: 12px; color: white; font-size: 1rem; }
    .form-control:focus { outline: none; border-color: #00D9FF; }
    
    .payment-options { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 8px; }
    .payment-option { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 10px 16px; background: rgba(0,217,255,0.05); border-radius: 12px; }
    .payment-option:hover { background: rgba(0,217,255,0.1); }
    
    .payment-summary { margin-top: 24px; padding: 20px; background: rgba(0,217,255,0.05); border-radius: 16px; }
    .payment-summary h4 { margin-bottom: 16px; color: #00D9FF; }
    .summary-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .summary-row.total { border-top: 1px solid rgba(0,217,255,0.3); margin-top: 8px; padding-top: 12px; font-weight: bold; }
    .total-value { color: #00D9FF; font-size: 1.2rem; }
    .highlight { color: #F59E0B; font-weight: bold; }
    
    .button-group { display: flex; gap: 16px; justify-content: flex-end; margin-top: 32px; }
    .btn-primary, .btn-secondary { padding: 14px 32px; border-radius: 30px; font-weight: 600; cursor: pointer; }
    .btn-primary { background: linear-gradient(135deg, #6C3BD4, #00D9FF); border: none; color: white; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-secondary { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #A0A8C6; }
    
    /* Modal */
    .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: #1A1F4E; border-radius: 24px; max-width: 500px; width: 90%; overflow: hidden; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid rgba(0,217,255,0.2); }
    .modal-close { background: none; border: none; color: white; font-size: 24px; cursor: pointer; }
    .modal-body { padding: 24px; }
    .payment-methods { display: flex; flex-direction: column; gap: 12px; }
    .payment-method { padding: 16px; background: rgba(0,217,255,0.1); border: 1px solid rgba(0,217,255,0.2); border-radius: 12px; color: white; cursor: pointer; font-size: 1rem; }
    .payment-method:hover { background: rgba(0,217,255,0.2); }
    .payment-details { text-align: center; margin-top: 24px; }
    .success-icon { font-size: 48px; margin-bottom: 16px; }
    .btn-confirm { margin-top: 20px; padding: 12px 24px; background: #10B981; border: none; border-radius: 30px; color: white; cursor: pointer; }
    
    @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } .full-width { grid-column: span 1; } }
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
      'pagar_agora': '💳 ' + this.i18n.t('planejar.btn_pagar_agora'),
      'sinal': '📝 ' + this.i18n.t('planejar.btn_sinal'),
      'reservar': '📅 ' + this.i18n.t('planejar.btn_reservar'),
      'parcelar': '📆 ' + this.i18n.t('planejar.btn_parcelar')
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
      'cartao': '💳 ' + this.i18n.t('planejar.cartao_credito'),
      'pix': '📱 ' + this.i18n.t('planejar.pix'),
      'multicaixa': '🏦 ' + this.i18n.t('planejar.multicaixa')
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