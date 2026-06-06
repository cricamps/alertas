package com.medicas.bff.repository;

import com.medicas.bff.model.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Long> {
    List<Alerta> findByPacienteId(Long pacienteId);
    List<Alerta> findByAtendida(Boolean atendida);
}
