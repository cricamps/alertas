package com.duoc.producer.controller;

import com.duoc.producer.dto.AlertaRequest;
import com.duoc.producer.dto.PublicacionResponse;
import com.duoc.producer.service.ProducerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para publicar alertas médicas en la cola RabbitMQ.
 * Contexto: Sistema SaludAlerta - DSY2206 Grupo 2
 * 
 * Endpoints:
 *   POST /alertas/publicar  → publica una alerta médica estructurada en la cola
 */
@RestController
@RequestMapping("/alertas")
public class AlertaController {

    private final ProducerService producerService;

    public AlertaController(ProducerService producerService) {
        this.producerService = producerService;
    }

    /**
     * Publica una alerta médica en la cola RabbitMQ.
     * 
     * Body esperado:
     * {
     *   "paciente": "Juan Pérez",
     *   "tipoAlerta": "Presión arterial elevada",
     *   "descripcion": "PA: 180/110 mmHg - Requiere atención inmediata",
     *   "nivelUrgencia": "ALTO"
     * }
     */
    @PostMapping("/publicar")
    public ResponseEntity<PublicacionResponse> publicarAlerta(@RequestBody AlertaRequest request) {
        // Validación básica
        if (request.getPaciente() == null || request.getPaciente().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new PublicacionResponse(false, "El campo 'paciente' es obligatorio", null));
        }
        if (request.getTipoAlerta() == null || request.getTipoAlerta().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new PublicacionResponse(false, "El campo 'tipoAlerta' es obligatorio", null));
        }
        if (request.getNivelUrgencia() == null || request.getNivelUrgencia().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new PublicacionResponse(false, "El campo 'nivelUrgencia' es obligatorio (ALTO/MEDIO/BAJO)", null));
        }

        PublicacionResponse response = producerService.publicarAlertaMedica(request);
        return ResponseEntity.ok(response);
    }
}
