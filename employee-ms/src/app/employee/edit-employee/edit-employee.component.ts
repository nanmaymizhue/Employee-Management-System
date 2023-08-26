
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Employee } from 'src/app/model/employee';
import { EmployeeService } from 'src/app/service/employee.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {
  updateEmployeeForm: FormGroup;
  idToUpdate!: number;
  employee: Employee[]| undefined;

  @ViewChild('content') modalContent: any;

  profileImageUrl = 'assets/defaultProfile.png';

  selectedImage: string | ArrayBuffer | null = null;

  imageName!: string;


  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private fb:FormBuilder,
   
  ) {
    this.updateEmployeeForm =new FormGroup({
      id:new FormControl(''),
      employeeId: new FormControl('',Validators.required),
      name:new FormControl('',Validators.required),
      position:new FormControl('',Validators.required),
      department: new FormControl('',Validators.required),
      address: new FormControl('',Validators.required),
      gender:new FormControl('',Validators.required),
      nrc: new FormControl('',Validators.required),
      dob: new FormControl('',Validators.required),
      fatherName:new FormControl('',Validators.required),
      license: new FormControl('',Validators.required),
      taxNo:new FormControl('',Validators.required),
      image: new FormControl(this.imageName),
      education: this.fb.array([],Validators.required),
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.idToUpdate = param['id'];
      this.employeeService.getEmployeeById(this.idToUpdate).subscribe((employee: any) => {
        this.employee = employee;          

        console.log("EEE",employee);
        this.updateEmployeeForm.patchValue({          
          id:this.idToUpdate,
          employeeId: employee.employeeId,
          name: employee.name,
          position: employee.position,
          department: employee.department,
          address: employee.address,
          gender: employee.gender,
          nrc: employee.nrc,
          dob: employee.dob,
          fatherName: employee.fatherName,
          license: employee.license,
          taxNo: employee.taxNo,
          image:employee.image,
          education: employee.education
        });  
        
        this.profileImageUrl = employee.image
          ? "http://localhost:8081/api/employee/image/" + employee.image
          : 'assets/defaultProfile.png';
  
        const educationArray = this.updateEmployeeForm.get('education') as FormArray;
        educationArray.clear();
  
        if (employee.education && employee.education.length > 0) {
          for (const education of employee.education) {
            const educationForm = this.fb.group({
              type: [education.type, Validators.required],
              name: [education.name, Validators.required]
            });
            educationArray.push(educationForm);
          }
        }
      });
    });
  }
 
formatDate(date: string): string {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
  const day = ('0' + dateObj.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

  submitForm(): void {
    if (this.updateEmployeeForm.valid) {
      const updatedEmployee: Employee = {
        ...this.updateEmployeeForm.value
      };  
      this.employeeService.updateEmployee(updatedEmployee).subscribe(
        (updated) => {
          this.toastr.success('Save Successful !');
          this.router.navigate(['/employee-list']);
        },
        (error) => {
          this.toastr.error('Save Fail !');
        }
      );
    } else {
      this.toastr.error('Please fill all required fields.');
    }
  }

  addRow() {
    const educationForm = this.fb.group({
      type: ['',Validators.required],
      name: ['',Validators.required]
    });
    this.education.push(educationForm);
  }

  deleteRow(index: number) {
    this.education.removeAt(index);
  }

  get education(){
    return this.updateEmployeeForm.controls["education"] as FormArray;
  }

  openModal(): void {
    this.modalService
      .open(this.modalContent, { ariaLabelledBy: 'modal-basic-title', centered: true });
     
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    console.log(file);    

    if (file) {       
      this.employeeService.saveImage(file).subscribe(
        (response:any)=>{
          this.imageName=response["img"];   
          this.updateEmployeeForm.patchValue({ image: this.imageName });       
          this.modalService.dismissAll();
          this.profileImageUrl = "http://localhost:8081/api/employee/image/" + response["img"];
      },
      (error)=>{
        this.toastr.error("Selected Fail !");
      }
     
      );
   
    }
  }   

}
