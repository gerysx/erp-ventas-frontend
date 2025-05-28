
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  usuarioCorreo = '';
  esAdmin = false;

  constructor(private auth: AuthService, private router: Router) {
    const usuario = this.auth.obtenerUsuario();
    this.usuarioCorreo = usuario?.correo ?? '';
    this.esAdmin = usuario?.rol === 'ADMIN';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
