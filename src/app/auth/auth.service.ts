
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
  private usuario: JwtPayload | null = null;

  constructor(private http: HttpClient) {
    const token = this.obtenerToken();
    if (token) {
      try {
        this.usuario = jwtDecode<JwtPayload>(token);
      } catch {
        this.usuario = null;
      }
    }
  }

  login(datos: {
    correo: string;
    password: string;
  }): Observable<{ token: string }> {
    console.log('URL usada para login:', environment.apiUrl + '/api/auth/login');

    return this.http.post<{ token: string }>(
      `${environment.apiUrl}/api/auth/login`,
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

  get token(): string | null {
    return this.obtenerToken();
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
