import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Cliente {
  id?: number;
  nombre: string;
  correo: string;
  telefono: string;
}

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private apiUrl = `${environment.apiUrl}/api/clientes`;


  constructor(private http: HttpClient) {}

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  crear(c: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, c);
  }

  actualizar(id: number, c: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, c);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

