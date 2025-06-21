package com.ems.backend.service;

import com.ems.backend.entity.CandidateDocument;
import com.ems.backend.repository.CandidateDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidateDocumentServiceImpl implements CandidateDocumentService {

    private final CandidateDocumentRepository repo;

    @Override
    public CandidateDocument saveCandidateDoc(CandidateDocument doc) {
        return repo.save(doc);
    }

    @Override
    public List<CandidateDocument> getAllCandidateDocuments() {
        return repo.findAll();
    }
}
