package com.medicas.bff.controller;

import com.medicas.bff.dto.PacienteRequest;
import com.medicas.bff.model.Paciente;
import com.medicas.bff.repository.PacienteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = { "http://localhost:4200", "https://medicasapimgrupo2s3.azure-api.net" })
public class PacienteController {

    private final PacienteRepository repo;

    public PacienteController(PacienteRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Paciente> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> getById(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Paciente> create(@RequestBody PacienteRequest dto) {
        Paciente paciente = new Paciente();
        paciente.setNombre(dto.getNombre());
        paciente.setRut(dto.getRut());
        paciente.setFechaNacimiento(dto.getFechaNacimiento());
        paciente.setDiagnostico(dto.getDiagnostico());
        paciente.setCama(dto.getCama());
        return ResponseEntity.ok(repo.save(paciente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> update(@PathVariable Long id, @RequestBody PacienteRequest dto) {
        return repo.findById(id).map(p -> {
            p.setNombre(dto.getNombre());
            p.setRut(dto.getRut());
            p.setFechaNacimiento(dto.getFechaNacimiento());
            p.setDiagnostico(dto.getDiagnostico());
            p.setCama(dto.getCama());
            return ResponseEntity.ok(repo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
