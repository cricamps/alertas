package com.medicas.bff.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ALERTAS")
public class Alerta {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "alerta_seq")
    @SequenceGenerator(name = "alerta_seq", sequenceName = "ALERTA_SEQ", allocationSize = 1)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "PACIENTE_ID", nullable = false)
    private Paciente paciente;

    @Column(name = "TIPO_ALERTA", nullable = false, length = 50)
    private String tipoAlerta;

    @Column(name = "DESCRIPCION", length = 500)
    private String descripcion;

    @Column(name = "NIVEL", length = 20)
    private String nivel; // CRITICO, ALTO, MEDIO, BAJO

    @Column(name = "ATENDIDA")
    private Boolean atendida = false;

    @Column(name = "FECHA_ALERTA")
    private LocalDateTime fechaAlerta;

    // Constructores
    public Alerta() {
        this.fechaAlerta = LocalDateTime.now();
        this.atendida = false;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Paciente getPaciente() { return paciente; }
    public void setPaciente(Paciente paciente) { this.paciente = paciente; }

    public String getTipoAlerta() { return tipoAlerta; }
    public void setTipoAlerta(String tipoAlerta) { this.tipoAlerta = tipoAlerta; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getNivel() { return nivel; }
    public void setNivel(String nivel) { this.nivel = nivel; }

    public Boolean getAtendida() { return atendida; }
    public void setAtendida(Boolean atendida) { this.atendida = atendida; }

    public LocalDateTime getFechaAlerta() { return fechaAlerta; }
    public void setFechaAlerta(LocalDateTime fechaAlerta) { this.fechaAlerta = fechaAlerta; }
}
