import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SenalVitalService, PacienteService } from '../../services/medicas.service';
import { SenalVital, Paciente } from '../../models/medicas.models';

@Component({
  selector: 'app-senales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <h1>💓 Señales Vitales</h1>

      <div class="form-card" [class.editando]="editandoId">
        <h2>{{ editandoId ? '✏️ Editando registro #' + editandoId : 'Registrar Señales Vitales' }}</h2>
        <form [formGroup]="form" (ngSubmit)="guardar()">
          <div class="form-row">
            <div class="form-group">
              <label>Paciente *</label>
              <select formControlName="pacienteId">
                <option value="">-- Seleccionar --</option>
                <option *ngFor="let p of pacientes" [value]="p.id">{{ p.nombre }} ({{ p.cama }})</option>
              </select>
            </div>
            <div class="form-group">
              <label>Frecuencia Cardíaca (bpm) *</label>
              <input type="number" formControlName="frecuenciaCardiaca" placeholder="60-100" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Presión Sistólica (mmHg) *</label>
              <input type="number" formControlName="presionSistolica" placeholder="120" />
            </div>
            <div class="form-group">
              <label>Presión Diastólica (mmHg) *</label>
              <input type="number" formControlName="presionDiastolica" placeholder="80" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Saturación O₂ (%) *</label>
              <input type="number" step="0.1" formControlName="saturacionOxigeno" placeholder="98.5" />
            </div>
            <div class="form-group">
              <label>Temperatura (°C) *</label>
              <input type="number" step="0.1" formControlName="temperatura" placeholder="36.5" />
            </div>
            <div class="form-group">
              <label>Frec. Respiratoria (rpm) *</label>
              <input type="number" formControlName="frecuenciaRespiratoria" placeholder="16" />
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-teal" [disabled]="form.invalid">
              {{ editandoId ? '💾 Actualizar' : '💾 Registrar' }}
            </button>
            <button type="button" class="btn btn-grey" *ngIf="editandoId" (click)="cancelar()">✖ Cancelar</button>
          </div>
        </form>
      </div>

      <div class="table-card">
        <h2>Registros ({{ senales.length }})</h2>
        <p class="hint" *ngIf="senales.length > 0">💡 Clic en una fila para editar</p>
        <table *ngIf="senales.length > 0; else sinDatos">
          <thead>
            <tr><th>Paciente</th><th>FC</th><th>PA</th><th>SpO₂</th><th>Temp</th><th>FR</th><th>Fecha</th><th></th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of senales"
                (click)="editar(s)"
                [class.fila-activa]="editandoId === s.id">
              <td>{{ nombrePaciente(s.paciente.id) }}</td>
              <td [class.alerta-val]="s.frecuenciaCardiaca < 60 || s.frecuenciaCardiaca > 100">{{ s.frecuenciaCardiaca }} bpm</td>
              <td>{{ s.presionSistolica }}/{{ s.presionDiastolica }}</td>
              <td [class.alerta-val]="s.saturacionOxigeno < 95">{{ s.saturacionOxigeno }}%</td>
              <td [class.alerta-val]="s.temperatura > 37.5">{{ s.temperatura }}°C</td>
              <td>{{ s.frecuenciaRespiratoria }} rpm</td>
              <td>{{ s.fechaRegistro | date:'dd/MM HH:mm' }}</td>
              <td (click)="$event.stopPropagation()">
                <button class="btn-sm btn-del" (click)="eliminar(s.id!)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #sinDatos><p class="no-data">Sin registros.</p></ng-template>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1100px; margin: 0 auto; }
    h1 { color: #1a3a5c; margin-bottom: 1.5rem; }
    h2 { color: #1a3a5c; margin-bottom: 1rem; font-size: 1.1rem; }
    .hint { font-size: 0.82rem; color: #7f8c8d; margin-bottom: 0.5rem; }
    .form-card { background: white; border-radius: 10px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.08); border-top: 4px solid #bdc3c7; }
    .form-card.editando { border-top: 4px solid #16a085; }
    .table-card { background: white; border-radius: 10px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
    .form-row { display: flex; gap: 1rem; flex-wrap: wrap; }
    .form-group { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 150px; margin-bottom: 1rem; }
    label { font-size: 0.85rem; font-weight: 600; color: #34495e; }
    input, select { padding: 8px 12px; border: 1px solid #bdc3c7; border-radius: 6px; font-size: 0.9rem; }
    input:focus, select:focus { outline: none; border-color: #16a085; }
    .form-actions { display: flex; gap: 1rem; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #16a085; color: white; padding: 10px 12px; text-align: left; font-size: 0.85rem; }
    td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 0.85rem; }
    tr { cursor: pointer; transition: background 0.15s; }
    tr:hover td { background: #eafaf7; }
    tr.fila-activa td { background: #d1f2eb; }
    tr.fila-activa { outline: 2px solid #16a085; outline-offset: -2px; }
    .alerta-val { color: #e74c3c; font-weight: bold; }
    .btn { padding: 8px 18px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold; font-size: 0.88rem; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-teal { background: #16a085; color: white; }
    .btn-grey { background: #95a5a6; color: white; }
    .btn-sm { padding: 4px 10px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-del { background: #e74c3c; color: white; }
    .no-data { color: #7f8c8d; padding: 1rem; }
  `]
})
export class SenalesComponent implements OnInit {
  senales: SenalVital[] = [];
  pacientes: Paciente[] = [];
  form: FormGroup;
  editandoId: number | null = null;

  constructor(private svc: SenalVitalService, private pacSvc: PacienteService, private fb: FormBuilder) {
    this.form = this.fb.group({
      pacienteId:             ['', Validators.required],
      frecuenciaCardiaca:     ['', [Validators.required, Validators.min(1), Validators.max(300)]],
      presionSistolica:       ['', Validators.required],
      presionDiastolica:      ['', Validators.required],
      saturacionOxigeno:      ['', Validators.required],
      temperatura:            ['', Validators.required],
      frecuenciaRespiratoria: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargar();
    this.pacSvc.getAll().subscribe(d => this.pacientes = d);
  }

  cargar(): void { this.svc.getAll().subscribe(d => this.senales = d); }

  nombrePaciente(id: number): string {
    return this.pacientes.find(p => p.id === id)?.nombre || `ID ${id}`;
  }

  editar(s: SenalVital): void {
    this.editandoId = s.id!;
    // Usar setTimeout para asegurar que Angular procese el cambio antes de patchValue
    setTimeout(() => {
      this.form.patchValue({
        pacienteId:             String(s.paciente.id),
        frecuenciaCardiaca:     s.frecuenciaCardiaca,
        presionSistolica:       s.presionSistolica,
        presionDiastolica:      s.presionDiastolica,
        saturacionOxigeno:      s.saturacionOxigeno,
        temperatura:            s.temperatura,
        frecuenciaRespiratoria: s.frecuenciaRespiratoria
      });
    }, 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  guardar(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    const senal: SenalVital = {
      paciente:               { id: +v.pacienteId },
      frecuenciaCardiaca:     +v.frecuenciaCardiaca,
      presionSistolica:       +v.presionSistolica,
      presionDiastolica:      +v.presionDiastolica,
      saturacionOxigeno:      +v.saturacionOxigeno,
      temperatura:            +v.temperatura,
      frecuenciaRespiratoria: +v.frecuenciaRespiratoria
    };
    if (this.editandoId) {
      this.svc.update(this.editandoId, senal).subscribe({
        next: () => { this.cargar(); this.cancelar(); },
        error: e => alert('Error al actualizar: ' + e.message)
      });
    } else {
      this.svc.create(senal).subscribe({
        next: () => { this.cargar(); this.form.reset(); },
        error: e => alert('Error al crear: ' + e.message)
      });
    }
  }

  cancelar(): void { this.editandoId = null; this.form.reset(); }

  eliminar(id: number): void {
    if (confirm('¿Eliminar este registro?')) {
      this.svc.delete(id).subscribe({
        next: () => { this.cargar(); if (this.editandoId === id) this.cancelar(); }
      });
    }
  }
}
