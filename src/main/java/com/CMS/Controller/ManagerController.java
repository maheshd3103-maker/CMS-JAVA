package com.CMS.Controller;

import com.CMS.Entity.Agent;
import com.CMS.Entity.Complaint;
import com.CMS.Entity.Assignment;
import com.CMS.Service.ComplaintService;
import com.CMS.Service.AgentService;
import com.CMS.Service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/manager")
@CrossOrigin(origins = "http://localhost:3000")
public class ManagerController {
    
    @Autowired
    private ComplaintService complaintService;
    
    @Autowired
    private AgentService agentService;
    
    @Autowired
    private AssignmentService assignmentService;
    
    @GetMapping("/complaints/submitted")
    public ResponseEntity<List<Complaint>> getSubmittedComplaints() {
        return ResponseEntity.ok(complaintService.getSubmittedComplaints());
    }
    
    @GetMapping("/complaints/solved")
    public ResponseEntity<List<Complaint>> getSolvedComplaints() {
        return ResponseEntity.ok(complaintService.getSolvedComplaints());
    }
    
    @GetMapping("/agents/department/{department}")
    public ResponseEntity<List<Agent>> getAgentsByDepartment(@PathVariable String department) {
        return ResponseEntity.ok(agentService.getAgentsByDepartment(department.toUpperCase()));
    }
    
    @PostMapping("/assign")
    public ResponseEntity<String> assignComplaint(@RequestBody Map<String, Object> request) {
        try {
            Long complaintId = Long.valueOf(request.get("complaintId").toString());
            String managerName = request.get("managerName").toString();
            
            Optional<Complaint> complaintOpt = complaintService.getComplaintById(complaintId);
            if (!complaintOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Complaint not found");
            }
            
            Complaint complaint = complaintOpt.get();
            
            if ("Other".equalsIgnoreCase(complaint.getComplaintType())) {
                complaintService.updateComplaintStatus(complaintId, "MANAGER_HANDLING");
                return ResponseEntity.ok("Complaint assigned to manager for direct handling");
            }
            
            Long agentId = Long.valueOf(request.get("agentId").toString());
            Assignment assignment = assignmentService.assignComplaintToAgent(complaintId, agentId, managerName);
            
            if (assignment != null) {
                return ResponseEntity.ok("Complaint assigned successfully");
            } else {
                return ResponseEntity.badRequest().body("Failed to assign complaint");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PostMapping("/resolve/{complaintId}")
    public ResponseEntity<String> resolveComplaint(@PathVariable Long complaintId) {
        Complaint resolved = complaintService.resolveComplaint(complaintId);
        if (resolved != null) {
            return ResponseEntity.ok("Complaint resolved successfully");
        } else {
            return ResponseEntity.badRequest().body("Failed to resolve complaint");
        }
    }
}