package com.CMS.Repository;

import com.CMS.Entity.Assignment;
import com.CMS.Entity.Agent;
import com.CMS.Entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    Optional<Assignment> findByComplaint(Complaint complaint);
    List<Assignment> findByAgent(Agent agent);
    List<Assignment> findByAssignedBy(String assignedBy);
}