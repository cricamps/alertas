export interface Paciente {
  id?: number;
  nombre: string;
  rut: string;
  fechaNacimiento: string;
  diagnostico: string;
  cama: string;
}

export interface SenalVital {
  id?: number;
  paciente: { id: number };
  frecuenciaCardiaca: number;
  presionSistolica: number;
  presionDiastolica: number;
  saturacionOxigeno: number;
  temperatura: number;
  frecuenciaRespiratoria: number;
  fechaRegistro?: string;
}

export interface Alerta {
  id?: number;
  paciente: { id: number };
  tipoAlerta: string;
  descripcion: string;
  nivel: 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAJO';
  atendida: boolean;
  fechaAlerta?: string;
}
