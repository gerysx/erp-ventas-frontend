import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<any[]>(`${environment.apiUrl}/api/empleados`);
  }
}
