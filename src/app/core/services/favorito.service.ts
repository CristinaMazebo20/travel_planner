import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritoService {
  constructor(private api: ApiService) {}

  listar(utilizadorId: number): Observable<any> {
    return this.api.get(`favoritos.php?utilizador_id=${utilizadorId}`);
  }

  adicionar(utilizadorId: number, destinoId: number): Observable<any> {
    return this.api.post('favoritos.php', { utilizador_id: utilizadorId, destino_id: destinoId });
  }

  remover(utilizadorId: number, destinoId: number): Observable<any> {
    return this.api.delete(`favoritos.php?utilizador_id=${utilizadorId}&destino_id=${destinoId}`);
  }
}