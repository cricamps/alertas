import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacienteService } from '../../services/medicas.service';
import { Paciente } from '../../models/medicas.models';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <h1>👥 Gestión de Pacientes</h1>

      <div class="form-card" [class.editando]="editando">
        <h2>{{ editando ? '✏️ Editando — ' + editando.nombre : 'Nuevo Paciente' }}</h2>
        <form [formGroup]="form" (ngSubmit)="guardar()">
          <div class="form-row">
            <div class="form-group">
              <label>Nombre completo *</label>
              <input formControlName="nombre" placeholder="Ej: Juan Pérez López" />
              <span class="error" *ngIf="form.get('nombre')?.invalid && form.get('nombre')?.touched">Mínimo 3 caracteres</span>
            </div>
            <div class="form-group">
              <label>RUT *</label>
              <input formControlName="rut" placeholder="Ej: 12.345.678-9" />
              <span class="error" *ngIf="form.get('rut')?.invalid && form.get('rut')?.touched">RUT requerido</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Fecha de Nacimiento *</label>
              <input type="date" formControlName="fechaNacimiento" />
            </div>
            <div class="form-group">
              <label>Cama *</label>
              <input formControlName="cama" placeholder="Ej: UCI-01" />
            </div>
          </div>
          <div class="form-group">
            <label>Diagnóstico</label>
            <input formControlName="diagnostico" placeholder="Ej: Insuficiencia cardíaca" />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-blue" [disabled]="form.invalid">
              {{ editando ? '💾 Actualizar' : '➕ Agregar' }}
            </button>
            <button type="button" class="btn btn-grey" *ngIf="editando" (click)="cancelar()">✖ Cancelar</button>
          </div>
        </form>
      </div>

      <div class="table-card">
        <h2>Lista de Pacientes ({{ pacientes.length }})</h2>
        <p class="hint" *ngIf="pacientes.length > 0">💡 Clic en una fila para editar</p>
        <table *ngIf="pacientes.length > 0; else sinDatos">
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>RUT</th><th>Cama</th><th>Diagnóstico</th><th></th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of pacientes"
                (click)="editar(p)"
                [class.fila-activa]="editando?.id === p.id">
              <td>{{ p.id }}</td>
              <td>{{ p.nombre }}</td>
              <td>{{ p.rut }}</td>
              <td>{{ p.cama }}</td>
              <td>{{ p.diagnostico }}</td>
              <td (click)="$event.stopPropagation()">
                <button class="btn-sm btn-del" (click)="eliminar(p.id!)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #sinDatos><p class="no-data">No hay pacientes registrados aún.</p></ng-template>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 2rem; max-width: 1100px; margin: 0 auto; }
    h1 { color: #1a3a5c; margin-bottom: 1.5rem; }
    h2 { color: #1a3a5c; margin-bottom: 1rem; font-size: 1.1rem; }
    .hint { font-size: 0.82rem; color: #7f8c8d; margin-bottom: 0.5rem; }
    .form-card { background: white; border-radius: 10px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.08); border-top: 4px solid #bdc3c7; }
    .form-card.editando { border-top: 4px solid #2980b9; }
    .table-card { background: white; border-radius: 10px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
    .form-row { display: flex; gap: 1rem; flex-wrap: wrap; }
    .form-group { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 200px; margin-bottom: 1rem; }
    label { font-size: 0.85rem; font-weight: 600; color: #34495e; }
    input { padding: 8px 12px; border: 1px solid #bdc3c7; border-radius: 6px; font-size: 0.9rem; }
    input:focus { outline: none; border-color: #2980b9; }
    .error { color: #e74c3c; font-size: 0.78rem; }
    .form-actions { display: flex; gap: 1rem; margin-top: 0.5rem; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1a3a5c; color: white; padding: 10px 14px; text-align: left; font-size: 0.88rem; }
    td { padding: 10px 14px; border-bottom: 1px solid #eee; font-size: 0.88rem; }
    tr { cursor: pointer; transition: background 0.15s; }
    tr:hover td { background: #eaf4fb; }
    tr.fila-activa td { background: #d6eaf8; }
    tr.fila-activa { outline: 2px solid #2980b9; outline-offset: -2px; }
    .btn { padding: 8px 18px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold; font-size: 0.88rem; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-blue { background: #2980b9; color: white; }
    .btn-grey { background: #95a5a6; color: white; }
    .btn-sm { padding: 4px 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem; }
    .btn-del { background: #e74c3c; color: white; }
    .no-data { color: #7f8c8d; padding: 1rem; }
  `]
})
export class PacientesComponent implements OnInit {
  pacientes: Paciente[] = [];
  form: FormGroup;
  editando: Paciente | null = null;

  constructor(private svc: PacienteService, private fb: FormBuilder) {
    this.form = this.fb.group({
      nombre:          ['', [Validators.required, Validators.minLength(3)]],
      rut:             ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      cama:            ['', Validators.required],
      diagnostico:     ['']
    });
  }

  ngOnInit(): void { this.cargar(); }
  cargar(): void { this.svc.getAll().subscribe(d => this.pacientes = d); }

  editar(p: Paciente): void {
    this.editando = p;
    this.form.patchValue({
      nombre:          p.nombre,
      rut:             p.rut,
      fechaNacimiento: p.fechaNacimiento,
      cama:            p.cama,
      diagnostico:     p.diagnostico || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  guardar(): void {
    if (this.form.invalid) return;
    const datos = this.form.value as Paciente;
    if (this.editando) {
      this.svc.update(this.editando.id!, datos).subscribe({
        next: () => { this.cargar(); this.cancelar(); },
        error: e => alert('Error al actualizar: ' + e.message)
      });
    } else {
      this.svc.create(datos).subscribe({
        next: () => { this.cargar(); this.form.reset(); },
        error: e => alert('Error al crear: ' + e.message)
      });
    }
  }

  cancelar(): void { this.editando = null; this.form.reset(); }

  eliminar(id: number): void {
    if (confirm('¿Eliminar este paciente?')) {
      this.svc.delete(id).subscribe({
        next: () => { this.cargar(); if (this.editando?.id === id) this.cancelar(); }
      });
    }
  }
}
