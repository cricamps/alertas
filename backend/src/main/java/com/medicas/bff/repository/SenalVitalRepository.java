package com.medicas.bff.repository;

import com.medicas.bff.model.SenalVital;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SenalVitalRepository extends JpaRepository<SenalVital, Long> {
    List<SenalVital> findByPacienteId(Long pacienteId);
}
