package com.demo.ems.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.demo.ems.entity.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Integer>{

	
	@Query("SELECT e FROM  Employee e WHERE CONCAT(e.employeeId,' ',e.name, ' ', e.position, ' ', e.department, ' ', e.nrc, ' ', e.license, ' ',  e.taxNo, ' ') LIKE %?1%")
	List<Employee> search(String name);
	
	@Query("SELECT e FROM Employee e")
	List<Employee> findAllWithImagePaths();
}
