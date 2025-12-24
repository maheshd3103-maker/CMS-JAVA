package com.CMS.Controller;

import com.CMS.Entity.Complaint;
import com.CMS.Entity.User;
import com.CMS.Service.ComplaintService;
import com.CMS.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/complaint")
// Allow local dev servers (3000 and 3001). Adjust/remove in production.
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ComplaintController {
    
    @Autowired
    private ComplaintService complaintService;
    
    @Autowired
    private UserService userService;
    

    
    @PostMapping("/submit")
    public ResponseEntity<?> submitComplaint(@RequestBody Map<String, Object> request) {
        String complaintType = (String) request.get("complaintType");
        String complaintDescription = (String) request.get("complaintDescription");
        String issueDate = (String) request.get("issueDate");
        Long userId = Long.valueOf(request.get("userId").toString());
        
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            Complaint complaint = new Complaint();
            complaint.setComplaintType(complaintType);
            complaint.setComplaintDescription(complaintDescription);
            complaint.setIssueDate(java.time.LocalDate.parse(issueDate));
            complaint.setUser(user.get());
            Complaint savedComplaint = complaintService.createComplaint(complaint);
            
            Map<String, Object> response = new HashMap<>();
            response.put("trackingId", savedComplaint.getTrackingId());
            response.put("suggestedSolution", getSuggestedSolution(complaintType));
            response.put("message", "Complaint submitted successfully");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
    }
    
    private String getSuggestedSolution(String complaintType) {
        return switch (complaintType.toLowerCase()) {
            case "billing" -> "Please check your recent transactions in the account statement. If you notice any discrepancies, our team will investigate and provide a detailed breakdown within 24-48 hours.";
            case "service" -> "We apologize for the service inconvenience. Our service team will contact you within 24 hours to resolve this issue. Meanwhile, you can check our service status page for updates.";
            case "technical" -> "For immediate technical assistance, try clearing your browser cache or using a different browser. Our technical team will investigate the issue and provide a solution within 24 hours.";
            case "account" -> "Please ensure you're using the correct login credentials. If you've forgotten your password, use the 'Forgot Password' option. Our support team will assist you further if needed.";
            default -> "Our team will review your complaint and provide a resolution as soon as possible. You can track the status using your tracking ID.";
        };
    }
    

    
    @GetMapping("/my-complaints/{userId}")
    public ResponseEntity<?> getMyComplaints(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            List<Complaint> complaints = complaintService.getComplaintsByUser(user.get());
            return ResponseEntity.ok(complaints);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/track/{trackingId}")
    @ResponseBody
    public Optional<Complaint> trackComplaint(@PathVariable String trackingId) {
        return complaintService.getComplaintByTrackingId(trackingId);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Complaint>> getActiveComplaints() {
        return ResponseEntity.ok(complaintService.getActiveComplaints());
    }
    
    @GetMapping("/history")
    public ResponseEntity<List<Complaint>> getComplaintHistory() {
        return ResponseEntity.ok(complaintService.getComplaintHistory());
    }
    
    @GetMapping("/details/{id}")
    public ResponseEntity<?> getComplaintDetails(@PathVariable Long id) {
        Optional<Complaint> complaint = complaintService.getComplaintById(id);
        if (complaint.isPresent()) {
            return ResponseEntity.ok(complaint.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/update-status")
    public ResponseEntity<?> updateComplaintStatus(@RequestBody Map<String, Object> request) {
        Long complaintId = Long.valueOf(request.get("complaintId").toString());
        String status = (String) request.get("status");
        complaintService.updateComplaintStatus(complaintId, status);
        return ResponseEntity.ok(Map.of("message", "Status updated successfully"));
    }
}
