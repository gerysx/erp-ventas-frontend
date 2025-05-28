import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  stock: number;
  proveedorId: number;
}

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private apiUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  crear(p: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, p);
  }

  actualizar(id: number, p: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, p);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
