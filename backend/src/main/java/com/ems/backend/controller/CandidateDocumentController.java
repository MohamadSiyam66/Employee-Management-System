package com.ems.backend.controller;

import com.ems.backend.entity.CandidateDocument;
import com.ems.backend.service.CandidateDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/candidate")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CandidateDocumentController {
    private final CandidateDocumentService canDocService;

    @PostMapping("/upload")
    public CandidateDocument upload(@RequestBody CandidateDocument doc) {
        return canDocService.saveCandidateDoc(doc);
    }

    @GetMapping("/candidates")
    public List<CandidateDocument> getCandidateDocuments() {
        return canDocService.getAllCandidateDocuments();
    }

}
