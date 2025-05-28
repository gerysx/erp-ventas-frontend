import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { roleGuard } from './auth/role.guards';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'ventas', pathMatch: 'full' },

      {
        path: 'productos',
        loadComponent: () =>
          import('./modules/productos/productos.component').then(
            (m) => m.ProductosComponent
          ),
      },
      {
        path: 'facturas',
        canActivate: [roleGuard(['ADMIN'])],
        loadChildren: () =>
          import('./facturas/factura.routes').then((m) => m.FACTURA_ROUTES),
      },

      {
        path: 'clientes',
        loadComponent: () =>
          import('./modules/clientes/clientes.component').then(
            (m) => m.ClientesComponent
          ),
      },
      {
        path: 'proveedores',
        canActivate: [roleGuard(['ADMIN'])],
        loadComponent: () =>
          import('./modules/proveedores/proveedores.component').then(
            (m) => m.ProveedoresComponent
          ),
      },
      {
        path: 'empleados',
        canActivate: [roleGuard(['ADMIN'])],
        loadComponent: () =>
          import('./modules/empleados/empleados.component').then(
            (m) => m.EmpleadosComponent
          ),
      },
      {
        path: 'ventas',
        loadComponent: () =>
          import('./modules/ventas/ventas.component').then(
            (m) => m.VentasComponent
          ),
      },
      {
        path: 'usuarios',
        canActivate: [roleGuard(['ADMIN'])],
        loadComponent: () =>
          import('./modules/usuarios/usuarios.component').then(
            (m) => m.UsuariosComponent
          ),
      },
    ],
  },
];
