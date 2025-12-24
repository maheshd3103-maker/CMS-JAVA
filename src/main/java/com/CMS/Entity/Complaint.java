package com.CMS.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "complaints")
public class Complaint {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long complaintId;
    
    @Column(nullable = false, unique = true)
    private String trackingId;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String complaintType;
    
    @Column(nullable = false, length = 1000)
    private String complaintDescription;
    
    @Column(nullable = false)
    private LocalDate issueDate;
    
    @Column(nullable = false)
    private LocalDate submittedDate;
    
    @Column(nullable = false)
    private String status;
    
    private LocalDate resolvedDate;
    
    @ManyToOne
    @JoinColumn(name = "assigned_agent_id")
    private Agent assignedAgent;
    
    private String resolutionNotes;
    
    public Complaint() {}
    
    public Long getComplaintId() {
        return complaintId;
    }
    
    public void setComplaintId(Long complaintId) {
        this.complaintId = complaintId;
    }
    
    public String getTrackingId() {
        return trackingId;
    }
    
    public void setTrackingId(String trackingId) {
        this.trackingId = trackingId;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getComplaintType() {
        return complaintType;
    }
    
    public void setComplaintType(String complaintType) {
        this.complaintType = complaintType;
    }
    
    public String getComplaintDescription() {
        return complaintDescription;
    }
    
    public void setComplaintDescription(String complaintDescription) {
        this.complaintDescription = complaintDescription;
    }
    
    public LocalDate getIssueDate() {
        return issueDate;
    }
    
    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }
    
    public LocalDate getSubmittedDate() {
        return submittedDate;
    }
    
    public void setSubmittedDate(LocalDate submittedDate) {
        this.submittedDate = submittedDate;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public LocalDate getResolvedDate() {
        return resolvedDate;
    }
    
    public void setResolvedDate(LocalDate resolvedDate) {
        this.resolvedDate = resolvedDate;
    }
    
    public Agent getAssignedAgent() {
        return assignedAgent;
    }
    
    public void setAssignedAgent(Agent assignedAgent) {
        this.assignedAgent = assignedAgent;
    }
    
    public String getResolutionNotes() {
        return resolutionNotes;
    }
    
    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }
}
