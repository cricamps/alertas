import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertaService, PacienteService } from '../../services/medicas.service';
import { Alerta, Paciente } from '../../models/medicas.models';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <h1>🚨 Gestión de Alertas</h1>

      <div class="form-card" [class.editando]="editandoId">
        <h2>{{ editandoId ? '✏️ Editando alerta #' + editandoId : 'Nueva Alerta' }}</h2>
        <form [formGroup]="form" (ngSubmit)="guardar()">
          <div class="form-row">
            <div class="form-group">
              <label>Paciente *</label>
              <select formControlName="pacienteId">
                <option value="">-- Seleccionar --</option>
                <option *ngFor="let p of pacientes" [value]="p.id">{{ p.nombre }}</option>
              </select>
              <span class="error" *ngIf="form.get('pacienteId')?.invalid && form.get('pacienteId')?.touched">Requerido</span>
            </div>
            <div class="form-group">
              <label>Tipo de Alerta *</label>
              <input formControlName="tipoAlerta" placeholder="Ej: Taquicardia, Hipoxia" />
              <span class="error" *ngIf="form.get('tipoAlerta')?.invalid && form.get('tipoAlerta')?.touched">Requerido</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Nivel *</label>
              <select formControlName="nivel">
                <option value="">-- Seleccionar --</option>
                <option value="CRITICO">🔴 CRÍTICO</option>
                <option value="ALTO">🟠 ALTO</option>
                <option value="MEDIO">🟡 MEDIO</option>
                <option value="BAJO">🟢 BAJO</option>
              </select>
              <span class="error" *ngIf="form.get('nivel')?.invalid && form.get('nivel')?.touched">Requerido</span>
            </div>
            <div class="form-group">
              <label>Estado</label>
              <select formControlName="atendida">
                <option [ngValue]="false">⏳ Pendiente</option>
                <option [ngValue]="true">✅ Atendida</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Descripción *</label>
            <input formControlName="descripcion" placeholder="Describe la alerta en detalle..." />
            <span class="error" *ngIf="form.get('descripcion')?.invalid && form.get('descripcion')?.touched">Requerido</span>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-red" [disabled]="form.invalid">
              {{ editandoId ? '💾 Actualizar' : '🚨 Crear Alerta' }}
            </button>
            <button type="button" class="btn btn-grey" *ngIf="editandoId" (click)="cancelar()">✖ Cancelar</button>
          </div>
        </form>
      </div>

      <div class="table-card">
        <h2>Todas las Alertas ({{ alertas.length }})</h2>
        <p class="hint" *ngIf="alertas.length > 0">💡 Clic en una fila para editar</p>
        <table *ngIf="alertas.length > 0; else sinDatos">
          <thead>
            <tr><th>Paciente</th><th>Tipo</th><th>Nivel</th><th>Descripción</th><th>Estado</th><th>Fecha</th><th></th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of alertas"
                (click)="editar(a)"
                [class.fila-activa]="editandoId === a.id">
              <td>{{ nombrePaciente(a.paciente.id) }}</td>
              <td>{{ a.tipoAlerta }}</td>
              <td><span class="badge" [class]="'badge-' + a.nivel.toLowerCase()">{{ a.nivel }}</span></td>
              <td>{{ a.descripcion }}</td>
              <td>
                <span [class]="a.atendida ? 'badge badge-ok' : 'badge badge-pend'">
                  {{ a.atendida ? '✅ Atendida' : '⏳ Pendiente' }}
                </span>
              </td>
              <td>{{ a.fechaAlerta | date:'dd/MM HH:mm' }}</td>
              <td (click)="$event.stopPropagation()">
                <button class="btn-sm btn-del" (click)="eliminar(a.id!)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #sinDatos><p class="no-data">Sin alertas registradas.</p></ng-template>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1100px; margin: 0 auto; }
    h1 { color: #1a3a5c; margin-bottom: 1.5rem; }
    h2 { color: #1a3a5c; margin-bottom: 1rem; font-size: 1.1rem; }
    .hint { font-size: 0.82rem; color: #7f8c8d; margin-bottom: 0.5rem; }
    .form-card { background: white; border-radius: 10px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.08); border-top: 4px solid #bdc3c7; }
    .form-card.editando { border-top: 4px solid #e74c3c; }
    .table-card { background: white; border-radius: 10px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
    .form-row { display: flex; gap: 1rem; flex-wrap: wrap; }
    .form-group { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 200px; margin-bottom: 1rem; }
    label { font-size: 0.85rem; font-weight: 600; color: #34495e; }
    input, select { padding: 8px 12px; border: 1px solid #bdc3c7; border-radius: 6px; font-size: 0.9rem; }
    input:focus, select:focus { outline: none; border-color: #e74c3c; }
    .error { color: #e74c3c; font-size: 0.78rem; }
    .form-actions { display: flex; gap: 1rem; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #c0392b; color: white; padding: 10px 12px; text-align: left; font-size: 0.85rem; }
    td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 0.85rem; }
    tr { cursor: pointer; transition: background 0.15s; }
    tr:hover td { background: #fdf2f2; }
    tr.fila-activa td { background: #fadbd8; }
    tr.fila-activa { outline: 2px solid #e74c3c; outline-offset: -2px; }
    .badge { padding: 3px 10px; border-radius: 12px; font-size: 0.78rem; font-weight: bold; }
    .badge-critico { background: #e74c3c; color: white; }
    .badge-alto    { background: #e67e22; color: white; }
    .badge-medio   { background: #f1c40f; color: #333; }
    .badge-bajo    { background: #27ae60; color: white; }
    .badge-ok   { background: #27ae60; color: white; }
    .badge-pend { background: #e67e22; color: white; }
    .btn { padding: 8px 18px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold; font-size: 0.88rem; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-red  { background: #e74c3c; color: white; }
    .btn-grey { background: #95a5a6; color: white; }
    .btn-sm { padding: 4px 10px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-del { background: #e74c3c; color: white; }
    .no-data { color: #7f8c8d; padding: 1rem; }
  `]
})
export class AlertasComponent implements OnInit {
  alertas: Alerta[] = [];
  pacientes: Paciente[] = [];
  form: FormGroup;
  editandoId: number | null = null;

  constructor(private svc: AlertaService, private pacSvc: PacienteService, private fb: FormBuilder) {
    this.form = this.fb.group({
      pacienteId:  ['', Validators.required],
      tipoAlerta:  ['', Validators.required],
      nivel:       ['', Validators.required],
      descripcion: ['', Validators.required],
      atendida:    [false]
    });
  }

  ngOnInit(): void {
    this.cargar();
    this.pacSvc.getAll().subscribe(d => this.pacientes = d);
  }

  cargar(): void { this.svc.getAll().subscribe(d => this.alertas = d); }

  nombrePaciente(id: number): string {
    return this.pacientes.find(p => p.id === id)?.nombre || `ID ${id}`;
  }

  editar(a: Alerta): void {
    this.editandoId = a.id!;
    setTimeout(() => {
      this.form.patchValue({
        pacienteId:  String(a.paciente.id),
        tipoAlerta:  a.tipoAlerta,
        nivel:       a.nivel,
        descripcion: a.descripcion,
        atendida:    a.atendida
      });
    }, 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  guardar(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const alerta: Alerta = {
      paciente:    { id: +v.pacienteId },
      tipoAlerta:  v.tipoAlerta,
      nivel:       v.nivel,
      descripcion: v.descripcion,
      atendida:    v.atendida === true || v.atendida === 'true'
    };
    if (this.editandoId) {
      this.svc.update(this.editandoId, alerta).subscribe({
        next: () => { this.cargar(); this.cancelar(); },
        error: e => alert('Error al actualizar: ' + e.message)
      });
    } else {
      this.svc.create(alerta).subscribe({
        next: () => { this.cargar(); this.form.reset(); this.form.patchValue({ atendida: false }); },
        error: e => alert('Error al crear: ' + e.message)
      });
    }
  }

  cancelar(): void {
    this.editandoId = null;
    this.form.reset();
    this.form.patchValue({ atendida: false });
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar esta alerta?')) {
      this.svc.delete(id).subscribe({
        next: () => { this.cargar(); if (this.editandoId === id) this.cancelar(); }
      });
    }
  }
}
