import { Component, OnInit } from '@angular/core';
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

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
  const usuario = this.auth.obtenerUsuario();
  this.usuarioCorreo = usuario?.correo ?? '';
  console.log('[DEBUG] usuario.rol:', usuario?.rol);

  this.esAdmin = usuario?.rol?.toUpperCase() === 'ADMIN';
  console.log('[DEBUG] esAdmin:', this.esAdmin);
}


  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
