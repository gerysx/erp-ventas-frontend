import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DetalleFactura {
  producto: any;
  cantidad: number;
  precioUnitario: number;
}

@Injectable({ providedIn: 'root' })
export class FacturaService {
  private baseUrl = `${environment.apiUrl}/api/facturas`;

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  obtener(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  crear(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  descargarPDF(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/pdf`, {
      responseType: 'blob'
    });
  }

  listarVentas(clienteId: string = '', empleadoId: string = ''): Observable<any[]> {
    const params = [];
    if (clienteId) params.push(`clienteId=${clienteId}`);
    if (empleadoId) params.push(`empleadoId=${empleadoId}`);
    const queryString = params.length ? '?' + params.join('&') : '';
    return this.http.get<any[]>(`${this.baseUrl}/ventas${queryString}`);
  }

  ventasPorProducto(productoId: number): Observable<DetalleFactura[]> {
    return this.http.get<DetalleFactura[]>(`${this.baseUrl}/ventas/producto/${productoId}`);
  }
}
