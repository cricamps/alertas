package com.duoc.producer.dto;

import java.time.LocalDateTime;

/**
 * DTO de respuesta tras publicar un mensaje en la cola.
 */
public class PublicacionResponse {

    private boolean exito;
    private String mensaje;
    private String contenidoPublicado;
    private LocalDateTime timestamp;

    public PublicacionResponse() {}

    public PublicacionResponse(boolean exito, String mensaje, String contenidoPublicado) {
        this.exito = exito;
        this.mensaje = mensaje;
        this.contenidoPublicado = contenidoPublicado;
        this.timestamp = LocalDateTime.now();
    }

    public boolean isExito() {
        return exito;
    }

    public void setExito(boolean exito) {
        this.exito = exito;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getContenidoPublicado() {
        return contenidoPublicado;
    }

    public void setContenidoPublicado(String contenidoPublicado) {
        this.contenidoPublicado = contenidoPublicado;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
