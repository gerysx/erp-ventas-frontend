import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturaService } from './factura.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-factura-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, RouterModule],
  templateUrl: './factura-list.component.html',
  styleUrls: ['./factura-list.component.scss']
})
export class FacturaListComponent implements OnInit {
  displayedColumns = ['id', 'fecha', 'cliente', 'empleado', 'acciones'];
  facturas: any[] = [];

  constructor(private facturaService: FacturaService) {}

  ngOnInit() {
    this.facturaService.listar().subscribe(res => this.facturas = res);
  }

  descargarPDF(id: number) {
    this.facturaService.descargarPDF(id).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura_${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}
