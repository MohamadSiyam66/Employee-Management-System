package com.ems.backend.service;

import com.ems.backend.entity.Employee;
import com.ems.backend.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Override
    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public Employee updateEmployee(Long id, Employee updateEmployee) {
        Optional<Employee> optionalEmployee = employeeRepository.findById(id);
        if (optionalEmployee.isPresent()) {
            Employee existingEmployee = optionalEmployee.get();
            existingEmployee.setUsername(updateEmployee.getUsername());
            existingEmployee.setPassword(updateEmployee.getPassword());
            existingEmployee.setRole(updateEmployee.getRole());
            existingEmployee.setFname(updateEmployee.getFname());
            existingEmployee.setLname(updateEmployee.getLname());
            existingEmployee.setEmail(updateEmployee.getEmail());
            existingEmployee.setPhone(updateEmployee.getPhone());
            existingEmployee.setDob(updateEmployee.getDob());
            existingEmployee.setDesignation(updateEmployee.getDesignation());

            return employeeRepository.save(existingEmployee);
        } else {
            throw new RuntimeException("Employee not found with id: " + id);
        }
    }

    @Override
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }
}
