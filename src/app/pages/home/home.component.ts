import { Component } from "@angular/core";

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <div class="p-4">
      <h2>Bienvenido al ERP de Ventas</h2>
      <p>Selecciona una opción del menú lateral para comenzar.</p>
    </div>
  `
})
export class HomeComponent {}
