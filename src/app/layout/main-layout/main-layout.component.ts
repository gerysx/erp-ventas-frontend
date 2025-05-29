import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  usuarioCorreo = '';
  esAdmin = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Asignar en primera carga
    this.actualizarUsuario();

    // Actualizar también después de cada navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.actualizarUsuario();
    });
  }

  actualizarUsuario() {
    const usuario = this.auth.obtenerUsuario();
    this.usuarioCorreo = usuario?.correo ?? '';
    this.esAdmin = usuario?.rol?.toUpperCase() === 'ADMIN';

    console.log('[Navbar] Rol:', usuario?.rol, '| esAdmin:', this.esAdmin);
    this.cdr.detectChanges(); // Forzar actualización visual
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
