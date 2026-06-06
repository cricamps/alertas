package com.medicas.bff.controller;

import com.medicas.bff.dto.AlertaRequest;
import com.medicas.bff.model.Alerta;
import com.medicas.bff.repository.AlertaRepository;
import com.medicas.bff.repository.PacienteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@CrossOrigin(origins = { "http://localhost:4200", "https://medicasapimgrupo2s3.azure-api.net" })
public class AlertaController {

    private final AlertaRepository repo;
    private final PacienteRepository pacienteRepo;

    public AlertaController(AlertaRepository repo, PacienteRepository pacienteRepo) {
        this.repo = repo;
        this.pacienteRepo = pacienteRepo;
    }

    @GetMapping
    public List<Alerta> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alerta> getById(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/paciente/{pacienteId}")
    public List<Alerta> getByPaciente(@PathVariable Long pacienteId) {
        return repo.findByPacienteId(pacienteId);
    }

    @GetMapping("/pendientes")
    public List<Alerta> getPendientes() {
        return repo.findByAtendida(false);
    }

    @PostMapping
    public ResponseEntity<Alerta> create(@RequestBody AlertaRequest dto) {
        return pacienteRepo.findById(dto.getPacienteId()).map(paciente -> {
            Alerta alerta = new Alerta();
            alerta.setPaciente(paciente);
            alerta.setTipoAlerta(dto.getTipoAlerta());
            alerta.setDescripcion(dto.getDescripcion());
            alerta.setNivel(dto.getNivel());
            alerta.setAtendida(dto.getAtendida() != null ? dto.getAtendida() : false);
            alerta.setFechaAlerta(LocalDateTime.now());
            return ResponseEntity.ok(repo.save(alerta));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Alerta> update(@PathVariable Long id, @RequestBody AlertaRequest dto) {
        return repo.findById(id).map(a -> {
            a.setTipoAlerta(dto.getTipoAlerta());
            a.setDescripcion(dto.getDescripcion());
            a.setNivel(dto.getNivel());
            if (dto.getAtendida() != null) a.setAtendida(dto.getAtendida());
            return ResponseEntity.ok(repo.save(a));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
