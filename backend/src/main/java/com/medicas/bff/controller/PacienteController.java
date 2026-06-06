package com.medicas.bff.controller;

import com.medicas.bff.model.Paciente;
import com.medicas.bff.repository.PacienteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
@CrossOrigin(origins = "*")
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
    public Paciente create(@RequestBody Paciente paciente) {
        return repo.save(paciente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> update(@PathVariable Long id, @RequestBody Paciente datos) {
        return repo.findById(id).map(p -> {
            p.setNombre(datos.getNombre());
            p.setRut(datos.getRut());
            p.setFechaNacimiento(datos.getFechaNacimiento());
            p.setDiagnostico(datos.getDiagnostico());
            p.setCama(datos.getCama());
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
