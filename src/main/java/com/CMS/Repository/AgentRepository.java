package com.CMS.Repository;

import com.CMS.Entity.Agent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {
    Optional<Agent> findByEmail(String email);
    List<Agent> findByDepartment(String department);
    List<Agent> findByStatus(String status);
    List<Agent> findByDepartmentAndStatus(String department, String status);
}