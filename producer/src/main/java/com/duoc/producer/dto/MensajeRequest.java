package com.duoc.producer.dto;

/**
 * DTO para publicar un mensaje genérico en la cola.
 * Endpoint: POST /mensajes/publicar
 */
public class MensajeRequest {

    private String mensaje;

    public MensajeRequest() {}

    public MensajeRequest(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}
