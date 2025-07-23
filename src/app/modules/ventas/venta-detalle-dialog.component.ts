import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-venta-detalle-dialog',
  templateUrl: './venta-detalle-dialog.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class VentaDetalleDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<VentaDetalleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // { ventas: VentasPorProductoResponse }
  ) {}

  cerrar() {
    this.dialogRef.close();
  }

  getTotal(detalles: any[]) {
    return detalles.reduce((sum, d) => sum + d.cantidad * parseFloat(d.precioUnitario), 0);
  }
}
