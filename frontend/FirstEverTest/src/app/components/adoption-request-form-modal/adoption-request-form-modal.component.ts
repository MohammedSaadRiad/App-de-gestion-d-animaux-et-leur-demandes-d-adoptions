import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Animal } from '../../models/interfaces.model';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AnimalService } from '../../services/services/animal.service';
import { catchError, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-adoption-request-form-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './adoption-request-form-modal.component.html',
  styleUrl: './adoption-request-form-modal.component.css'
})
export class AdoptionRequestFormModalComponent {
  @Input() animalToRequest : Animal | undefined;
  @Output() EmitCancel = new EventEmitter<void>();
   @Output() success = new EventEmitter<void>();
  
    constructor(private animalService: AnimalService) {}
   RequestForm = new FormGroup({
    

    reasonOfAdoption: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern('^\\+?[0-9]{10,}$') // Basic phone pattern
    ])
    
  });

  onCancel(){
    this.EmitCancel.emit();
  }


SubmitAdoptionRequest(AdoptionRequest: any, AnimalToAdopt: any): Observable<any> {
  console.log('Adoption Request from modal:', AdoptionRequest);
  console.log('Animal to adopt from modal:', AnimalToAdopt);
  
  return this.animalService.createAdoptionRequest(AdoptionRequest, AnimalToAdopt).pipe(
    tap(()=>  this.success.emit()),
    catchError((error) => {
      console.error('Error posting Adoption Request:', error);
      throw error;
    })
  );
}









onSubmit(){
      
      const formData = this.RequestForm.value;
      
      // Safely convert numeric fields using non-null assertion
      const AdoptionRequest = {
        reasonOfAdoption: formData.reasonOfAdoption,
        email: formData.email,
        phoneNumber: formData.phoneNumber
      
       
      };

      

  this.SubmitAdoptionRequest(AdoptionRequest, this.animalToRequest).subscribe(

    {
      next: () => this.onCancel(),
      error: (err) => console.error('Failed to submit Adoption Request:', err)
    }
  );





}
}









  

