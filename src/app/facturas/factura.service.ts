import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// ✅ Interfaces tipadas
export interface Producto {
  id: number;
  nombre: string;
  precio: string; // viene como string desde backend
  stock: number;
  descripcion: string | null;
  proveedorId: number;
  createdat: string;
  updatedat: string;
}

export interface DetalleFactura {
  id: number;
  cantidad: number;
  precioUnitario: string; // también viene como string
  facturaId: number;
  productoId: number;
  createdat: string;
  updatedat: string;
  producto: Producto;
}

export interface Factura {
  id: number;
  fecha: string;
  cliente: { id: number; nombre: string } | null;
  empleado: { id: number; nombre: string } | null;
  detalles?: DetalleFactura[];
  total?: number; // opcional porque lo calculamos a veces en el backend
}

export interface VentasPorProductoResponse {
  producto: Producto | null;
  totalCantidad: number;
  totalVentas: number;
  detalles: DetalleFactura[];
}

@Injectable({ providedIn: 'root' })
export class FacturaService {
  private baseUrl = `${environment.apiUrl}/api/facturas`;

  constructor(private http: HttpClient) {}

  //  Lista todas las facturas
  listar(): Observable<Factura[]> {
    return this.http.get<Factura[]>(this.baseUrl);
  }

  //  Obtiene factura con detalles
  obtener(id: number): Observable<Factura> {
    return this.http.get<Factura>(`${this.baseUrl}/${id}`);
  }

  //  Crear factura
  crear(data: any): Observable<{ mensaje: string; id: number }> {
    return this.http.post<{ mensaje: string; id: number }>(this.baseUrl, data);
  }

  //  Descargar PDF
  descargarPDF(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/pdf`, {
      responseType: 'blob'
    });
  }

  //  Listar ventas filtradas por cliente o empleado
  listarVentas(clienteId: string = '', empleadoId: string = ''): Observable<any[]> {
    const params = [];
    if (clienteId) params.push(`clienteId=${clienteId}`);
    if (empleadoId) params.push(`empleadoId=${empleadoId}`);
    const queryString = params.length ? '?' + params.join('&') : '';
    return this.http.get<any[]>(`${this.baseUrl}/ventas${queryString}`);
  }

  //  Ventas por producto (detalle + totales)
  ventasPorProducto(productoId: number): Observable<VentasPorProductoResponse> {
    return this.http.get<VentasPorProductoResponse>(
      `${this.baseUrl}/ventas/producto/${productoId}`
    );
  }
}
