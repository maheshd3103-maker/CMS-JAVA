package com.CMS.Service;

import com.CMS.Entity.Agent;
import com.CMS.Entity.Complaint;
import com.CMS.Repository.AgentRepository;
import com.CMS.Repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AgentService {
    
    @Autowired
    private AgentRepository agentRepository;
    
    @Autowired
    private ComplaintRepository complaintRepository;
    
    public Agent createAgent(Agent agent) {
        agent.setStatus("ACTIVE");
        return agentRepository.save(agent);
    }
    
    public Optional<Agent> getAgentByEmail(String email) {
        return agentRepository.findByEmail(email);
    }
    
    public List<Agent> getAgentsByDepartment(String department) {
        return agentRepository.findByDepartmentAndStatus(department, "ACTIVE");
    }
    
    public List<Complaint> getAssignedComplaints(Long agentId) {
        Optional<Agent> agent = agentRepository.findById(agentId);
        if (agent.isPresent()) {
            return complaintRepository.findByAssignedAgent(agent.get());
        }
        return List.of();
    }
    
    public List<Complaint> getAgentActiveComplaints(Long agentId) {
        Optional<Agent> agent = agentRepository.findById(agentId);
        if (agent.isPresent()) {
            return complaintRepository.findByStatusAndAssignedAgent("ASSIGNED", agent.get());
        }
        return List.of();
    }
    
    public Optional<Agent> getAgentById(Long agentId) {
        return agentRepository.findById(agentId);
    }
    
    public List<Agent> getAllActiveAgents() {
        return agentRepository.findByStatus("ACTIVE");
    }
}