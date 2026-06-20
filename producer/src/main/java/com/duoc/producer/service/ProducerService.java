package com.duoc.producer.service;

import com.duoc.producer.dto.AlertaRequest;
import com.duoc.producer.dto.MensajeRequest;
import com.duoc.producer.dto.PublicacionResponse;
import com.duoc.producer.model.MensajePublicado;
import com.duoc.producer.repository.MensajePublicadoRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Servicio que publica mensajes en la cola RabbitMQ
 * y registra cada publicación en Oracle AlertasDB.
 */
@Service
public class ProducerService {

    private final RabbitTemplate rabbitTemplate;
    private final MensajePublicadoRepository repository;

    @Value("${app.rabbitmq.queue}")
    private String queueName;

    public ProducerService(RabbitTemplate rabbitTemplate, MensajePublicadoRepository repository) {
        this.rabbitTemplate = rabbitTemplate;
        this.repository = repository;
    }

    /**
     * Publica un mensaje genérico de texto en la cola.
     */
    public PublicacionResponse publicarMensajeGenerico(MensajeRequest request) {
        String contenido = request.getMensaje();

        // Publicar en RabbitMQ
        rabbitTemplate.convertAndSend(queueName, contenido);
        System.out.println("[PRODUCTOR] Mensaje genérico publicado en cola '" + queueName + "': " + contenido);

        // Registrar en Oracle
        guardarRegistro(contenido, "GENERICO");

        return new PublicacionResponse(true, "Mensaje publicado exitosamente en la cola", contenido);
    }

    /**
     * Publica una alerta médica en la cola, con formato estructurado.
     */
    public PublicacionResponse publicarAlertaMedica(AlertaRequest request) {
        String contenido = request.toString();

        // Publicar en RabbitMQ
        rabbitTemplate.convertAndSend(queueName, contenido);
        System.out.println("[PRODUCTOR] Alerta médica publicada en cola '" + queueName + "': " + contenido);

        // Registrar en Oracle
        guardarRegistro(contenido, "ALERTA_MEDICA");

        return new PublicacionResponse(true, "Alerta médica publicada exitosamente en la cola", contenido);
    }

    /**
     * Obtiene todos los mensajes publicados registrados en Oracle.
     */
    public List<MensajePublicado> listarPublicados() {
        return repository.findAll();
    }

    /**
     * Persiste el registro de publicación en Oracle AlertasDB.
     */
    private void guardarRegistro(String contenido, String tipo) {
        MensajePublicado registro = new MensajePublicado();
        registro.setContenido(contenido);
        registro.setTipo(tipo);
        registro.setCola(queueName);
        registro.setFechaPublicacion(LocalDateTime.now());
        repository.save(registro);
    }
}
