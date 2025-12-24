package com.CMS.Controller;

import com.CMS.Entity.Agent;
import com.CMS.Entity.Complaint;
import com.CMS.Service.AgentService;
import com.CMS.Service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/agent")
// Allow local dev servers (3000 and 3001). Adjust/remove in production.
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AgentController {
    
    @Autowired
    private AgentService agentService;
    
    @Autowired
    private ComplaintService complaintService;
    
    @GetMapping("/login")
    public ResponseEntity<Agent> login(@RequestParam String email, @RequestParam String password) {
        Optional<Agent> agent = agentService.getAgentByEmail(email);
        if (agent.isPresent() && agent.get().getPassword().equals(password)) {
            return ResponseEntity.ok(agent.get());
        }
        return ResponseEntity.badRequest().build();
    }
    
    @GetMapping("/{agentId}/complaints")
    public ResponseEntity<List<Complaint>> getAssignedComplaints(@PathVariable Long agentId) {
        return ResponseEntity.ok(agentService.getAssignedComplaints(agentId));
    }
    
    @GetMapping("/{agentId}/complaints/active")
    public ResponseEntity<List<Complaint>> getActiveComplaints(@PathVariable Long agentId) {
        return ResponseEntity.ok(agentService.getAgentActiveComplaints(agentId));
    }
    
    @PostMapping("/complaint/{complaintId}/start")
    public ResponseEntity<String> startWorkingOnComplaint(@PathVariable Long complaintId) {
        Complaint updated = complaintService.updateComplaintStatus(complaintId, "IN_PROGRESS");
        if (updated != null) {
            return ResponseEntity.ok("Started working on complaint");
        }
        return ResponseEntity.badRequest().body("Failed to update complaint status");
    }
    
    @PostMapping("/complaint/{complaintId}/solve")
    public ResponseEntity<String> solveComplaint(@PathVariable Long complaintId, @RequestBody Map<String, String> request) {
        String resolutionNotes = request.get("resolutionNotes");
        Complaint solved = complaintService.markAsSolved(complaintId, resolutionNotes);
        if (solved != null) {
            return ResponseEntity.ok("Complaint marked as solved");
        }
        return ResponseEntity.badRequest().body("Failed to solve complaint");
    }
    
    @GetMapping("/{agentId}/complaints/history")
    public ResponseEntity<List<Complaint>> getComplaintHistory(@PathVariable Long agentId) {
        Optional<Agent> agent = agentService.getAgentById(agentId);
        if (agent.isPresent()) {
            List<Complaint> allComplaints = agentService.getAssignedComplaints(agentId);
            List<Complaint> history = allComplaints.stream()
                .filter(c -> "RESOLVED".equals(c.getStatus()))
                .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(history);
        }
        return ResponseEntity.ok(List.of());
    }
    public ResponseEntity<Map<String, Object>> getDashboardStats(@PathVariable Long agentId) {
        List<Complaint> assigned = agentService.getAssignedComplaints(agentId);
        List<Complaint> active = agentService.getAgentActiveComplaints(agentId);
        
        long solved = assigned.stream().filter(c -> "SOLVED".equals(c.getStatus())).count();
        long resolved = assigned.stream().filter(c -> "RESOLVED".equals(c.getStatus())).count();
        
        return ResponseEntity.ok(Map.of(
            "totalAssigned", assigned.size(),
            "active", active.size(),
            "solved", solved,
            "resolved", resolved
        ));
    }
}