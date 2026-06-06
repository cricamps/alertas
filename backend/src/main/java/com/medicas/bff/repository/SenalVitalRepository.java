package com.medicas.bff.repository;

import com.medicas.bff.model.SenalVital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SenalVitalRepository extends JpaRepository<SenalVital, Long> {
    List<SenalVital> findByPacienteId(Long pacienteId);
}
