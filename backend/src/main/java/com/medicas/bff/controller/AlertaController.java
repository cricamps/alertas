package com.medicas.bff.controller;

import com.medicas.bff.model.Alerta;
import com.medicas.bff.repository.AlertaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@CrossOrigin(origins = "*")
public class AlertaController {

    private final AlertaRepository repo;

    public AlertaController(AlertaRepository repo) {
        this.repo = repo;
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
    public Alerta create(@RequestBody Alerta alerta) {
        return repo.save(alerta);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Alerta> update(@PathVariable Long id, @RequestBody Alerta datos) {
        return repo.findById(id).map(a -> {
            a.setTipoAlerta(datos.getTipoAlerta());
            a.setDescripcion(datos.getDescripcion());
            a.setNivel(datos.getNivel());
            a.setAtendida(datos.getAtendida());
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
