import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatSelectModule,
    MatTableModule
  ],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  form!: FormGroup;
  productos: any[] = [];
  proveedores: any[] = [];
  esAdmin = false;
  modoEdicion = false;
  productoEditandoId: number | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    this.esAdmin = this.auth.obtenerRol() === 'ADMIN';

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      stock: ['', Validators.required],
      proveedorId: ['', Validators.required]
    });

    this.cargarProductos();
    this.cargarProveedores();
  }

 cargarProductos() {
  this.http.get<any[]>('http://localhost:3000/api/productos').subscribe(productos => {
    this.productos = productos.map(p => {
      const proveedor = this.proveedores.find(prov => prov.id === p.proveedorId);
      return {
        ...p,
        proveedorNombre: proveedor ? proveedor.nombre : 'Desconocido'
      };
    });
  });
}

cargarProveedores() {
  this.http.get<any[]>('http://localhost:3000/api/proveedores').subscribe(data => {
    this.proveedores = data;
    this.cargarProductos(); // Asegura que los productos se carguen una vez tengamos proveedores
  });
}
  guardarProducto() {
    if (this.form.invalid) return;

    const producto = this.form.value;

    if (this.modoEdicion && this.productoEditandoId !== null) {
      this.http.put(`http://localhost:3000/api/productos/${this.productoEditandoId}`, producto).subscribe({
        next: () => {
          this.resetFormulario();
          this.cargarProductos();
        },
        error: () => alert('Error al actualizar producto')
      });
    } else {
      this.http.post('http://localhost:3000/api/productos', producto).subscribe({
        next: () => {
          this.resetFormulario();
          this.cargarProductos();
        },
        error: () => alert('Error al crear producto')
      });
    }
  }

  editar(producto: any) {
    this.form.patchValue(producto);
    this.modoEdicion = true;
    this.productoEditandoId = producto.id;
  }

  eliminar(id: number) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    this.http.delete(`http://localhost:3000/api/productos/${id}`).subscribe({
      next: () => this.cargarProductos(),
      error: () => alert('Error al eliminar producto')
    });
  }

  resetFormulario() {
    this.form.reset();
    this.modoEdicion = false;
    this.productoEditandoId = null;
  }
}
