import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PacienteService, AlertaService } from '../../services/medicas.service';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <div class="bienvenida" *ngIf="userName">
        <span class="saludo">👋 Bienvenido, <strong>{{ userName }}</strong></span>
        <span class="fecha">{{ fechaHoy }}</span>
      </div>

      <h1>🏥 Inicio — Sistema de Alertas Médicas</h1>

      <div class="cards">
        <div class="card card-blue">
          <div class="card-icon">👥</div>
          <div class="card-info">
            <span class="card-number">{{ totalPacientes }}</span>
            <span class="card-label">Pacientes Registrados</span>
          </div>
        </div>
        <div class="card card-red">
          <div class="card-icon">🚨</div>
          <div class="card-info">
            <span class="card-number">{{ alertasPendientes }}</span>
            <span class="card-label">Alertas Pendientes</span>
          </div>
        </div>
        <div class="card card-green">
          <div class="card-icon">✅</div>
          <div class="card-info">
            <span class="card-number">{{ alertasAtendidas }}</span>
            <span class="card-label">Alertas Atendidas</span>
          </div>
        </div>
      </div>

      <!-- Perfil usuario -->
      <div class="perfil-card" *ngIf="userName">
        <h2>👤 Mi Perfil</h2>
        <div class="perfil-info">
          <div class="perfil-avatar">{{ iniciales }}</div>
          <div class="perfil-datos">
            <p><strong>Nombre:</strong> {{ userName }}</p>
            <p><strong>Correo:</strong> {{ userEmail }}</p>
            <p><strong>Rol:</strong> Personal médico</p>
            <p><strong>Sesión iniciada:</strong> {{ fechaHoy }}</p>
          </div>
        </div>
      </div>

      <div class="alertas-recientes">
        <h2>🔴 Alertas Críticas Pendientes</h2>
        <table *ngIf="alertasCriticas.length > 0; else noAlertas">
          <thead>
            <tr><th>Paciente</th><th>Tipo</th><th>Nivel</th><th>Descripción</th><th>Fecha</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of alertasCriticas" >
              <td>{{ a.paciente?.nombre || 'ID: ' + a.paciente.id }}</td>
              <td>{{ a.tipoAlerta }}</td>
              <td><span class="badge" [class]="'badge-' + a.nivel.toLowerCase()">{{ a.nivel }}</span></td>
              <td>{{ a.descripcion }}</td>
              <td>{{ a.fechaAlerta | date:'dd/MM HH:mm' }}</td>
            </tr>
          </tbody>
        </table>
        <ng-template #noAlertas>
          <p class="no-data">✅ Sin alertas críticas pendientes</p>
        </ng-template>
      </div>

      <div class="accesos-rapidos">
        <h2>Accesos Rápidos</h2>
        <div class="botones">
          <a routerLink="/pacientes" class="btn btn-blue">👥 Ver Pacientes</a>
          <a routerLink="/senales" class="btn btn-teal">💓 Señales Vitales</a>
          <a routerLink="/alertas" class="btn btn-red">🚨 Ver Alertas</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 2rem; max-width: 1100px; margin: 0 auto; }
    .bienvenida { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; color: #34495e; font-size: 0.95rem; }
    .saludo strong { color: #1a3a5c; }
    h1 { color: #1a3a5c; margin-bottom: 2rem; }
    h2 { color: #1a3a5c; margin: 2rem 0 1rem; }
    .cards { display: flex; gap: 1.5rem; flex-wrap: wrap; }
    .card { display: flex; align-items: center; gap: 1rem; padding: 1.5rem 2rem; border-radius: 10px; flex: 1; min-width: 200px; color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .card-blue  { background: linear-gradient(135deg, #2980b9, #1a5276); }
    .card-red   { background: linear-gradient(135deg, #e74c3c, #922b21); }
    .card-green { background: linear-gradient(135deg, #27ae60, #1e8449); }
    .card-icon { font-size: 2.5rem; }
    .card-number { font-size: 2rem; font-weight: bold; display: block; }
    .card-label { font-size: 0.9rem; opacity: 0.9; }
    .perfil-card { background: white; border-radius: 10px; padding: 1.5rem; margin-top: 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
    .perfil-info { display: flex; align-items: center; gap: 2rem; }
    .perfil-avatar { width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, #2980b9, #1a5276); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: bold; flex-shrink: 0; }
    .perfil-datos p { margin: 6px 0; font-size: 0.92rem; color: #34495e; }
    .perfil-datos strong { color: #1a3a5c; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    th { background: #1a3a5c; color: white; padding: 10px 14px; text-align: left; font-size: 0.9rem; }
    td { padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 0.9rem; }
    tr:hover td { background: #f0f7ff; }
    .badge { padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; }
    .badge-critico { background: #e74c3c; color: white; }
    .badge-alto    { background: #e67e22; color: white; }
    .badge-medio   { background: #f1c40f; color: #333; }
    .badge-bajo    { background: #27ae60; color: white; }
    .no-data { color: #27ae60; font-size: 1rem; padding: 1rem; }
    .accesos-rapidos .botones { display: flex; gap: 1rem; flex-wrap: wrap; }
    .btn { padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 0.9rem; transition: opacity 0.2s; }
    .btn:hover { opacity: 0.85; }
    .btn-blue { background: #2980b9; color: white; }
    .btn-teal { background: #16a085; color: white; }
    .btn-red  { background: #e74c3c; color: white; }
  `]
})
export class DashboardComponent implements OnInit {
  totalPacientes = 0;
  alertasPendientes = 0;
  alertasAtendidas = 0;
  alertasCriticas: any[] = [];
  userName = '';
  userEmail = '';
  iniciales = '';
  fechaHoy = new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  constructor(
    private pacienteService: PacienteService,
    private alertaService: AlertaService,
    private msalService: MsalService
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
    this.pacienteService.getAll().subscribe(p => this.totalPacientes = p.length);
    this.alertaService.getAll().subscribe(alertas => {
      this.alertasPendientes = alertas.filter(a => !a.atendida).length;
      this.alertasAtendidas  = alertas.filter(a => a.atendida).length;
      this.alertasCriticas   = alertas.filter(a => !a.atendida && (a.nivel === 'CRITICO' || a.nivel === 'ALTO')).slice(0, 5);
    });
  }

  cargarPerfil(): void {
    try {
      const accounts = this.msalService.instance.getAllAccounts();
      if (accounts.length > 0) {
        const account = accounts[0];
        this.userName  = account.name || account.username || 'Usuario';
        this.userEmail = account.username || '';
        const partes = this.userName.split(' ');
        this.iniciales = partes.length >= 2
          ? (partes[0][0] + partes[1][0]).toUpperCase()
          : this.userName.substring(0, 2).toUpperCase();
      } else {
        // fallback desde localStorage (token B2C)
        const keys = Object.keys(localStorage);
        for (const k of keys) {
          if (k.includes('idtoken') || k.includes('id_token')) {
            try {
              const payload = JSON.parse(atob(localStorage.getItem(k)!.split('.')[1]));
              this.userName  = payload.name || payload.given_name || 'Usuario';
              this.userEmail = payload.emails?.[0] || payload.email || '';
              const partes = this.userName.split(' ');
              this.iniciales = partes.length >= 2
                ? (partes[0][0] + partes[1][0]).toUpperCase()
                : this.userName.substring(0, 2).toUpperCase();
              break;
            } catch {}
          }
        }
      }
    } catch {}
  }
}
