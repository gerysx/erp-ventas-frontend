import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  enviar(): void {
    if (this.form.invalid) return;

    this.auth.login(this.form.value).subscribe({
      next: (res: { token: string }) => {
        this.auth.guardarToken(res.token);

        const rol = this.auth.obtenerRol()?.toUpperCase(); // aseguramos mayúsculas
        if (rol === 'ADMIN') {
          this.router.navigate(['/proveedores']);
        } else {
          this.router.navigate(['/productos']);
        }
      },
      error: () => {
        alert('Credenciales inválidas');
      }
    });
  }
}
