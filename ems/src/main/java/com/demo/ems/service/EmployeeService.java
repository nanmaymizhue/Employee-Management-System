package com.demo.ems.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import com.demo.ems.entity.Employee;



public interface EmployeeService{

	List<Employee> getAllEmployees();		
	
	Optional<Employee> findEmployeeById(Integer id);
	
	List<Employee> searchEmployee(String name);
	
	Employee saveNewEmployee(Employee employee);
	
	Employee updateEmployee(Integer id,Employee employee);
	
	void deleteEmployeeById(Integer id);	

    void importEmployeeFromExcel(MultipartFile file);	
	
	Resource getProfileImage(Integer id);
	
	Resource getProfileImage(String fileName);
	
	Resource uploadProfileImage(MultipartFile image);
}
