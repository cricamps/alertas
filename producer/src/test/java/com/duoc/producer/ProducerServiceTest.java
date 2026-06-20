package com.duoc.producer;

import com.duoc.producer.dto.AlertaRequest;
import com.duoc.producer.dto.MensajeRequest;
import com.duoc.producer.dto.PublicacionResponse;
import com.duoc.producer.model.MensajePublicado;
import com.duoc.producer.repository.MensajePublicadoRepository;
import com.duoc.producer.service.ProducerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Pruebas unitarias del ProducerService.
 * Verifica que los mensajes se publican en RabbitMQ
 * y se registran correctamente en Oracle.
 */
@ExtendWith(MockitoExtension.class)
class ProducerServiceTest {

    @Mock
    private RabbitTemplate rabbitTemplate;

    @Mock
    private MensajePublicadoRepository repository;

    @InjectMocks
    private ProducerService producerService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(producerService, "queueName", "cola_Grupo2");
    }

    @Test
    void publicarMensajeGenerico_debePublicarEnColaYGuardarEnOracle() {
        // Arrange
        MensajeRequest request = new MensajeRequest("Mensaje de prueba");
        MensajePublicado savedEntity = new MensajePublicado();
        when(repository.save(any(MensajePublicado.class))).thenReturn(savedEntity);

        // Act
        PublicacionResponse response = producerService.publicarMensajeGenerico(request);

        // Assert
        assertTrue(response.isExito());
        assertEquals("Mensaje de prueba", response.getContenidoPublicado());
        verify(rabbitTemplate, times(1)).convertAndSend(eq("cola_Grupo2"), eq("Mensaje de prueba"));
        verify(repository, times(1)).save(any(MensajePublicado.class));
    }

    @Test
    void publicarAlertaMedica_debeFormatearYPublicarEnCola() {
        // Arrange
        AlertaRequest request = new AlertaRequest();
        request.setPaciente("María González");
        request.setTipoAlerta("Frecuencia cardiaca elevada");
        request.setDescripcion("FC: 140 bpm");
        request.setNivelUrgencia("ALTO");

        MensajePublicado savedEntity = new MensajePublicado();
        when(repository.save(any(MensajePublicado.class))).thenReturn(savedEntity);

        // Act
        PublicacionResponse response = producerService.publicarAlertaMedica(request);

        // Assert
        assertTrue(response.isExito());
        assertTrue(response.getContenidoPublicado().contains("María González"));
        assertTrue(response.getContenidoPublicado().contains("ALTO"));
        assertTrue(response.getContenidoPublicado().contains("[ALERTA MÉDICA]"));
        verify(rabbitTemplate, times(1)).convertAndSend(eq("cola_Grupo2"), anyString());
        verify(repository, times(1)).save(any(MensajePublicado.class));
    }

    @Test
    void listarPublicados_debeRetornarRegistrosDeOracle() {
        // Arrange
        MensajePublicado m1 = new MensajePublicado();
        MensajePublicado m2 = new MensajePublicado();
        when(repository.findAll()).thenReturn(List.of(m1, m2));

        // Act
        List<MensajePublicado> result = producerService.listarPublicados();

        // Assert
        assertEquals(2, result.size());
        verify(repository, times(1)).findAll();
    }
}
