import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animal } from '../../models/interfaces.model';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AnimalService {

  private apiUrl = 'http://localhost:8080/api/animals';

  private AdoptionRequestApiUrl = 'http://localhost:8080/api/adoption-requests'

  // 🔐 Hardcoded token (copy yours here)
  private token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc1MDQ1MjkzNSwiYXV0aCI6IlJPTEVfQURNSU4gUk9MRV9VU0VSIiwiaWF0IjoxNzQ3ODYwOTM1LCJ1c2VySWQiOjF9.DZVeinnHs4MjwxoFAqqP4vQk7kEVZed1sC9at7sHyp6XDok4o6auEkuCYiPb8JyxW7utvcUbweqgP_eIQSfCQA'; // <- replace with full JWT
 
  constructor(private http: HttpClient) {}

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();



  
   createAdoptionRequest(adoptionRequestData: any, AnimalToAdopt: any): Observable<any> {
    console.log("inside create adoption Request")
    // debugger;
     const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    // console.log("we're inside!")
    const payload = {
      reasonOfAdoption: adoptionRequestData.reasonOfAdoption,
      adoptionStatus:'PENDING',
      email:adoptionRequestData.email,
      phoneNumber:adoptionRequestData.phoneNumber,
      animal: AnimalToAdopt
      };
    console.log("the adoption request payload is:",payload)
    console.log("the url of post adoption request",this.AdoptionRequestApiUrl)
    
    
    return this.http.post(this.AdoptionRequestApiUrl, payload, {headers});
  }













   async getAnimals(): Promise<Animal[] | undefined > {
    this.isLoadingSubject.next(true);
    
    try {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });
      
      return await this.http.get<Animal[]>(this.apiUrl, { headers }).pipe(
        catchError((error) => {
          console.error('Error fetching entities:', error);
          throw error;
        }),
        finalize(() => this.isLoadingSubject.next(false))
      ).toPromise();
    } catch (error) {
      this.isLoadingSubject.next(false);
      throw error;
    }
  }


   EditAnimal(animalData: any): Observable<any> {
    console.log("inside edit animal")
    // debugger;
     const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      // 'Content-Type': 'application/json'
    });
    // console.log("we're inside!")
    const payload = {
      id: animalData.id,
      name: animalData.name,
      race: animalData.race,
      age: animalData.age,
      gender: animalData.gender,
      description: animalData.description,
      adoptionStatus: animalData.adoptionStatus,
      adoptionRequest: animalData.adoptionRequest
    };
    console.log("the payload is:",payload)
    
    // debugger;
    const PatchResource = `${this.apiUrl}/${animalData.id}`
    console.log(PatchResource)
    return this.http.patch(`${this.apiUrl}/${payload.id}`, payload, {headers})
    .pipe(
      tap(response => console.log('PATCH response:', response)),
      catchError(error => {
        console.error('PATCH error:', error);
        return throwError(() => error);
      })
    );;
  }



  


  createAnimal(animalData: any): Observable<any> {
    console.log("inside create animal")
    // debugger;
     const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    // console.log("we're inside!")
    const payload = {
      name: animalData.name,
      race: animalData.race,
      age: animalData.age,
      gender: animalData.gender,
      description: animalData.description,
      adoptionStatus: animalData.adoptionStatus
    };
    console.log("the payload is:",payload)
    
    // debugger;
    console.log(this.apiUrl)
    return this.http.post(this.apiUrl, payload, {headers});
  }

  deleteAnimal(id: number | undefined): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    console.log("id from inside service:",id);
    const deleteUrl = `${this.apiUrl}/${id}`;
    console.log(`Deleting resource at: ${deleteUrl}`);
    return this.http.delete(`${this.apiUrl}/${id}`, { headers })
      .pipe(
        catchError((error: any) => {
          console.error('Error deleting animal:', error);
          return throwError(() => error);
        })
      );
  }
 


   









}