import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Animal } from '../../models/interfaces.model';
import { CommonModule } from '@angular/common';
import { AnimalService } from '../../services/services/animal.service';
import { catchError } from 'rxjs';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';




@Component({
  selector: 'app-modal',
  templateUrl: './animal-form-modal.component.html',
  styleUrls: ['./animal-form-modal.component.css'],
  imports :  [CommonModule,ReactiveFormsModule]
})
export class ModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submitAnimal = new EventEmitter<Animal>();
  @Output() success = new EventEmitter<void>();


  constructor(private animalService: AnimalService) {}

  animalForm = new FormGroup({
    id: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$')
    ]),
    age: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
      Validators.min(0)
    ]),
    gender: new FormControl('', Validators.required),
    race: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    adoptionStatus: new FormControl('AVAILABLE', Validators.required),
    adoptionRequest: new FormControl('')
  });


PostAnimal(animal: Animal | undefined): Observable<any> {
  console.log('Posting animal:', animal);
  
  return this.animalService.createAnimal(animal).pipe(
    tap(() => this.success.emit()),
    catchError((error) => {
      console.error('Error posting animal:', error);
      throw error;
    })
  );
}


  onSubmit(){
      
      const formData = this.animalForm.value;
      
      // Safely convert numeric fields using non-null assertion
      const animal: Animal = {
        id: parseInt(formData.id!, 10),
        age: parseInt(formData.age!, 10),
        gender: formData.gender! as 'M' | 'F', // Type assertion for literal type
        description: formData.description!,
        race: formData.race!,
        name: formData.name!,
        adoptionStatus: formData.adoptionStatus!,
        adoptionRequest: formData.adoptionRequest ?? '',
        imageUrl:''
      };

      console.log(animal);

      // Validate numeric conversions
     /*  if (isNaN(animal.id) || isNaN(animal.age)) {
        console.error('Invalid numeric conversion');
        return;
      }
 */
      // this.submitAnimal.emit(animal);
      this.closeModal();
      
 //post the animal
     
         this.PostAnimal(animal).subscribe({
    next: () => this.closeModal(),
    error: (err) => console.error('Failed to submit animal:', err)
  });
    

    

     

  
  }

  closeModal(): void {
    this.close.emit();
  }
}