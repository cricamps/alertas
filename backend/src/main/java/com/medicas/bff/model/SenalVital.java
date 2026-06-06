package com.medicas.bff.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "SENALES_VITALES")
public class SenalVital {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "senal_seq")
    @SequenceGenerator(name = "senal_seq", sequenceName = "SENAL_SEQ", allocationSize = 1)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "PACIENTE_ID", nullable = false)
    private Paciente paciente;

    @Column(name = "FRECUENCIA_CARDIACA")
    private Integer frecuenciaCardiaca;

    @Column(name = "PRESION_SISTOLICA")
    private Integer presionSistolica;

    @Column(name = "PRESION_DIASTOLICA")
    private Integer presionDiastolica;

    @Column(name = "SATURACION_OXIGENO")
    private Double saturacionOxigeno;

    @Column(name = "TEMPERATURA")
    private Double temperatura;

    @Column(name = "FRECUENCIA_RESPIRATORIA")
    private Integer frecuenciaRespiratoria;

    @Column(name = "FECHA_REGISTRO")
    private LocalDateTime fechaRegistro;

    // Constructores
    public SenalVital() {
        this.fechaRegistro = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Paciente getPaciente() { return paciente; }
    public void setPaciente(Paciente paciente) { this.paciente = paciente; }

    public Integer getFrecuenciaCardiaca() { return frecuenciaCardiaca; }
    public void setFrecuenciaCardiaca(Integer frecuenciaCardiaca) { this.frecuenciaCardiaca = frecuenciaCardiaca; }

    public Integer getPresionSistolica() { return presionSistolica; }
    public void setPresionSistolica(Integer presionSistolica) { this.presionSistolica = presionSistolica; }

    public Integer getPresionDiastolica() { return presionDiastolica; }
    public void setPresionDiastolica(Integer presionDiastolica) { this.presionDiastolica = presionDiastolica; }

    public Double getSaturacionOxigeno() { return saturacionOxigeno; }
    public void setSaturacionOxigeno(Double saturacionOxigeno) { this.saturacionOxigeno = saturacionOxigeno; }

    public Double getTemperatura() { return temperatura; }
    public void setTemperatura(Double temperatura) { this.temperatura = temperatura; }

    public Integer getFrecuenciaRespiratoria() { return frecuenciaRespiratoria; }
    public void setFrecuenciaRespiratoria(Integer frecuenciaRespiratoria) { this.frecuenciaRespiratoria = frecuenciaRespiratoria; }

    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
}
