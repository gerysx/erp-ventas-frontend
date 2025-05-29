import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../../auth/auth.service';
import { EmpleadoService } from './empleado.service'; // Asegúrate que la ruta sea correcta
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule
  ],
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})
export class EmpleadosComponent implements OnInit {
  form!: FormGroup;
  empleados: any[] = [];
  esAdmin = false;
  modoEdicion = false;
  empleadoEditandoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private empleadoService: EmpleadoService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.auth.obtenerRol() === 'ADMIN';

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required]
    });

    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.empleadoService.listar().subscribe(data => {
      this.empleados = data;
    });
  }

  guardarEmpleado() {
    if (this.form.invalid) return;

    const datos = this.form.value;
    const url = `${environment.apiUrl}/api/empleados`;

    if (this.modoEdicion && this.empleadoEditandoId !== null) {
      this.http.put(`${url}/${this.empleadoEditandoId}`, datos).subscribe({
        next: () => {
          this.resetFormulario();
          this.cargarEmpleados();
        },
        error: () => alert('Error al actualizar empleado')
      });
    } else {
      this.http.post(url, datos).subscribe({
        next: () => {
          this.resetFormulario();
          this.cargarEmpleados();
        },
        error: () => alert('Error al crear empleado')
      });
    }
  }

  editar(empleado: any) {
    this.form.patchValue(empleado);
    this.modoEdicion = true;
    this.empleadoEditandoId = empleado.id;
  }

  eliminar(id: number) {
    const url = `${environment.apiUrl}/api/empleados/${id}`;
    if (!confirm('¿Eliminar empleado?')) return;

    this.http.delete(url).subscribe({
      next: () => this.cargarEmpleados(),
      error: () => alert('Error al eliminar empleado')
    });
  }

  resetFormulario() {
    this.form.reset();
    this.modoEdicion = false;
    this.empleadoEditandoId = null;
  }
}
