import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from 'src/app/service/employee.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent implements OnInit {

  addEmployeeForm:FormGroup;

  educations!: FormArray;

  formBuilder: any;

  @ViewChild('content') modalContent: any;

  profileImageUrl = 'assets/defaultProfile.png';

  selectedImage: string | ArrayBuffer | null = null;

  imageName!: string;


  constructor(private modalService:NgbModal,private employeeService: EmployeeService, private fb: FormBuilder,private router:Router,private toastr:ToastrService) {
    this.addEmployeeForm =new FormGroup({
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
    this.addRow();

    this.educations = this.formBuilder.array([
      this.formBuilder.group({
        type: ['', Validators.required], 
        name: ['', Validators.required] 
      })
    ]);
  }

  get education(){
    return this.addEmployeeForm.controls["education"] as FormArray;
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

  submitForm(): void {
   if(this.addEmployeeForm.valid){
    const employeeData = this.addEmployeeForm.value;
     this.employeeService.addNewEmployee(employeeData).subscribe(
      (response) => {     
      this.toastr.success("Save Successful !");
      this.router.navigate(['/employee-list']);
    },
    (error)=>{
      this.toastr.error("Save Fail !");
    }
    );
   }else{
      this.toastr.error("Please filled all required field.")
   }
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
            this.addEmployeeForm.patchValue({ image: this.imageName });       
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



