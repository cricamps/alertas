package com.duoc.producer.dto;

/**
 * DTO para publicar una alerta médica en la cola.
 * Endpoint: POST /alertas/publicar
 */
public class AlertaRequest {

    private String paciente;
    private String tipoAlerta;
    private String descripcion;
    private String nivelUrgencia; // ALTO, MEDIO, BAJO

    public AlertaRequest() {}

    public String getPaciente() {
        return paciente;
    }

    public void setPaciente(String paciente) {
        this.paciente = paciente;
    }

    public String getTipoAlerta() {
        return tipoAlerta;
    }

    public void setTipoAlerta(String tipoAlerta) {
        this.tipoAlerta = tipoAlerta;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getNivelUrgencia() {
        return nivelUrgencia;
    }

    public void setNivelUrgencia(String nivelUrgencia) {
        this.nivelUrgencia = nivelUrgencia;
    }

    /**
     * Formatea la alerta como texto para enviar a la cola.
     */
    @Override
    public String toString() {
        return String.format("[ALERTA MÉDICA] Paciente: %s | Tipo: %s | Urgencia: %s | Descripción: %s",
                paciente, tipoAlerta, nivelUrgencia, descripcion);
    }
}
