package com.duoc.producer.controller;

import com.duoc.producer.dto.MensajeRequest;
import com.duoc.producer.dto.PublicacionResponse;
import com.duoc.producer.model.MensajePublicado;
import com.duoc.producer.service.ProducerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para publicar mensajes genéricos en la cola RabbitMQ.
 * 
 * Endpoints:
 *   POST /mensajes/publicar  → publica un texto libre en la cola
 *   GET  /mensajes/enviados  → lista todos los mensajes publicados (desde Oracle)
 */
@RestController
@RequestMapping("/mensajes")
public class MensajeController {

    private final ProducerService producerService;

    public MensajeController(ProducerService producerService) {
        this.producerService = producerService;
    }

    /**
     * Publica un mensaje genérico en la cola RabbitMQ.
     * 
     * Body esperado:
     * {
     *   "mensaje": "Hola desde el productor!"
     * }
     */
    @PostMapping("/publicar")
    public ResponseEntity<PublicacionResponse> publicarMensaje(@RequestBody MensajeRequest request) {
        if (request.getMensaje() == null || request.getMensaje().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(new PublicacionResponse(false, "El campo 'mensaje' no puede estar vacío", null));
        }
        PublicacionResponse response = producerService.publicarMensajeGenerico(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Lista todos los mensajes que este productor ha publicado (registro Oracle).
     */
    @GetMapping("/enviados")
    public ResponseEntity<List<MensajePublicado>> listarEnviados() {
        return ResponseEntity.ok(producerService.listarPublicados());
    }
}
