import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { Employee } from 'src/app/model/employee';
import { EmployeeService } from 'src/app/service/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent {

  employees: Employee[] = []; 

  defaultProfile:string ="assets/defaultProfile.png";

  searchForm:FormGroup;

  idToDelete!: number;

  employeeIdToDelete:number|null = null;

  closeResult!: string;

  fileToUpload!: File;

  p = 1;
  count = 5;

  isLoading:boolean=false;
  
  private isEmployeeIdDescending=false;  
  private isNameDescending=false;
  private isPositionDescending=false;  
  private isDepartmentDescending=false;
  private isNrcDescending=false;  
  private isLicenseDescending=false;
  private isTaxNoDescending=false;  
  private isImageDescending=false;

  constructor(private employeeService: EmployeeService,private router:Router,private modalService:NgbModal,private toastr: ToastrService) {
    this.searchForm=new FormGroup({
      name:new FormControl('')
    });
   
  }


  ngOnInit(): void { 
    this.refreshTable();   
  }

  searchName():void{
    const name=this.searchForm.value.name; 
    this.employeeService.searchEmployeeByName(name).subscribe((value)=>{
      this.employees = value;
      // console.log("EEE"+JSON.stringify(this.employees));
      for(const employee of this.employees){
        this.employeeService.getProfileImage(employee.id).subscribe((imageBlob:Blob)=>{
          employee.image = URL.createObjectURL(imageBlob);
        })
      }
        this.p = 1;
    })
  }

  onInputChange(){
    const inputText = this.searchForm.value.name;
    if(inputText.trim() !== ''){
      document.querySelector('.cross-button')?.classList.add('show-cross');
    }else{
      document.querySelector('.cross-button')?.classList.remove('show-cross');
    }
  }

  isInputNotEmpty():boolean{
    const inputText= this.searchForm.value.name;
    return inputText.trim() !== '';   
  }

  clearSearch(){
      this.searchForm.patchValue({
        name:''
      });
      document.querySelector('.cross-button')?.classList.remove('show-cross');
      this.refreshTable();
  }

  refreshTable(): void {
    this.isLoading =true;
  
    this.employeeService.getAllEmployees().subscribe((value) => {
      this.employees = value;
      for (const employee of this.employees) {
        this.employeeService.getProfileImage(employee.id).subscribe((imageBlob: Blob) => {
          employee.image = URL.createObjectURL(imageBlob);
        });
      }
       this.isLoading =true;
       this.employees.sort((a,b)=> b.id - a.id);

      
    });
   
  }


  exportToExcel() {
    this.employeeService.exportToExcel().subscribe(
      (response: HttpResponse<Blob>) => {
        this.downloadFile(response);
        this.toastr.success("Download Successful !");
      },
      (error) => {
        this.toastr.success("Download Fail !");
      }
    );
  }

  private downloadFile(response: HttpResponse<Blob>) {
    const contentDispositionHeader: string | null = response.headers.get('Content-Disposition');
    const filename = contentDispositionHeader
      ? contentDispositionHeader.split(';')[1].trim().split('=')[1]
      : 'employee.xlsx';
  
    if (!response.body) {
      console.error('Response body is empty.');
      return;
    }
  
    const url = window.URL.createObjectURL(response.body);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  
  onDelete(close:any, id: number) {
    this.idToDelete = id;
    this.modalService.open(close, {ariaLabelledBy: 'deleteModal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') {  
        this.deleteEmployee(this.idToDelete);  
      }  
    }, (reason) => {  
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;  
    }); 
  }

  getDismissReason(reason: any) {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  deleteEmployee(id: number): void {
    console.log("Id " + id);
    this.employeeService.deleteEmployeeById(id).subscribe(
      () => {
        this.toastr.success("Delete Successful !");       
        this.refreshTable();
      },
      (error) => {
        this.toastr.success("Delete Fail !"); 
      }
    );
  }  
 
importModal(importEmployee: any){
  this.modalService.open(importEmployee,{ariaLabelledBy:'importEmployee'});
}

onFileSelected(event: Event): void {
  const inputElement = event.target as HTMLInputElement;
  if (inputElement && inputElement.files && inputElement.files.length > 0) {
    this.fileToUpload = inputElement.files[0];
  }
}

onSubmit():void{ 
  if (!this.fileToUpload) {
    console.log('No file selected.');
    return;
  }
  const formData = new FormData();
  formData.append('file', this.fileToUpload);  

    this.employeeService.importExcel(formData).subscribe(
      (response)=>{        
        this.modalService.dismissAll(); 
        this.toastr.success("Import Successful !");
        this.refreshTable();
       
      },
      (error)=>{   
        this.modalService.dismissAll();
        this.toastr.error("Import Fail !");
      }
    );
  
}


sortEmployeeId(){
  this.isEmployeeIdDescending = !this.isEmployeeIdDescending;
  this.employees.sort((a,b)=>{
   return this.isEmployeeIdDescending? b.employeeId.localeCompare(a.employeeId) : a.employeeId.localeCompare(b.employeeId)
  })
 }
 sortName(){
   this.isNameDescending = !this.isNameDescending;
   this.employees.sort((a,b)=>{
    return this.isNameDescending? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
   })
  }
  sortPosition(){
   this.isPositionDescending = !this.isPositionDescending;
   this.employees.sort((a,b)=>{
    return this.isPositionDescending? b.position.localeCompare(a.position) : a.position.localeCompare(b.position)
   })
  }
  sortDepartment(){
   this.isDepartmentDescending = !this.isDepartmentDescending;
   this.employees.sort((a,b)=>{
    return this.isDepartmentDescending? b.department.localeCompare(a.department) : a.department.localeCompare(b.department)
   })
  }
  sortNrc(){
   this.isNrcDescending = !this.isNrcDescending;
   this.employees.sort((a,b)=>{
    return this.isNrcDescending? b.nrc.localeCompare(a.nrc) : a.nrc.localeCompare(b.nrc)
   })
  }
  sortLicense(){
   this.isLicenseDescending = !this.isLicenseDescending;
   this.employees.sort((a,b)=>{
    return this.isLicenseDescending? b.license.localeCompare(a.license) : a.license.localeCompare(b.license)
   })
  }
  sortTaxNo(){
   this.isTaxNoDescending = !this.isTaxNoDescending;
   this.employees.sort((a,b)=>{
    return this.isTaxNoDescending? b.taxNo.localeCompare(a.taxNo) : a.taxNo.localeCompare(b.taxNo)
   })
  }
  sortImage(){
   this.isImageDescending = !this.isImageDescending;
   this.employees.sort((a,b)=>{
    return this.isImageDescending? b.image.localeCompare(a.image) : a.image.localeCompare(b.image)
   })
  }

}