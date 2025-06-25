package com.ems.backend.service;

import com.ems.backend.entity.Team;

import java.util.List;

public interface TeamService {
    Team createTeam(Team team);
    List<Team> getAllTeams();
    Team getTeamById(Integer id);
}