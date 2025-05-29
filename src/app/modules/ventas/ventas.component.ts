import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductoService, Producto } from '../productos/producto.service';
import { FacturaService, DetalleFactura } from '../../facturas/factura.service';
import { VentaDetalleDialogComponent } from './venta-detalle-dialog.component';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatCardModule,
    MatDialogModule,
  ],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
  productos: Producto[] = [];
  productoSeleccionado: number | null = null;
  ventasProducto: DetalleFactura[] = [];

  displayedColumns: string[] = [
    'nombre',
    'precio',
    'stock',
    'descripcion',
    'proveedorId',
    'createdAt',
    'updatedAt',
    'acciones'
  ];

  constructor(
    private productoService: ProductoService,
    private facturaService: FacturaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.productoService.listar().subscribe(productos => {
      this.productos = productos;
    });
  }

  buscarVentasPorProducto() {
    if (!this.productoSeleccionado) {
      this.ventasProducto = [];
      return;
    }

    this.facturaService.ventasPorProducto(this.productoSeleccionado).subscribe(data => {
      this.ventasProducto = data;
    });
  }

  verDetalle(productoId: number) {
    this.facturaService.ventasPorProducto(productoId).subscribe((detalles) => {
      const producto = detalles[0]?.producto || {};

      const facturaMock = {
        id: productoId,
        fecha: new Date(),
        cliente: null,
        empleado: null,
        detalles: detalles.map(d => ({
          producto: d.producto,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario
        }))
      };

      this.dialog.open(VentaDetalleDialogComponent, {
        width: '600px',
        data: { factura: facturaMock }
      });
    });
  }
}
