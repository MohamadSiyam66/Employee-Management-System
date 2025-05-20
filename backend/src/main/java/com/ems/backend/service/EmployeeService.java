package com.ems.backend.service;


import com.ems.backend.entity.Employee;

import java.util.List;

public interface EmployeeService {
    Employee saveEmployee(Employee employee);
    List<Employee> getAllEmployees();
    Employee updateEmployee(Long id, Employee employee);
    void deleteEmployee(Long id);
}
