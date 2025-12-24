package com.CMS.Service;

import com.CMS.Entity.Complaint;
import com.CMS.Entity.User;
import com.CMS.Repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {
    
    @Autowired
    private ComplaintRepository complaintRepository;
    
    public Complaint createComplaint(Complaint complaint) {
        complaint.setSubmittedDate(LocalDate.now());
        complaint.setStatus("SUBMITTED");
        complaint.setTrackingId(generateTrackingId());
        return complaintRepository.save(complaint);
    }
    
    public Optional<Complaint> getComplaintByTrackingId(String trackingId) {
        return complaintRepository.findByTrackingId(trackingId);
    }
    
    public List<Complaint> getComplaintsByUser(User user) {
        return complaintRepository.findByUser(user);
    }
    
    public List<Complaint> getActiveComplaints() {
        return complaintRepository.findByStatusIn(Arrays.asList("SUBMITTED", "ASSIGNED", "IN_PROGRESS"));
    }
    
    public List<Complaint> getComplaintHistory() {
        return complaintRepository.findByStatus("Resolved");
    }
    
    public Complaint updateComplaintStatus(Long complaintId, String status) {
        Optional<Complaint> complaint = complaintRepository.findById(complaintId);
        if (complaint.isPresent()) {
            Complaint c = complaint.get();
            c.setStatus(status);
            if (status.equals("RESOLVED")) {
                c.setResolvedDate(LocalDate.now());
            }
            return complaintRepository.save(c);
        }
        return null;
    }
    
    public Complaint markAsSolved(Long complaintId, String resolutionNotes) {
        Optional<Complaint> complaint = complaintRepository.findById(complaintId);
        if (complaint.isPresent()) {
            Complaint c = complaint.get();
            c.setStatus("SOLVED");
            c.setResolutionNotes(resolutionNotes);
            return complaintRepository.save(c);
        }
        return null;
    }
    
    public Complaint resolveComplaint(Long complaintId) {
        Optional<Complaint> complaint = complaintRepository.findById(complaintId);
        if (complaint.isPresent()) {
            Complaint c = complaint.get();
            c.setStatus("RESOLVED");
            c.setResolvedDate(LocalDate.now());
            return complaintRepository.save(c);
        }
        return null;
    }
    
    public List<Complaint> getSubmittedComplaints() {
        return complaintRepository.findByStatus("SUBMITTED");
    }
    
    public List<Complaint> getSolvedComplaints() {
        return complaintRepository.findByStatus("SOLVED");
    }
    
    public long countActiveComplaints() {
        return getActiveComplaints().size();
    }
    
    public long countClosedComplaints() {
        return getComplaintHistory().size();
    }
    
    public long countByType(String type) {
        return complaintRepository.findAll().stream()
                .filter(c -> c.getComplaintType().equalsIgnoreCase(type))
                .count();
    }
    
    public long countByStatus(String status) {
        return complaintRepository.findByStatus(status).size();
    }
    
    public List<Complaint> getResolvedComplaints() {
        return complaintRepository.findByStatus("Resolved");
    }
    
    public double getAverageResolutionTime() {
        List<Complaint> resolved = getResolvedComplaints();
        if (resolved.isEmpty()) return 0;
        
        long totalDays = resolved.stream()
            .filter(c -> c.getResolvedDate() != null)
            .mapToLong(c -> java.time.temporal.ChronoUnit.DAYS.between(c.getSubmittedDate(), c.getResolvedDate()))
            .sum();
        
        return (double) totalDays / resolved.size();
    }
    
    public Optional<Complaint> getComplaintById(Long id) {
        return complaintRepository.findById(id);
    }
    
    private String generateTrackingId() {
        return "CMS" + System.currentTimeMillis();
    }
}
