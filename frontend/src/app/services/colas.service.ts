import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SignoVitalRequest, EvaluacionResponse,
  AlertaRequest, MensajeRequest, PublicacionResponse, MensajePublicado,
  ResumenResponse, AlertaClinica, HistorialSigno, EstadisticaPaciente
} from '../models/colas.models';

// Todos los microservicios de RabbitMQ + Kafka (desplegados en EC2) se
// exponen a través del gateway de Azure API Management, no directamente
// contra la IP del EC2.
const APIM_BASE = 'https://medicasapimgrupo2s3.azure-api.net';

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

/** Productor 1 - Alertas (signos vitales, alertas médicas, mensajes genéricos) */
@Injectable({ providedIn: 'root' })
export class Producer1Service {
  private base = `${APIM_BASE}/producer1-alertas`;
  constructor(private http: HttpClient) {}

  evaluarSignosVitales(signos: SignoVitalRequest): Observable<EvaluacionResponse> {
    return this.http.post<EvaluacionResponse>(`${this.base}/signos-vitales/evaluar`, signos, { headers: getAuthHeaders() });
  }

  publicarAlerta(alerta: AlertaRequest): Observable<PublicacionResponse> {
    return this.http.post<PublicacionResponse>(`${this.base}/alertas/publicar`, alerta, { headers: getAuthHeaders() });
  }

  publicarMensaje(req: MensajeRequest): Observable<PublicacionResponse> {
    return this.http.post<PublicacionResponse>(`${this.base}/mensajes/publicar`, req, { headers: getAuthHeaders() });
  }

  listarEnviados(): Observable<MensajePublicado[]> {
    return this.http.get<MensajePublicado[]>(`${this.base}/mensajes/enviados`);
  }
}

/** Productor 2 - Resumen periódico */
@Injectable({ providedIn: 'root' })
export class Producer2Service {
  private base = `${APIM_BASE}/producer2-resumen`;
  constructor(private http: HttpClient) {}

  enviarResumenManual(): Observable<ResumenResponse> {
    return this.http.post<ResumenResponse>(`${this.base}/resumen/enviar`, {}, { headers: getAuthHeaders() });
  }
}

/** Consumidor 1 - Oracle (alertas Kafka + historial RabbitMQ) */
@Injectable({ providedIn: 'root' })
export class Consumer1Service {
  private base = `${APIM_BASE}/consumer1-oracle`;
  constructor(private http: HttpClient) {}

  listarAlertasKafka(): Observable<AlertaClinica[]> {
    return this.http.get<AlertaClinica[]>(`${this.base}/alertas-kafka/listar`);
  }

  alertasPorPaciente(pacienteId: string): Observable<AlertaClinica[]> {
    return this.http.get<AlertaClinica[]>(`${this.base}/alertas-kafka/paciente/${pacienteId}`);
  }

  marcarAlertaRevisada(id: number): Observable<AlertaClinica> {
    return this.http.put<AlertaClinica>(`${this.base}/alertas-kafka/${id}/revisar`, {}, { headers: getAuthHeaders() });
  }

  listarHistorial(): Observable<HistorialSigno[]> {
    return this.http.get<HistorialSigno[]>(`${this.base}/historial/listar`);
  }

  marcarHistorialRevisado(id: number): Observable<HistorialSigno> {
    return this.http.put<HistorialSigno>(`${this.base}/historial/${id}/revisar`, {}, { headers: getAuthHeaders() });
  }
}

/** Consumidor 2 - Archivos JSON de auditoría */
@Injectable({ providedIn: 'root' })
export class Consumer2Service {
  private base = `${APIM_BASE}/consumer2-json`;
  constructor(private http: HttpClient) {}

  listarArchivos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/alertas-json/listar`);
  }

  verArchivo(nombreArchivo: string): Observable<string> {
    return this.http.get(`${this.base}/alertas-json/${nombreArchivo}`, { responseType: 'text' });
  }

  eliminarArchivo(nombreArchivo: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/alertas-json/${nombreArchivo}`, { headers: getAuthHeaders() });
  }
}

/** Consumidor 3 - Analítica en tiempo real (stream Kafka) */
@Injectable({ providedIn: 'root' })
export class Consumer3Service {
  private base = `${APIM_BASE}/consumer3-analitica-kafka`;
  constructor(private http: HttpClient) {}

  obtenerTodas(): Observable<EstadisticaPaciente[]> {
    return this.http.get<EstadisticaPaciente[]>(`${this.base}/analitica`);
  }

  obtenerPorPaciente(pacienteId: string): Observable<EstadisticaPaciente> {
    return this.http.get<EstadisticaPaciente>(`${this.base}/analitica/${pacienteId}`);
  }
}
