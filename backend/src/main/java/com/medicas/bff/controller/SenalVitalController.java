package com.medicas.bff.controller;

import com.medicas.bff.model.SenalVital;
import com.medicas.bff.model.Paciente;
import com.medicas.bff.repository.SenalVitalRepository;
import com.medicas.bff.repository.PacienteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/senales")
@CrossOrigin(origins = "*")
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
    public ResponseEntity<SenalVital> create(@RequestBody SenalVital senal) {
        senal.setFechaRegistro(LocalDateTime.now());
        return ResponseEntity.ok(senalRepo.save(senal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SenalVital> update(@PathVariable Long id, @RequestBody SenalVital datos) {
        return senalRepo.findById(id).map(s -> {
            s.setFrecuenciaCardiaca(datos.getFrecuenciaCardiaca());
            s.setPresionSistolica(datos.getPresionSistolica());
            s.setPresionDiastolica(datos.getPresionDiastolica());
            s.setSaturacionOxigeno(datos.getSaturacionOxigeno());
            s.setTemperatura(datos.getTemperatura());
            s.setFrecuenciaRespiratoria(datos.getFrecuenciaRespiratoria());
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
