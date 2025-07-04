package com.ems.backend.repository;

import com.ems.backend.entity.Employee;
import com.ems.backend.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {
    Optional<Team> findByName(String name);
//    Optional<Team> findByMembersContaining(Employee employee);
    // In TeamRepository
    List<Team> findByMembersContaining(Employee employee);
}
