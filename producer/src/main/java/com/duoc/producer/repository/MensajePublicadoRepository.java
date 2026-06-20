package com.duoc.producer.repository;

import com.duoc.producer.model.MensajePublicado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JPA para registros de mensajes publicados en la cola.
 */
@Repository
public interface MensajePublicadoRepository extends JpaRepository<MensajePublicado, Long> {

    List<MensajePublicado> findByTipoOrderByFechaPublicacionDesc(String tipo);
}
