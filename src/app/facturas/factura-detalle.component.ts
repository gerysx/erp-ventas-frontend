import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FacturaService } from './factura.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './factura-detalle.component.html',
  styleUrls: ['./factura-list.component.scss']
})
export class FacturaDetalleComponent implements OnInit {
  factura: any;

  constructor(
    private route: ActivatedRoute,
    private facturaService: FacturaService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.facturaService.obtener(id).subscribe(res => this.factura = res);
  }

  descargarPDF() {
    this.facturaService.descargarPDF(this.factura.id).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura_${this.factura.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  getTotal(): number {
  if (!this.factura || !this.factura.detalles) return 0;
  return this.factura.detalles.reduce(
    (sum: number, d: any) => sum + (d.cantidad * parseFloat(d.precioUnitario)),
    0
  );
}

}
