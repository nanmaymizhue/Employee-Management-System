package com.demo.ems.service.impl;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.demo.ems.util.CFileUtils;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.demo.ems.entity.Employee;
import com.demo.ems.exception.domain.DataNotFoundException;
import com.demo.ems.repository.EducationRepository;
import com.demo.ems.repository.EmployeeRepository;
import com.demo.ems.service.EmployeeService;
import com.demo.ems.util.ExcelUtils;

@Service
public class EmployeeServiceImpl implements EmployeeService{

	@Autowired
	public EmployeeRepository employeeRepository;
	
	@Autowired
	public EducationRepository educationRepository;
	
	@Override
	public List<Employee> getAllEmployees() {
	return employeeRepository.findAll();
		
	}	

	@Override
	public Optional<Employee> findEmployeeById(Integer id) {
		return employeeRepository.findById(id);
	}

	@Override
	public List<Employee> searchEmployee(String name) {		
		return employeeRepository.search(name);
	}	

	@Override
	public Employee saveNewEmployee(Employee employee) {
		Employee e = employeeRepository.save(employee);
		
		Employee tempEmployee=new Employee();
		tempEmployee.setId(e.getId());
		employee.getEducation().forEach(education->{
			education.setEmployee(tempEmployee);
			educationRepository.save(education);
		});
		return e;
	}

	
	@Override
	public Employee updateEmployee(Integer id, Employee employee) {
		Optional<Employee> employeeOptional=findEmployeeById(id);
		if(employeeOptional.isPresent()) {
			Employee tempEmployee=new Employee();
			tempEmployee.setId(id);
			
			employee.setId(id);
			employee.getEducation().forEach(education->{
				education.setEmployee(tempEmployee);
				
				 educationRepository.save(education);
			});		
			return employeeRepository.save(employee);
		}else{
		     throw new DataNotFoundException("Employee with id [" + id + "] does not exist.");
		 }

	}
	
	@Override
	public void deleteEmployeeById(Integer id) {
		Optional<Employee> employee=findEmployeeById(id);
		if(employee.isPresent()) {
			employeeRepository.delete(employee.get());
		}else {
			throw new DataNotFoundException("Employee with id [" + id + "] does not exist.");
		}
	}


	@Override
	public void importEmployeeFromExcel(MultipartFile file) {
	  try {
            List<Employee> employees = ExcelUtils.parseExcelFile(file.getInputStream());
            employeeRepository.saveAll(employees);
        } catch (IOException e) {
            throw new RuntimeException("Failed to import employees from Excel file.", e);
        }		
	}


	
	@Override
	public Resource getProfileImage(Integer id) {
	    Optional<Employee> employeeOptional = employeeRepository.findById(id);
	    if (employeeOptional.isPresent()) {
	        Employee employee = employeeOptional.get();
	        String fileName = employee.getImage();
	        return new FileSystemResource("C:\\pj\\ems\\upload\\" + fileName);
	    }
	    return null;
	}

	@Override
	public Resource getProfileImage(String fileName) {
		if(io.micrometer.common.util.StringUtils.isNotBlank(fileName)){
			return new FileSystemResource("C:\\pj\\ems\\upload\\" + fileName);
		}
		return null;
	}

	@Override
	public Resource uploadProfileImage(MultipartFile image) {		
		Resource resource = image.getResource();
		String fileName = "";
		
			try {
				fileName = CFileUtils.saveFile(resource.getInputStream(), resource.getFilename());
				
			} catch (IOException e) {
				
				e.printStackTrace();
			}
			//	return fileName;
			return resource;

   }

}




