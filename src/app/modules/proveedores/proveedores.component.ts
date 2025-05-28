import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../auth/auth.service';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-proveedores',
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
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent implements OnInit {
  form!: FormGroup;
  proveedores: any[] = [];
  esAdmin = false;
  modoEdicion = false;
  proveedorEditandoId: number | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    this.esAdmin = this.auth.obtenerRol() === 'ADMIN';

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      contacto: ['']  // <--- Campo opcional
    });

    this.cargarProveedores();
  }

  cargarProveedores() {
    this.http.get<any[]>('http://localhost:3000/api/proveedores').subscribe(data => {
      this.proveedores = data;
    });
  }

  guardarProveedor() {
    if (this.form.invalid) return;

    const proveedor = this.form.value;

    if (this.modoEdicion && this.proveedorEditandoId !== null) {
      this.http.put(`http://localhost:3000/api/proveedores/${this.proveedorEditandoId}`, proveedor).subscribe({
        next: () => {
          this.resetFormulario();
          this.cargarProveedores();
        },
        error: () => alert('Error al actualizar proveedor')
      });
    } else {
      this.http.post('http://localhost:3000/api/proveedores', proveedor).subscribe({
        next: () => {
          this.resetFormulario();
          this.cargarProveedores();
        },
        error: () => alert('Error al crear proveedor')
      });
    }
  }

  editar(proveedor: any) {
    this.form.patchValue(proveedor);
    this.modoEdicion = true;
    this.proveedorEditandoId = proveedor.id;
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar proveedor?')) return;

    this.http.delete(`http://localhost:3000/api/proveedores/${id}`).subscribe({
      next: () => this.cargarProveedores(),
      error: () => alert('Error al eliminar proveedor')
    });
  }

  resetFormulario() {
    this.form.reset();
    this.modoEdicion = false;
    this.proveedorEditandoId = null;
  }
}
