import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService, Usuario } from '../../../../core/services/usuario.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-gestao-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `...` // mantém o template
})
export class GestaoUsuarios implements OnInit {
  usuarios: Usuario[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.usuarioService.listar().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.usuarios = response.data;
        }
      },
      error: () => this.notificationService.error('Erro ao carregar usuários')
    });
  }

  excluir(id: number) {
    if (confirm('Tem certeza?')) {
      this.usuarioService.deletar(id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.notificationService.success('Usuário excluído!');
            this.carregarUsuarios();
          }
        },
        error: () => this.notificationService.error('Erro ao excluir')
      });
    }
  }
}