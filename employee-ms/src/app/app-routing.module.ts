import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { AddEmployeeComponent } from './employee/add-employee/add-employee.component';
import { EditEmployeeComponent } from './employee/edit-employee/edit-employee.component';
import { ProfileUploadComponent } from './employee/profile-upload/profile-upload.component';
import { EmployeeDetailComponent } from './employee/employee-detail/employee-detail.component';

const routes: Routes = [
  {path:'',component: EmployeeListComponent},
  {path:'add-employee',component: AddEmployeeComponent},
  {path:'edit-employee/:id',component: EditEmployeeComponent},
  {path:'profile-upload',component: ProfileUploadComponent},
  {path:'employee-list',component: EmployeeListComponent},
  {path:'employee-detail/:id',component:EmployeeDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
