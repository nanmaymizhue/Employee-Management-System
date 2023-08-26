import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Employee } from '../model/employee';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private baseUrl = 'http://localhost:8081/api/employee';

  constructor(private httpClient: HttpClient) {}

  getAllEmployees() {
    return this.httpClient.get<Employee[]>(this.baseUrl);
  }

  getProfileImage(id: number): Observable<Blob> {
    return this.httpClient.get(`${this.baseUrl}/${id}/image`, {
      responseType: 'blob',
    });
  }

  getEmployeeById(id:number):Observable<Employee[]>{
    return this.httpClient.get<Employee[]>(`${this.baseUrl}/${id}`);
   
  }

  updateEmployee(employee:Employee):Observable<Employee[]>{
    return this.httpClient.put<Employee[]>(`${this.baseUrl}/${employee.id}`,employee);
  }

  searchEmployeeByName(name: string): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.baseUrl}/name/${name}`);
  }

  deleteEmployeeById(id: number){
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
    
  }

  exportToExcel(): Observable<HttpResponse<Blob>> {
    const headers = new HttpHeaders({
      Accept: 'application/octet-stream',
    });

    return this.httpClient.get<Blob>(`${this.baseUrl}/export-to-excel`, {
      headers: headers,
      observe: 'response',
      responseType: 'blob' as 'json',
    });
  }

  
  addNewEmployee(employeeData: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl, employeeData);
  }

  importExcel(formData: FormData) {
    return this.httpClient.post<any>(`${this.baseUrl}/import`, formData)
      .pipe(
        catchError((error) => {
          console.error("Error importing employee", error);
          return throwError("An error occurred during the import. Please try again later.");
        })
      );
  }
    
  saveImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);  
    console.log(formData + "Form Data");  
    return this.httpClient.post<any>(`${this.baseUrl}/image`, formData);   
   
  }


}

// {      
//   responseType: 'text'  
// }).pipe(
//   map((response: string) => response as string)
// );