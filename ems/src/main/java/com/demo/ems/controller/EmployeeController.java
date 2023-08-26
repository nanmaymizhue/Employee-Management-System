package com.demo.ems.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.demo.ems.entity.Employee;
import com.demo.ems.service.EmployeeService;
import com.demo.ems.util.ExcelGenerator;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

import jakarta.servlet.http.HttpServletResponse;

@CrossOrigin
@RestController
@RequestMapping("employee")
public class EmployeeController {
	
	@Autowired
	public EmployeeService employeeService;
	
	@GetMapping
	public List<Employee> getAllEmployees(){
		List<Employee> employees = employeeService.getAllEmployees();	
		return employees;
	}
	
	@GetMapping("{id}")
	public Optional<Employee> findEmployeeById(@PathVariable Integer id) {
		return employeeService.findEmployeeById(id);

	}
	
	@GetMapping("/name/{name}")
	public List<Employee> searchEmployee(@PathVariable String name){
		return employeeService.searchEmployee(name);
	}
	
	@PostMapping
	public ResponseEntity<Employee> saveEmployee(@RequestBody Employee employee){
		Employee result = employeeService.saveNewEmployee(employee);
		return ResponseEntity.ok(result);
	}
	
	
	
	

	@PostMapping("/image")
	public Map<String, String> uploadImage(@RequestBody MultipartFile image){

		Map<String, String> response = new HashMap<>();
	    Resource imageResource =employeeService.uploadProfileImage(image);
	    
	    if (imageResource != null) {
		    response.put("img", imageResource.getFilename());
	        return response;
	    } else {
	        return null;
	    }	   
	  
	}
	
	@GetMapping("/image/{name}")
	public ResponseEntity<Resource> getProfileImage(@PathVariable String name) {
	    Resource imageResource = employeeService.getProfileImage(name);
	    if (imageResource != null) {
	        HttpHeaders headers = new HttpHeaders();
	        headers.setContentType(MediaType.IMAGE_JPEG);

	        return ResponseEntity.ok()
	                .headers(headers)
	                .body(imageResource);
	    } else {
	        return ResponseEntity.notFound().build();
	    }
	}

	
	
	@GetMapping("/{id}/image")
	public ResponseEntity<Resource> getProfileImage(@PathVariable Integer id) {
	    Resource imageResource = employeeService.getProfileImage(id);
	    if (imageResource != null) {
	        HttpHeaders headers = new HttpHeaders();
	        headers.setContentType(MediaType.IMAGE_JPEG);

	        return ResponseEntity.ok()
	                .headers(headers)
	                .body(imageResource);
	    } else {
	        return ResponseEntity.notFound().build();
	    }
	}
	
	@DeleteMapping("{id}")
	public void deleteEmployeeById(@PathVariable Integer id) {
		 employeeService.deleteEmployeeById(id);
//		 return "Successfully deleted";
	}
	
	@PutMapping("{id}")
	public ResponseEntity<Employee> updateEmployee(@PathVariable Integer id,@RequestBody Employee employee) {
		Employee result=employeeService.updateEmployee(id,employee);
		return ResponseEntity.ok(result);
	}

	
	 @GetMapping("/export-to-excel")
	    public void exportIntoExcelFile(HttpServletResponse response) throws IOException {
	        response.setContentType("application/octet-stream");
	        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
	        String currentDateTime = dateFormatter.format(new Date());

	        String headerKey = "Content-Disposition";
	        String headerValue = "attachment; filename=employee" + currentDateTime + ".xlsx";
	        response.setHeader(headerKey, headerValue);

	        List <Employee> listOfEmployees =employeeService.getAllEmployees();
	        ExcelGenerator generator = new ExcelGenerator(listOfEmployees);
	        generator.generateExcelFile(response);
	    }	 
	 
	 
	 @PostMapping("/import")
	    public void importEmployees(@RequestParam("file") MultipartFile file) {
	        employeeService.importEmployeeFromExcel(file);
//	        return ResponseEntity.status(HttpStatus.CREATED).body("Employees imported successfully.");
	    }

}
