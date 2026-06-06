package com.medicas.bff.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "PACIENTES")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "paciente_seq")
    @SequenceGenerator(name = "paciente_seq", sequenceName = "PACIENTE_SEQ", allocationSize = 1)
    private Long id;

    @Column(name = "NOMBRE", nullable = false, length = 100)
    private String nombre;

    @Column(name = "RUT", unique = true, nullable = false, length = 12)
    private String rut;

    @Column(name = "FECHA_NACIMIENTO")
    private LocalDate fechaNacimiento;

    @Column(name = "DIAGNOSTICO", length = 200)
    private String diagnostico;

    @Column(name = "CAMA", length = 10)
    private String cama;

    // Constructores
    public Paciente() {}

    public Paciente(String nombre, String rut, LocalDate fechaNacimiento, String diagnostico, String cama) {
        this.nombre = nombre;
        this.rut = rut;
        this.fechaNacimiento = fechaNacimiento;
        this.diagnostico = diagnostico;
        this.cama = cama;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getRut() { return rut; }
    public void setRut(String rut) { this.rut = rut; }

    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public String getDiagnostico() { return diagnostico; }
    public void setDiagnostico(String diagnostico) { this.diagnostico = diagnostico; }

    public String getCama() { return cama; }
    public void setCama(String cama) { this.cama = cama; }
}
