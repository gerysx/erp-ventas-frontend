import { Routes } from '@angular/router';
import { FacturaListComponent } from './factura-list.component';
import { FacturaNuevaComponent } from './factura-nueva.component';
import { FacturaDetalleComponent } from './factura-detalle.component';

export const FACTURA_ROUTES: Routes = [
  { path: '', component: FacturaListComponent },
  { path: 'nueva', component: FacturaNuevaComponent },
  { path: ':id', component: FacturaDetalleComponent }
];
