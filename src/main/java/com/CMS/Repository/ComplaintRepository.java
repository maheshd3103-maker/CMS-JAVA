package com.CMS.Repository;

import com.CMS.Entity.Complaint;
import com.CMS.Entity.User;
import com.CMS.Entity.Agent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Optional<Complaint> findByTrackingId(String trackingId);
    List<Complaint> findByUser(User user);
    List<Complaint> findByStatus(String status);
    List<Complaint> findByStatusIn(List<String> statuses);
    List<Complaint> findByAssignedAgent(Agent agent);
    List<Complaint> findByComplaintType(String complaintType);
    List<Complaint> findByStatusAndAssignedAgent(String status, Agent agent);
}
