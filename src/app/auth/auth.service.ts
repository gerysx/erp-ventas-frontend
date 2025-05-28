// src/app/core/auth/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

interface JwtPayload {
  id: number;
  rol: string;
  correo: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuario!: JwtPayload | null;

  constructor(private http: HttpClient) {}

  login(datos: { correo: string; password: string }): Observable<{ token: string }> {
  return this.http.post<{ token: string }>(
    `${environment.apiUrl}/auth/login`,
    datos
  );
}

  guardarToken(token: string) {
    localStorage.setItem('token', token);
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      this.usuario = decoded;
    } catch {
      this.usuario = null;
    }
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  obtenerRol(): string | null {
    if (this.usuario) return this.usuario.rol;

    const token = this.obtenerToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      this.usuario = decoded;
      return decoded.rol;
    } catch {
      return null;
    }
  }

  obtenerUsuario(): JwtPayload | null {
    if (this.usuario) return this.usuario;

    const token = this.obtenerToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      this.usuario = decoded;
      return decoded;
    } catch {
      return null;
    }
  }

  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }

  esAdmin(): boolean {
  return this.obtenerRol()?.toUpperCase() === 'ADMIN';
}

  logout() {
    localStorage.removeItem('token');
    this.usuario = null;
  }
}
