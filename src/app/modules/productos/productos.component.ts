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
import { ProductoService, Producto } from './producto.service';
import { ProveedorService, Proveedor } from '../proveedores/proveedor.service';

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
  productos: Producto[] = [];
  proveedores: Proveedor[] = [];
  esAdmin = false;
  modoEdicion = false;
  productoEditandoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private productoService: ProductoService,
    private proveedorService: ProveedorService
  ) {}

  ngOnInit(): void {
    this.esAdmin = this.auth.esAdmin();

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      stock: ['', Validators.required],
      proveedorId: ['', Validators.required]
    });

    this.cargarProveedores();
  }

  cargarProductos() {
    this.productoService.listar().subscribe(productos => {
      this.productos = productos.map(p => ({
        ...p,
        proveedorNombre: this.proveedores.find(prov => prov.id === p.proveedorId)?.nombre || 'Desconocido'
      }));
    });
  }

  cargarProveedores() {
    this.proveedorService.listar().subscribe(proveedores => {
      this.proveedores = proveedores;
      this.cargarProductos(); // solo cargar productos después de tener los proveedores
    });
  }

  guardarProducto() {
    if (this.form.invalid) return;

    const producto = this.form.value;

    if (this.modoEdicion && this.productoEditandoId !== null) {
      this.productoService.actualizar(this.productoEditandoId, producto).subscribe({
        next: () => {
          this.resetFormulario();
          this.cargarProductos();
        },
        error: () => alert('Error al actualizar producto')
      });
    } else {
      this.productoService.crear(producto).subscribe({
        next: () => {
          this.resetFormulario();
          this.cargarProductos();
        },
        error: () => alert('Error al crear producto')
      });
    }
  }

  editar(producto: Producto) {
    this.form.patchValue(producto);
    this.modoEdicion = true;
    this.productoEditandoId = producto.id || null;
  }

  eliminar(id: number) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    this.productoService.eliminar(id).subscribe({
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
