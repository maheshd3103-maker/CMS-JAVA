package com.CMS.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RedirectController {
    
    @GetMapping("/")
    public String redirectToReact() {
        return "redirect:http://localhost:3000";
    }
}