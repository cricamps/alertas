package com.medicas.bff.dto;

public class SenalVitalRequest {
    private Long pacienteId;
    private Integer frecuenciaCardiaca;
    private Integer presionSistolica;
    private Integer presionDiastolica;
    private Double saturacionOxigeno;
    private Double temperatura;
    private Integer frecuenciaRespiratoria;

    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }

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
}
