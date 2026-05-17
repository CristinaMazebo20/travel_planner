import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `...` // mantém o template
})
export class Perfil implements OnInit {
  usuario: any = { nome: '', email: '', telefone: '', pais: '' };
  carregando = true;

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.carregarPerfil();
  }

  carregarPerfil() {
    const user = this.authService.usuario();
    if (user) {
      this.usuario.nome = user.nome;
      this.usuario.email = user.email;
    }
    this.carregando = false;
  }

  onSubmit() {
    this.usuarioService.atualizarPerfil(this.usuario).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.notificationService.success('Perfil atualizado!');
        }
      },
      error: () => this.notificationService.error('Erro ao atualizar')
    });
  }
}