// Modelos para el stack asíncrono (RabbitMQ + Kafka) desplegado en EC2
// y expuesto a través de Azure API Management (medicasapimgrupo2s3).

export interface SignoVitalRequest {
  pacienteId: string;
  pacienteNombre: string;
  frecuenciaCardiaca: number;
  presionSistolica: number;
  presionDiastolica: number;
  saturacionOxigeno: number;
  temperatura: number;
}

export interface EvaluacionResponse {
  anomaliaDetectada: boolean;
  descripcion: string;
  alertaPublicada: boolean;
}

export interface AlertaRequest {
  paciente: string;
  tipoAlerta: string;
  descripcion: string;
  nivelUrgencia: 'ALTO' | 'MEDIO' | 'BAJO' | '';
}

export interface MensajeRequest {
  mensaje: string;
}

export interface PublicacionResponse {
  exito: boolean;
  mensaje: string;
  contenidoPublicado: string;
  timestamp: string;
}

export interface MensajePublicado {
  id: number;
  contenido: string;
  tipo: string;
  cola: string;
  fechaPublicacion: string;
}

export interface ResumenResponse {
  exito: boolean;
  mensajesPublicados: number;
  mensaje: string;
}

export interface AlertaClinica {
  id: number;
  pacienteId: string;
  pacienteNombre: string;
  tipoAnomalia: string;
  frecuenciaCardiaca: number;
  presionSistolica: number;
  presionDiastolica: number;
  saturacionOxigeno: number;
  temperatura: number;
  fechaDeteccion: string;
  fechaRecepcion: string;
  revisada: boolean;
}

export interface HistorialSigno {
  id: number;
  tipo: string;
  pacienteId: string;
  pacienteNombre: string;
  descripcion: string;
  detalle: string;
  fechaGeneracion: string;
  fechaRecepcion: string;
  cola: string;
  revisado: boolean;
}

export interface EstadisticaPaciente {
  pacienteId: string;
  pacienteNombre: string;
  lecturas: number;
  lecturasAnomalas: number;
  fcPromedio: number;
  spo2Promedio: number;
  temperaturaPromedio: number;
  ultimaLectura: string;
}
