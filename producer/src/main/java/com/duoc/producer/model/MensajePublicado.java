package com.duoc.producer.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entidad que registra en Oracle cada mensaje publicado en la cola.
 * Tabla: MENSAJES_PUBLICADOS
 * 
 * Esto permite auditar qué publicó el productor,
 * complementando la tabla MENSAJES_COLA del consumer.
 */
@Entity
@Table(name = "MENSAJES_PUBLICADOS")
public class MensajePublicado {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_publicados")
    @SequenceGenerator(name = "seq_publicados", sequenceName = "SEQ_MENSAJES_PUBLICADOS", allocationSize = 1)
    private Long id;

    @Column(name = "CONTENIDO", length = 4000)
    private String contenido;

    @Column(name = "TIPO")
    private String tipo; // GENERICO o ALERTA_MEDICA

    @Column(name = "COLA")
    private String cola;

    @Column(name = "FECHA_PUBLICACION")
    private LocalDateTime fechaPublicacion;

    public MensajePublicado() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getCola() {
        return cola;
    }

    public void setCola(String cola) {
        this.cola = cola;
    }

    public LocalDateTime getFechaPublicacion() {
        return fechaPublicacion;
    }

    public void setFechaPublicacion(LocalDateTime fechaPublicacion) {
        this.fechaPublicacion = fechaPublicacion;
    }
}
