import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../auth/auth.service';
import { ProveedorService, Proveedor } from './proveedor.service'; // Nuevo servicio

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
  proveedores: Proveedor[] = [];
  esAdmin = false;
  modoEdicion = false;
  proveedorEditandoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private proveedorService: ProveedorService
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.auth.esAdmin();

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      contacto: ['']
    });

    this.cargarProveedores();
  }

  cargarProveedores() {
    this.proveedorService.listar().subscribe(data => {
      this.proveedores = data;
    });
  }

  guardarProveedor() {
    if (this.form.invalid) return;

    const proveedor = this.form.value;

    if (this.modoEdicion && this.proveedorEditandoId !== null) {
      this.proveedorService.actualizar(this.proveedorEditandoId, proveedor).subscribe({
        next: () => {
          this.resetFormulario();
          this.cargarProveedores();
        },
        error: () => alert('Error al actualizar proveedor')
      });
    } else {
      this.proveedorService.crear(proveedor).subscribe({
        next: () => {
          this.resetFormulario();
          this.cargarProveedores();
        },
        error: () => alert('Error al crear proveedor')
      });
    }
  }

  editar(proveedor: Proveedor) {
    this.form.patchValue(proveedor);
    this.modoEdicion = true;
    this.proveedorEditandoId = proveedor.id ?? null;
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar proveedor?')) return;

    this.proveedorService.eliminar(id).subscribe({
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
