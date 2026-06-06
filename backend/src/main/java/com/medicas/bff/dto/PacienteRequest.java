package com.medicas.bff.dto;

import java.time.LocalDate;

public class PacienteRequest {
    private String nombre;
    private String rut;
    private LocalDate fechaNacimiento;
    private String diagnostico;
    private String cama;

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
