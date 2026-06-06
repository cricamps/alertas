import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <span class="cruz">✚</span> SaludAlerta
      </div>
      <ul class="navbar-links">
        <li><a routerLink="/dashboard" routerLinkActive="active">🏠 Inicio</a></li>
        <li><a routerLink="/pacientes" routerLinkActive="active">👥 Pacientes</a></li>
        <li><a routerLink="/senales" routerLinkActive="active">💓 Señales Vitales</a></li>
        <li><a routerLink="/alertas" routerLinkActive="active">🚨 Alertas</a></li>
      </ul>
      <div class="navbar-user">
        <span class="user-name">{{ userName }}</span>
        <button class="btn-logout" (click)="logout()">Cerrar sesión</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { display: flex; align-items: center; justify-content: space-between; background: #1a3a5c; color: white; padding: 0 2rem; height: 60px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
    .navbar-brand { font-size: 1.4rem; font-weight: bold; display: flex; align-items: center; gap: 0.5rem; }
    .cruz { color: #e74c3c; font-size: 1.6rem; }
    .navbar-links { display: flex; gap: 1.5rem; list-style: none; margin: 0; padding: 0; }
    .navbar-links a { color: #cce0f5; text-decoration: none; font-size: 0.92rem; padding: 4px 10px; border-radius: 4px; transition: background 0.2s; }
    .navbar-links a:hover, .navbar-links a.active { background: #2980b9; color: white; }
    .navbar-user { display: flex; align-items: center; gap: 1rem; }
    .user-name { font-size: 0.88rem; color: #cce0f5; }
    .btn-logout { background: #e74c3c; color: white; border: none; padding: 6px 14px; border-radius: 4px; cursor: pointer; font-size: 0.85rem; }
    .btn-logout:hover { background: #c0392b; }
  `]
})
export class NavbarComponent {
  get userName(): string {
    try {
      const accounts = (window as any).msalInstance?.getAllAccounts?.() || [];
      if (accounts.length > 0) return accounts[0].name || accounts[0].username;
    } catch {}
    try {
      const keys = Object.keys(localStorage);
      for (const k of keys) {
        if (k.includes('idtoken') || k.includes('id_token')) {
          const payload = JSON.parse(atob(localStorage.getItem(k)!.split('.')[1]));
          return payload.name || payload.given_name || payload.emails?.[0] || 'Usuario';
        }
      }
    } catch {}
    return 'Usuario';
  }

  constructor(private msalService: MsalService) {}

  logout(): void { this.msalService.logoutRedirect(); }
}
