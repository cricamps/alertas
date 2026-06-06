package com.medicas.bff.controller;

import com.medicas.bff.dto.SenalVitalRequest;
import com.medicas.bff.model.Paciente;
import com.medicas.bff.model.SenalVital;
import com.medicas.bff.repository.PacienteRepository;
import com.medicas.bff.repository.SenalVitalRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/senales")
@CrossOrigin(origins = { "http://localhost:4200", "https://medicasapimgrupo2s3.azure-api.net" })
public class SenalVitalController {

    private final SenalVitalRepository senalRepo;
    private final PacienteRepository pacienteRepo;

    public SenalVitalController(SenalVitalRepository senalRepo, PacienteRepository pacienteRepo) {
        this.senalRepo = senalRepo;
        this.pacienteRepo = pacienteRepo;
    }

    @GetMapping
    public List<SenalVital> getAll() {
        return senalRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SenalVital> getById(@PathVariable Long id) {
        return senalRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/paciente/{pacienteId}")
    public List<SenalVital> getByPaciente(@PathVariable Long pacienteId) {
        return senalRepo.findByPacienteId(pacienteId);
    }

    @PostMapping
    public ResponseEntity<SenalVital> create(@RequestBody SenalVitalRequest dto) {
        return pacienteRepo.findById(dto.getPacienteId()).map(paciente -> {
            SenalVital senal = new SenalVital();
            senal.setPaciente(paciente);
            senal.setFrecuenciaCardiaca(dto.getFrecuenciaCardiaca());
            senal.setPresionSistolica(dto.getPresionSistolica());
            senal.setPresionDiastolica(dto.getPresionDiastolica());
            senal.setSaturacionOxigeno(dto.getSaturacionOxigeno());
            senal.setTemperatura(dto.getTemperatura());
            senal.setFrecuenciaRespiratoria(dto.getFrecuenciaRespiratoria());
            senal.setFechaRegistro(LocalDateTime.now());
            return ResponseEntity.ok(senalRepo.save(senal));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<SenalVital> update(@PathVariable Long id, @RequestBody SenalVitalRequest dto) {
        return senalRepo.findById(id).map(s -> {
            if (dto.getPacienteId() != null) {
                Paciente paciente = pacienteRepo.findById(dto.getPacienteId()).orElse(null);
                if (paciente != null) s.setPaciente(paciente);
            }
            s.setFrecuenciaCardiaca(dto.getFrecuenciaCardiaca());
            s.setPresionSistolica(dto.getPresionSistolica());
            s.setPresionDiastolica(dto.getPresionDiastolica());
            s.setSaturacionOxigeno(dto.getSaturacionOxigeno());
            s.setTemperatura(dto.getTemperatura());
            s.setFrecuenciaRespiratoria(dto.getFrecuenciaRespiratoria());
            return ResponseEntity.ok(senalRepo.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!senalRepo.existsById(id)) return ResponseEntity.notFound().build();
        senalRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
