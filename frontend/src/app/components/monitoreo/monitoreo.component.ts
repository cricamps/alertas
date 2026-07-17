import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producer1Service, Producer2Service, Consumer1Service, Consumer2Service, Consumer3Service } from '../../services/colas.service';
import {
  SignoVitalRequest, EvaluacionResponse, AlertaRequest, MensajeRequest,
  MensajePublicado, AlertaClinica, HistorialSigno, EstadisticaPaciente
} from '../../models/colas.models';

@Component({
  selector: 'app-monitoreo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <h1>📡 Monitoreo en Tiempo Real (RabbitMQ + Kafka vía API Manager)</h1>
      <p class="subtitle">Todos los llamados de esta sección pasan por el gateway <code>medicasapimgrupo2s3.azure-api.net</code>, no directo al EC2.</p>

      <!-- Simulador de signos vitales -->
      <div class="card">
        <h2>💓 Simulador de Signos Vitales (Productor 1)</h2>
        <p class="hint">POST /producer1-alertas/signos-vitales/evaluar — publica una alerta en RabbitMQ solo si detecta anomalía.</p>
        <div class="form-row">
          <div class="form-group"><label>ID Paciente</label><input [(ngModel)]="signo.pacienteId" placeholder="P001"></div>
          <div class="form-group"><label>Nombre</label><input [(ngModel)]="signo.pacienteNombre" placeholder="Juan Pérez"></div>
          <div class="form-group"><label>FC (bpm)</label><input type="number" [(ngModel)]="signo.frecuenciaCardiaca"></div>
          <div class="form-group"><label>PA Sistólica</label><input type="number" [(ngModel)]="signo.presionSistolica"></div>
          <div class="form-group"><label>PA Diastólica</label><input type="number" [(ngModel)]="signo.presionDiastolica"></div>
          <div class="form-group"><label>SpO2 (%)</label><input type="number" [(ngModel)]="signo.saturacionOxigeno"></div>
          <div class="form-group"><label>Temp (°C)</label><input type="number" step="0.1" [(ngModel)]="signo.temperatura"></div>
        </div>
        <button class="btn btn-blue" (click)="evaluarSignos()">Evaluar y publicar</button>
        <div class="result" *ngIf="resultadoSignos as r" [class.result-alert]="r.anomaliaDetectada">
          {{ r.anomaliaDetectada ? '🚨 Anomalía: ' + r.descripcion : '✅ Sin anomalías' }}
          <span *ngIf="r.alertaPublicada"> · Alerta publicada en la cola</span>
        </div>
      </div>

      <!-- Alerta médica manual -->
      <div class="card">
        <h2>🚑 Publicar Alerta Médica (Productor 1)</h2>
        <p class="hint">POST /producer1-alertas/alertas/publicar</p>
        <div class="form-row">
          <div class="form-group"><label>Paciente</label><input [(ngModel)]="alertaReq.paciente" placeholder="Juan Pérez"></div>
          <div class="form-group"><label>Tipo</label><input [(ngModel)]="alertaReq.tipoAlerta" placeholder="Presión arterial elevada"></div>
          <div class="form-group">
            <label>Urgencia</label>
            <select [(ngModel)]="alertaReq.nivelUrgencia">
              <option value="">-- Seleccionar --</option>
              <option value="ALTO">ALTO</option>
              <option value="MEDIO">MEDIO</option>
              <option value="BAJO">BAJO</option>
            </select>
          </div>
          <div class="form-group"><label>Descripción</label><input [(ngModel)]="alertaReq.descripcion" placeholder="PA 180/110 mmHg"></div>
        </div>
        <button class="btn btn-red" (click)="publicarAlerta()">Publicar alerta</button>
        <div class="result" *ngIf="resultadoAlerta">{{ resultadoAlerta }}</div>
      </div>

      <!-- Mensaje genérico -->
      <div class="card">
        <h2>✉️ Mensaje Genérico (Productor 1)</h2>
        <p class="hint">POST /producer1-alertas/mensajes/publicar · GET /producer1-alertas/mensajes/enviados</p>
        <div class="form-row">
          <div class="form-group" style="flex:3"><label>Mensaje</label><input [(ngModel)]="mensajeReq.mensaje" placeholder="Hola desde el frontend!"></div>
        </div>
        <button class="btn btn-blue" (click)="publicarMensaje()">Publicar</button>
        <button class="btn btn-grey" (click)="cargarEnviados()">🔄 Refrescar enviados</button>
        <table *ngIf="enviados.length > 0" class="mt">
          <thead><tr><th>Contenido</th><th>Tipo</th><th>Cola</th><th>Fecha</th></tr></thead>
          <tbody>
            <tr *ngFor="let m of enviados">
              <td>{{ m.contenido }}</td><td>{{ m.tipo }}</td><td>{{ m.cola }}</td><td>{{ m.fechaPublicacion | date:'dd/MM HH:mm' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Resumen periódico -->
      <div class="card">
        <h2>📊 Resumen Periódico (Productor 2)</h2>
        <p class="hint">POST /producer2-resumen/resumen/enviar — dispara manualmente el resumen (normalmente corre cada 5 min).</p>
        <button class="btn btn-blue" (click)="dispararResumen()">Disparar resumen ahora</button>
        <div class="result" *ngIf="resultadoResumen">{{ resultadoResumen }}</div>
      </div>

      <!-- Alertas Kafka -->
      <div class="card">
        <h2>🧠 Alertas Detectadas — Kafka → Oracle (Consumidor 1)</h2>
        <p class="hint">GET /consumer1-oracle/alertas-kafka/listar · PUT .../{{ '{id}' }}/revisar</p>
        <button class="btn btn-grey" (click)="cargarAlertasKafka()">🔄 Refrescar</button>
        <table *ngIf="alertasKafka.length > 0; else sinAlertasKafka" class="mt">
          <thead><tr><th>Paciente</th><th>Anomalía</th><th>FC</th><th>PA</th><th>SpO2</th><th>Temp</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let a of alertasKafka">
              <td>{{ a.pacienteNombre }} ({{ a.pacienteId }})</td>
              <td>{{ a.tipoAnomalia }}</td>
              <td>{{ a.frecuenciaCardiaca }}</td>
              <td>{{ a.presionSistolica }}/{{ a.presionDiastolica }}</td>
              <td>{{ a.saturacionOxigeno }}%</td>
              <td>{{ a.temperatura }}°C</td>
              <td><span [class]="a.revisada ? 'badge badge-ok' : 'badge badge-pend'">{{ a.revisada ? '✅ Revisada' : '⏳ Pendiente' }}</span></td>
              <td><button *ngIf="!a.revisada" class="btn-sm btn-blue" (click)="revisarAlertaKafka(a.id)">Marcar revisada</button></td>
            </tr>
          </tbody>
        </table>
        <ng-template #sinAlertasKafka><p class="no-data">Sin alertas registradas todavía.</p></ng-template>
      </div>

      <!-- Historial RabbitMQ -->
      <div class="card">
        <h2>📜 Historial — RabbitMQ → Oracle (Consumidor 1)</h2>
        <p class="hint">GET /consumer1-oracle/historial/listar · PUT .../{{ '{id}' }}/revisar</p>
        <button class="btn btn-grey" (click)="cargarHistorial()">🔄 Refrescar</button>
        <table *ngIf="historial.length > 0; else sinHistorial" class="mt">
          <thead><tr><th>Tipo</th><th>Paciente</th><th>Descripción</th><th>Cola</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            <tr *ngFor="let h of historial">
              <td>{{ h.tipo }}</td>
              <td>{{ h.pacienteNombre || '—' }}</td>
              <td>{{ h.descripcion }}</td>
              <td>{{ h.cola }}</td>
              <td><span [class]="h.revisado ? 'badge badge-ok' : 'badge badge-pend'">{{ h.revisado ? '✅ Revisado' : '⏳ Pendiente' }}</span></td>
              <td><button *ngIf="!h.revisado" class="btn-sm btn-blue" (click)="revisarHistorial(h.id)">Marcar revisado</button></td>
            </tr>
          </tbody>
        </table>
        <ng-template #sinHistorial><p class="no-data">Sin historial registrado todavía.</p></ng-template>
      </div>

      <!-- Archivos JSON -->
      <div class="card">
        <h2>🗂️ Archivos de Auditoría JSON (Consumidor 2)</h2>
        <p class="hint">GET /consumer2-json/alertas-json/listar</p>
        <button class="btn btn-grey" (click)="cargarArchivos()">🔄 Refrescar</button>
        <ul class="file-list" *ngIf="archivos.length > 0; else sinArchivos">
          <li *ngFor="let f of archivos">
            {{ f }}
            <button class="btn-sm btn-blue" (click)="verArchivo(f)">Ver</button>
            <button class="btn-sm btn-del" (click)="eliminarArchivo(f)">🗑️</button>
          </li>
        </ul>
        <ng-template #sinArchivos><p class="no-data">Sin archivos generados todavía.</p></ng-template>
        <pre *ngIf="contenidoArchivo" class="json-preview">{{ contenidoArchivo }}</pre>
      </div>

      <!-- Analítica -->
      <div class="card">
        <h2>📈 Analítica en Tiempo Real — Kafka Streams (Consumidor 3)</h2>
        <p class="hint">GET /consumer3-analitica-kafka/analitica</p>
        <button class="btn btn-grey" (click)="cargarAnalitica()">🔄 Refrescar</button>
        <table *ngIf="analitica.length > 0; else sinAnalitica" class="mt">
          <thead><tr><th>Paciente</th><th>Lecturas</th><th>Anómalas</th><th>FC prom.</th><th>SpO2 prom.</th><th>Temp prom.</th><th>Última lectura</th></tr></thead>
          <tbody>
            <tr *ngFor="let e of analitica">
              <td>{{ e.pacienteNombre || e.pacienteId }}</td>
              <td>{{ e.lecturas }}</td>
              <td>{{ e.lecturasAnomalas }}</td>
              <td>{{ e.fcPromedio | number:'1.0-1' }}</td>
              <td>{{ e.spo2Promedio | number:'1.0-1' }}%</td>
              <td>{{ e.temperaturaPromedio | number:'1.1-1' }}°C</td>
              <td>{{ e.ultimaLectura | date:'dd/MM HH:mm:ss' }}</td>
            </tr>
          </tbody>
        </table>
        <ng-template #sinAnalitica><p class="no-data">Sin datos de analítica todavía.</p></ng-template>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    h1 { color: #1a3a5c; margin-bottom: 0.3rem; }
    .subtitle { color: #7f8c8d; font-size: 0.85rem; margin-bottom: 1.5rem; }
    .subtitle code { background: #eef3f7; padding: 2px 6px; border-radius: 4px; }
    .card { background: white; border-radius: 10px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
    h2 { color: #1a3a5c; margin-bottom: 0.3rem; font-size: 1.05rem; }
    .hint { font-size: 0.8rem; color: #7f8c8d; margin-bottom: 1rem; }
    .form-row { display: flex; gap: 1rem; flex-wrap: wrap; }
    .form-group { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 150px; margin-bottom: 1rem; }
    label { font-size: 0.85rem; font-weight: 600; color: #34495e; }
    input, select { padding: 8px 12px; border: 1px solid #bdc3c7; border-radius: 6px; font-size: 0.9rem; }
    .btn { padding: 8px 18px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold; font-size: 0.88rem; margin-right: 0.5rem; }
    .btn-blue { background: #2980b9; color: white; }
    .btn-red  { background: #e74c3c; color: white; }
    .btn-grey { background: #95a5a6; color: white; }
    .btn-sm { padding: 4px 10px; border: none; border-radius: 4px; cursor: pointer; margin-left: 6px; font-size: 0.8rem; }
    .btn-del { background: #e74c3c; color: white; }
    .result { margin-top: 1rem; padding: 10px 14px; border-radius: 6px; background: #eafaf1; color: #1e8449; font-size: 0.88rem; }
    .result-alert { background: #fdedec; color: #c0392b; }
    table { width: 100%; border-collapse: collapse; }
    table.mt { margin-top: 1rem; }
    th { background: #1a3a5c; color: white; padding: 8px 10px; text-align: left; font-size: 0.82rem; }
    td { padding: 8px 10px; border-bottom: 1px solid #eee; font-size: 0.82rem; }
    .badge { padding: 3px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; }
    .badge-ok   { background: #27ae60; color: white; }
    .badge-pend { background: #e67e22; color: white; }
    .no-data { color: #7f8c8d; padding: 0.5rem 0; font-size: 0.85rem; }
    .file-list { list-style: none; padding: 0; margin-top: 1rem; }
    .file-list li { padding: 6px 0; border-bottom: 1px solid #eee; font-size: 0.85rem; }
    .json-preview { background: #1a3a5c; color: #cce0f5; padding: 1rem; border-radius: 6px; margin-top: 1rem; max-height: 300px; overflow: auto; font-size: 0.8rem; }
  `]
})
export class MonitoreoComponent implements OnInit {
  signo: SignoVitalRequest = { pacienteId: '', pacienteNombre: '', frecuenciaCardiaca: 80, presionSistolica: 120, presionDiastolica: 80, saturacionOxigeno: 98, temperatura: 36.5 };
  resultadoSignos: EvaluacionResponse | null = null;

  alertaReq: AlertaRequest = { paciente: '', tipoAlerta: '', descripcion: '', nivelUrgencia: '' };
  resultadoAlerta = '';

  mensajeReq: MensajeRequest = { mensaje: '' };
  enviados: MensajePublicado[] = [];

  resultadoResumen = '';

  alertasKafka: AlertaClinica[] = [];
  historial: HistorialSigno[] = [];
  archivos: string[] = [];
  contenidoArchivo = '';
  analitica: EstadisticaPaciente[] = [];

  constructor(
    private p1: Producer1Service,
    private p2: Producer2Service,
    private c1: Consumer1Service,
    private c2: Consumer2Service,
    private c3: Consumer3Service
  ) {}

  ngOnInit(): void {
    this.cargarEnviados();
    this.cargarAlertasKafka();
    this.cargarHistorial();
    this.cargarArchivos();
    this.cargarAnalitica();
  }

  evaluarSignos(): void {
    this.p1.evaluarSignosVitales(this.signo).subscribe({
      next: r => this.resultadoSignos = r,
      error: e => alert('Error: ' + e.message)
    });
  }

  publicarAlerta(): void {
    this.p1.publicarAlerta(this.alertaReq).subscribe({
      next: r => this.resultadoAlerta = r.mensaje,
      error: e => alert('Error: ' + e.message)
    });
  }

  publicarMensaje(): void {
    this.p1.publicarMensaje(this.mensajeReq).subscribe({
      next: () => { this.mensajeReq.mensaje = ''; this.cargarEnviados(); },
      error: e => alert('Error: ' + e.message)
    });
  }

  cargarEnviados(): void { this.p1.listarEnviados().subscribe(d => this.enviados = d); }

  dispararResumen(): void {
    this.p2.enviarResumenManual().subscribe({
      next: r => this.resultadoResumen = r.mensaje + ' (' + r.mensajesPublicados + ' publicados)',
      error: e => alert('Error: ' + e.message)
    });
  }

  cargarAlertasKafka(): void { this.c1.listarAlertasKafka().subscribe(d => this.alertasKafka = d); }
  revisarAlertaKafka(id: number): void {
    // Actualización optimista: el simulador publica una lectura por segundo,
    // así que si esperáramos el recargarAlertasKafka() para reflejar el
    // cambio, la fila ya se habría reordenado o salido de los primeros 100
    // registros antes de que el usuario alcance a verlo. Se actualiza el
    // estado local de inmediato y además se recarga en segundo plano.
    const alerta = this.alertasKafka.find(a => a.id === id);
    if (alerta) { alerta.revisada = true; }
    this.c1.marcarAlertaRevisada(id).subscribe({
      next: () => this.cargarAlertasKafka(),
      error: e => { if (alerta) { alerta.revisada = false; } alert('Error al marcar revisada: ' + e.message); }
    });
  }

  cargarHistorial(): void { this.c1.listarHistorial().subscribe(d => this.historial = d); }
  revisarHistorial(id: number): void {
    const registro = this.historial.find(h => h.id === id);
    if (registro) { registro.revisado = true; }
    this.c1.marcarHistorialRevisado(id).subscribe({
      next: () => this.cargarHistorial(),
      error: e => { if (registro) { registro.revisado = false; } alert('Error al marcar revisado: ' + e.message); }
    });
  }

  cargarArchivos(): void { this.c2.listarArchivos().subscribe(d => this.archivos = d); }
  verArchivo(nombre: string): void { this.c2.verArchivo(nombre).subscribe(c => this.contenidoArchivo = c); }
  eliminarArchivo(nombre: string): void {
    if (confirm('¿Eliminar ' + nombre + '?')) {
      this.c2.eliminarArchivo(nombre).subscribe(() => this.cargarArchivos());
    }
  }

  cargarAnalitica(): void { this.c3.obtenerTodas().subscribe(d => this.analitica = d); }
}
