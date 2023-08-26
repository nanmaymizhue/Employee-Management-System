import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/model/employee';
import { EmployeeService } from 'src/app/service/employee.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css']
})
export class EmployeeDetailComponent implements OnInit{

  employee:Employee | undefined;
  id!: number;
  profileImageUrl!: string;

  constructor(private route:ActivatedRoute,private employeeService:EmployeeService){

  }

  ngOnInit(){
      this.route.params.subscribe((param)=>{
          this.id =param['id'];
      })
      this.employeeService.getEmployeeById(this.id).subscribe((employee:any)=>{
        this.employee = employee;
        console.log("employee",employee);
        this.profileImageUrl = employee.image
          ? "http://localhost:8081/api/employee/image/" + employee.image
          : 'assets/defaultProfile.png';
      })  
  }
  
  
}
