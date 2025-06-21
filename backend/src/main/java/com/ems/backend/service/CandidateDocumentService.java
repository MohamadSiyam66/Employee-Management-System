package com.ems.backend.service;

import com.ems.backend.entity.CandidateDocument;

import java.util.List;

public interface CandidateDocumentService {
    CandidateDocument saveCandidateDoc(CandidateDocument doc);
    List<CandidateDocument> getAllCandidateDocuments();
}
