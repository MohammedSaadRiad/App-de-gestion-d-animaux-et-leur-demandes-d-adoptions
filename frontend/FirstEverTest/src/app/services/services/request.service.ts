import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdoptionRequestService {
  private readonly baseUrl = 'http://localhost:8080/api/adoption-requests';
  private readonly token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc1MDQ1MjkzNSwiYXV0aCI6IlJPTEVfQURNSU4gUk9MRV9VU0VSIiwiaWF0IjoxNzQ3ODYwOTM1LCJ1c2VySWQiOjF9.DZVeinnHs4MjwxoFAqqP4vQk7kEVZed1sC9at7sHyp6XDok4o6auEkuCYiPb8JyxW7utvcUbweqgP_eIQSfCQA'; // Replace with your JWT token
  constructor(private http: HttpClient) {}
  private headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`
  });

  getAllRequests(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { headers: this.headers });
  }

  getRequestById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, { headers: this.headers });
  }

     PatchAdoptionRequest(adoptionRequestData: any): Observable<any> {
    console.log("inside create adoption Request")
    // debugger;
    
    // console.log("we're inside!")
    const payload = {
      id: adoptionRequestData.id,
      reasonOfAdoption: adoptionRequestData.reasonOfAdoption,
      adoptionStatus:adoptionRequestData.adoptionStatus,
      email:adoptionRequestData.email,
      phoneNumber:adoptionRequestData.phoneNumber
      };
    console.log("the adoption request patch payload is:",payload)
    const PatchResource = `${this.baseUrl}/${payload.id}`
    console.log("the url of patch adoption request", PatchResource)
 
    
    
     return this.http.patch(`${this.baseUrl}/${payload.id}`, payload, {headers: this.headers})
        .pipe(
          tap(response => console.log('PATCH response:', response)),
          catchError(error => {
            console.error('PATCH error:', error);
            return throwError(() => error);
          })
        );;
  }





deleteAdoptionRequest(id: number | undefined): Observable<any> {
  
    console.log("id from inside adoption deletion request:",id);
    const deleteUrl = `${this.baseUrl}/${id}`;
    console.log(`Deleting resource at: ${deleteUrl}`);
    return this.http.delete(`${this.baseUrl}/${id}`, {headers: this.headers})
      .pipe(
        catchError((error: any) => {
          console.error('Error deleting adoption request:', error);
          return throwError(() => error);
        })
      );
  }







}