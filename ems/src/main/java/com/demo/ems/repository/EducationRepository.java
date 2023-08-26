package com.demo.ems.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.demo.ems.entity.Education;

@Repository
public interface EducationRepository extends JpaRepository<Education,Integer>{

}
