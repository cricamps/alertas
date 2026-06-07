import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paciente, SenalVital, Alerta } from '../models/medicas.models';

const API_BASE = 'https://0927vbvzqk.execute-api.us-east-1.amazonaws.com/prod/api';

function getAuthHeaders(): HttpHeaders {
  try {
    const keys = Object.keys(localStorage);
    for (const k of keys) {
      if (k.toLowerCase().includes('idtoken')) {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        try {
          const parsed = JSON.parse(raw);
          const token = parsed.secret || parsed.credential || parsed.token;
          if (token && token.includes('.')) {
            return new HttpHeaders({ Authorization: `Bearer ${token}` });
          }
        } catch {
          if (raw.includes('.')) {
            return new HttpHeaders({ Authorization: `Bearer ${raw}` });
          }
        }
      }
    }
  } catch {}
  return new HttpHeaders();
}

@Injectable({ providedIn: 'root' })
export class PacienteService {
  constructor(private http: HttpClient) {}
  getAll(): Observable<Paciente[]>          { return this.http.get<Paciente[]>(`${API_BASE}/pacientes`); }
  getById(id: number): Observable<Paciente> { return this.http.get<Paciente>(`${API_BASE}/pacientes/${id}`); }
  create(p: Paciente): Observable<Paciente> { return this.http.post<Paciente>(`${API_BASE}/pacientes`, p, { headers: getAuthHeaders() }); }
  update(id: number, p: Paciente): Observable<Paciente> { return this.http.put<Paciente>(`${API_BASE}/pacientes/${id}`, p, { headers: getAuthHeaders() }); }
  delete(id: number): Observable<void>      { return this.http.delete<void>(`${API_BASE}/pacientes/${id}`, { headers: getAuthHeaders() }); }
}

@Injectable({ providedIn: 'root' })
export class SenalVitalService {
  constructor(private http: HttpClient) {}
  getAll(): Observable<SenalVital[]>                        { return this.http.get<SenalVital[]>(`${API_BASE}/senales`); }
  getByPaciente(pid: number): Observable<SenalVital[]>      { return this.http.get<SenalVital[]>(`${API_BASE}/senales/paciente/${pid}`); }
  create(s: SenalVital): Observable<SenalVital>             { return this.http.post<SenalVital>(`${API_BASE}/senales`, s, { headers: getAuthHeaders() }); }
  update(id: number, s: SenalVital): Observable<SenalVital> { return this.http.put<SenalVital>(`${API_BASE}/senales/${id}`, s, { headers: getAuthHeaders() }); }
  delete(id: number): Observable<void>                      { return this.http.delete<void>(`${API_BASE}/senales/${id}`, { headers: getAuthHeaders() }); }
}

@Injectable({ providedIn: 'root' })
export class AlertaService {
  constructor(private http: HttpClient) {}
  getAll(): Observable<Alerta[]>                      { return this.http.get<Alerta[]>(`${API_BASE}/alertas`); }
  getPendientes(): Observable<Alerta[]>               { return this.http.get<Alerta[]>(`${API_BASE}/alertas/pendientes`); }
  getByPaciente(pid: number): Observable<Alerta[]>    { return this.http.get<Alerta[]>(`${API_BASE}/alertas/paciente/${pid}`); }
  create(a: Alerta): Observable<Alerta>               { return this.http.post<Alerta>(`${API_BASE}/alertas`, a, { headers: getAuthHeaders() }); }
  update(id: number, a: Alerta): Observable<Alerta>   { return this.http.put<Alerta>(`${API_BASE}/alertas/${id}`, a, { headers: getAuthHeaders() }); }
  delete(id: number): Observable<void>                { return this.http.delete<void>(`${API_BASE}/alertas/${id}`, { headers: getAuthHeaders() }); }
}
