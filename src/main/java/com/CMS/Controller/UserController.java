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
@RequestMapping("/api")
// Allow local dev servers (3000 and 3001). Adjust/remove in production.
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class UserController {
    
    @Autowired
    private UserService userService;
    

    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String email = request.get("email");
        String password = request.get("password");
        
        if (userService.getUserByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered. Please login."));
        }
        
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole("USER");
        user.setAccountNumber("ACC" + System.currentTimeMillis());
        
        String[] accountTypes = {"Salary Account", "Savings Account", "Current Account"};
        String randomType = accountTypes[new java.util.Random().nextInt(3)];
        user.setAccountType(randomType);
        
        java.util.Random random = new java.util.Random();
        double minBalance = randomType.equals("Salary Account") ? 0.0 : 500.0;
        double randomBalance = minBalance + (random.nextDouble() * 50000);
        user.setAccountBalance(Math.round(randomBalance * 100.0) / 100.0);
        
        User savedUser = userService.registerUser(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully", "userId", savedUser.getUserId()));
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        
        Optional<User> user = userService.loginUser(email, password);
        if (user.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("user", user.get());
            response.put("message", "Login successful");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid email or password"));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserDashboard(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @Autowired
    private ComplaintService complaintService;
    
    @GetMapping("/manager/dashboard")
    public ResponseEntity<?> getManagerDashboard() {
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("activeCount", complaintService.countActiveComplaints());
        dashboard.put("closedCount", complaintService.countClosedComplaints());
        dashboard.put("pendingCount", complaintService.countByStatus("Pending"));
        dashboard.put("inProgressCount", complaintService.countByStatus("In Progress"));
        dashboard.put("totalUsers", userService.getAllUsers().size());
        dashboard.put("billingCount", complaintService.countByType("billing"));
        dashboard.put("serviceCount", complaintService.countByType("service"));
        dashboard.put("technicalCount", complaintService.countByType("technical"));
        dashboard.put("accountCount", complaintService.countByType("account"));
        dashboard.put("otherCount", complaintService.countByType("other"));
        
        // Timeline data for last 7 days
        List<Complaint> resolved = complaintService.getResolvedComplaints();
        java.time.LocalDate today = java.time.LocalDate.now();
        List<java.util.Map<String, Object>> timelineData = new java.util.ArrayList<>();
        
        for (int i = 6; i >= 0; i--) {
            java.time.LocalDate date = today.minusDays(i);
            long count = resolved.stream()
                .filter(c -> c.getResolvedDate() != null && c.getResolvedDate().equals(date))
                .count();
            java.util.Map<String, Object> data = new java.util.HashMap<>();
            data.put("day", i);
            data.put("count", count);
            timelineData.add(data);
        }
        
        dashboard.put("timelineData", timelineData);
        dashboard.put("avgResolutionTime", complaintService.getAverageResolutionTime());
        return ResponseEntity.ok(dashboard);
    }
    
    @GetMapping("/manager/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
