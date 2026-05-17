import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DestinoService, Destino } from '../../../../core/services/destino.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-gestao-destinos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `...` // mantém o template
})
export class GestaoDestinos implements OnInit {
  destinos: Destino[] = [];
  destinoForm: Destino = { id: 0, nome: '', pais: '', cidade: '', descricao: '', imagem: '', preco: 0, avaliacao: 0 };
  editando = false;

  constructor(
    private destinoService: DestinoService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.carregarDestinos();
  }

  carregarDestinos() {
    this.destinoService.listar().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.destinos = response.data;
        }
      },
      error: () => this.notificationService.error('Erro ao carregar destinos')
    });
  }

  salvar() {
    if (this.editando) {
      this.destinoService.atualizar(this.destinoForm).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.notificationService.success('Destino atualizado!');
            this.carregarDestinos();
            this.cancelar();
          }
        },
        error: () => this.notificationService.error('Erro ao atualizar')
      });
    } else {
      this.destinoService.criar(this.destinoForm).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.notificationService.success('Destino criado!');
            this.carregarDestinos();
            this.cancelar();
          }
        },
        error: () => this.notificationService.error('Erro ao criar')
      });
    }
  }

  editar(destino: Destino) {
    this.destinoForm = { ...destino };
    this.editando = true;
  }

  excluir(id: number) {
    if (confirm('Tem certeza?')) {
      this.destinoService.deletar(id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.notificationService.success('Destino excluído!');
            this.carregarDestinos();
          }
        },
        error: () => this.notificationService.error('Erro ao excluir')
      });
    }
  }

  cancelar() {
    this.destinoForm = { id: 0, nome: '', pais: '', cidade: '', descricao: '', imagem: '', preco: 0, avaliacao: 0 };
    this.editando = false;
  }
}