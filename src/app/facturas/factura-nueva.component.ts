import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { FacturaService } from './factura.service';
import { ClienteService } from '../modules/clientes/cliente.service';
import { ProductoService } from '../modules/productos/producto.service';
import { EmpleadoService } from '../modules/empleados/empleado.service';

@Component({
  selector: 'app-factura-nueva',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './factura-nueva.component.html',
  styleUrls: ['./factura-list.component.scss']
})
export class FacturaNuevaComponent implements OnInit {
  form: FormGroup;
  empleados: any[] = [];
  clientes: any[] = [];
  productos: any[] = [];
  detalles: any[] = [];
  descuento: number = 0;
  descuentoInvalido: boolean = false;

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private empleadoService: EmpleadoService,
    private router: Router
  ) {
    this.form = this.fb.group({
      empleadoId: ['', Validators.required],
      clienteId: ['', Validators.required],
      fecha: [new Date().toISOString().slice(0, 10), Validators.required]
    });
  }

  ngOnInit(): void {
    this.empleadoService.listar().subscribe(e => this.empleados = e);
    this.clienteService.listar().subscribe(c => this.clientes = c);
    this.productoService.listar().subscribe(p => this.productos = p);
  }

  agregarDetalle() {
    this.detalles.push({ productoId: '', cantidad: 1, precioUnitario: 0 });
  }

  eliminarDetalle(index: number) {
    this.detalles.splice(index, 1);
  }

  actualizarPrecio(index: number) {
    const productoSeleccionado = this.productos.find(p => p.id === this.detalles[index].productoId);
    if (productoSeleccionado) {
      this.detalles[index].precioUnitario = productoSeleccionado.precio;
    }
  }

  calcularTotalProducto(d: any): number {
    return +(d.cantidad * d.precioUnitario).toFixed(2);
  }

  calcularTotalGeneral(): number {
    return +this.detalles.reduce((total, d) => total + this.calcularTotalProducto(d), 0).toFixed(2);
  }

  calcularTotalConDescuento(): number {
    const total = this.calcularTotalGeneral();
    const descuentoAplicado = Math.min(Math.max(this.descuento, 0), 100);
    return +(total * (1 - descuentoAplicado / 100)).toFixed(2);
  }

  validarDescuento(): void {
    this.descuentoInvalido = this.descuento < 0 || this.descuento > 100;
  }

  guardar() {
  this.validarDescuento();

  if (this.descuentoInvalido) {
    alert('El descuento debe estar entre 0 y 100');
    return;
  }

  for (let d of this.detalles) {
    if (!d.productoId || d.cantidad <= 0 || d.precioUnitario <= 0) {
      alert('Completa todos los campos de cada producto con valores válidos');
      return;
    }
  }

  const factura = {
    empleadoId: this.form.value.empleadoId,
    clienteId: this.form.value.clienteId,
    fecha: this.form.value.fecha,
    descuento: this.descuento,
    total: this.calcularTotalConDescuento(),
    detalles: this.detalles
  };

  this.facturaService.crear(factura).subscribe({
    next: () => {
      this.router.navigate(['/facturas']);
      this.descuento = 0;         // ✅ Reset descuento
      this.descuentoInvalido = false;
      this.detalles = [];         // ✅ Limpiar detalles
      this.form.reset({
        empleadoId: '',
        clienteId: '',
        fecha: new Date().toISOString().slice(0, 10)
      });
    },
    error: err => alert(err.error?.mensaje || 'Error al crear factura')
  });
}
}
