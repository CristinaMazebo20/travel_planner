// core/services/usuario.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
  telefone?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(private api: ApiService) {}

  listar(): Observable<any> {
    return this.api.get('utilizadores.php');
  }

  buscar(id: number): Observable<any> {
    return this.api.get(`utilizadores.php?id=${id}`);
  }

  atualizarTipo(id: number, tipo: string): Observable<any> {
    return this.api.put('utilizadores.php', { id, tipo });
  }

  deletar(id: number): Observable<any> {
    return this.api.delete(`utilizadores.php?id=${id}`);
  }

  buscarPerfil(): Observable<any> {
    return this.api.get('perfil.php');
  }

  atualizarPerfil(dados: any): Observable<any> {
    return this.api.put('perfil.php', dados);
  }
}