import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Destino {
  id: number;
  nome: string;
  pais: string;
  cidade: string;
  descricao: string;
  imagem: string;
  preco: number;
  avaliacao: number;
  lat?: number;
  lng?: number;
  popularidade?: number;
  atracoes?: string[];
  melhorEpoca?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DestinoService {
  constructor(private api: ApiService) {}

  listar(): Observable<any> {
    return this.api.get('destinos.php');
  }

  buscar(id: number): Observable<any> {
    return this.api.get(`destinos.php?id=${id}`);
  }

  criar(destino: Destino): Observable<any> {
    return this.api.post('destinos.php', destino);
  }

  atualizar(destino: Destino): Observable<any> {
    return this.api.put('destinos.php', destino);
  }

  deletar(id: number): Observable<any> {
    return this.api.delete(`destinos.php?id=${id}`);
  }
}