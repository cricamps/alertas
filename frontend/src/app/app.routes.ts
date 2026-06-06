import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [MsalGuard]
  },
  {
    path: 'pacientes',
    loadComponent: () => import('./components/pacientes/pacientes.component').then(m => m.PacientesComponent),
    canActivate: [MsalGuard]
  },
  {
    path: 'senales',
    loadComponent: () => import('./components/senales/senales.component').then(m => m.SenalesComponent),
    canActivate: [MsalGuard]
  },
  {
    path: 'alertas',
    loadComponent: () => import('./components/alertas/alertas.component').then(m => m.AlertasComponent),
    canActivate: [MsalGuard]
  }
];
