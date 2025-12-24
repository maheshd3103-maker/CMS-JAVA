package com.CMS.Service;

import com.CMS.Entity.Assignment;
import com.CMS.Entity.Agent;
import com.CMS.Entity.Complaint;
import com.CMS.Repository.AssignmentRepository;
import com.CMS.Repository.ComplaintRepository;
import com.CMS.Repository.AgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {
    
    @Autowired
    private AssignmentRepository assignmentRepository;
    
    @Autowired
    private ComplaintRepository complaintRepository;
    
    @Autowired
    private AgentRepository agentRepository;
    
    public Assignment assignComplaintToAgent(Long complaintId, Long agentId, String managerName) {
        Optional<Complaint> complaint = complaintRepository.findById(complaintId);
        Optional<Agent> agent = agentRepository.findById(agentId);
        
        if (complaint.isPresent() && agent.isPresent()) {
            // Update complaint status and assigned agent
            Complaint c = complaint.get();
            c.setStatus("ASSIGNED");
            c.setAssignedAgent(agent.get());
            complaintRepository.save(c);
            
            // Create assignment record
            Assignment assignment = new Assignment();
            assignment.setComplaint(c);
            assignment.setAgent(agent.get());
            assignment.setAssignedDate(LocalDateTime.now());
            assignment.setAssignedBy(managerName);
            
            return assignmentRepository.save(assignment);
        }
        return null;
    }
    
    public List<Assignment> getAssignmentsByAgent(Agent agent) {
        return assignmentRepository.findByAgent(agent);
    }
    
    public Optional<Assignment> getAssignmentByComplaint(Complaint complaint) {
        return assignmentRepository.findByComplaint(complaint);
    }
    
    public List<Assignment> getAssignmentsByManager(String managerName) {
        return assignmentRepository.findByAssignedBy(managerName);
    }
}