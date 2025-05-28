import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';

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
    private http: HttpClient,
    private auth: AuthService
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
    this.http.get<any[]>('http://localhost:3000/api/empleados').subscribe(data => {
      this.empleados = data;
    });
  }

  guardarEmpleado() {
    if (this.form.invalid) return;

    const datos = this.form.value;

    if (this.modoEdicion && this.empleadoEditandoId !== null) {
      this.http.put(`http://localhost:3000/api/empleados/${this.empleadoEditandoId}`, datos).subscribe({
        next: () => {
          this.resetFormulario();
          this.cargarEmpleados();
        },
        error: () => alert('Error al actualizar empleado')
      });
    } else {
      this.http.post('http://localhost:3000/api/empleados', datos).subscribe({
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
    if (!confirm('¿Eliminar empleado?')) return;

    this.http.delete(`http://localhost:3000/api/empleados/${id}`).subscribe({
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
