import { Component, OnInit } from '@angular/core';
import { AnimalService } from '../../services/services/animal.service'; 
import { Animal } from '../../models/interfaces.model'; 
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ModalComponent } from '../animal-form-modal/animal-form-modal.component';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { catchError } from 'rxjs';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { UserRoleService, UserRole } from '../../services/services/user-role-serivce.service';
import { Subscription } from 'rxjs';
import { AdoptionRequestFormModalComponent } from '../adoption-request-form-modal/adoption-request-form-modal.component';
import { NormalDeleteModalComponent } from '../normal-delete-modal/normal-delete-modal.component';

@Component({
  selector: 'app-animals',
  templateUrl: './animals.component.html',
  styleUrls: ['./animals.component.css'],
  imports:[CommonModule,ModalComponent,NormalDeleteModalComponent,ReactiveFormsModule,AdoptionRequestFormModalComponent]
})
export class AnimalsComponent implements OnInit {
  // animals: Animal[] | undefined = [];


   currentRole: UserRole = 'user';
  private roleSubscription: Subscription | undefined;
  animals: Animal[] | undefined
  isLoading = true;
  
  animalToDeleteId: number | undefined;
  // reload = false;
  
  constructor(private animalService: AnimalService, private userRoleService:UserRoleService) {}
  
  AnimalToRequestAdoption: Animal | undefined;
  
SetAnimalToRequestAdoption(AnimalToRequestAdoption: Animal | undefined){


  this.AnimalToRequestAdoption = AnimalToRequestAdoption;

}




 animalForm = new FormGroup({
    id: new FormControl(0, [
      Validators.required,
      Validators.pattern('^[0-9]+$')
    ]),
    age: new FormControl(0, [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
      Validators.min(0)
    ]),
    gender: new FormControl('', Validators.required),
    race: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    adoptionStatus: new FormControl('AVAILABLE', Validators.required)
  });

SetAnimalToEdit(AnimalToEdit: Animal): void {
  

  // Update all form controls at once
  this.animalForm.setValue({
    id: AnimalToEdit.id,
    age: AnimalToEdit.age,
    race: AnimalToEdit.race,
    name:AnimalToEdit.name,
    gender: AnimalToEdit.gender,
    description: AnimalToEdit.description,
    adoptionStatus: AnimalToEdit.adoptionStatus
  
  });

  console.log(this.animalForm)
}



    



 


EditAnimal(){

     const formData = this.animalForm.value;
      
      // Safely convert numeric fields using non-null assertion
      const animal  = {
        id: formData.id!,
        age: formData.age!,
        name: formData.name!,
        race: formData.race!,
        gender: formData.gender! as 'M' | 'F', // Type assertion for literal type
        description: formData.description!,
        adoptionStatus: formData.adoptionStatus!
      };









  console.log('Patching animal:');
  
   
   this.animalService.EditAnimal(animal).subscribe({
    next: () =>   this.getAnimals() ,
    error : (err) => console.error('Failed to patch:',err)
   })
 

 
}






AnimalAddedAlert(){
  alert("Animal ajouté avec succès")
}


AdoptionRequestAddedAlert(){
  alert("Demande d'adoption envoyée avec succès")
}




  


  /* getAnimals (){
    this.reload = false;
     this.animals = []
    this.animalService.getAnimals().subscribe({
      next: (data: any) => {
        console.log("the data after we did fetch the get api:",data);
        this.animals = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to fetch animals', err);
        this.isLoading = false;
      }
    });
    this.reload = true;
  }
 */


 async  getAnimals(){
    try{
      console.log("get animals")
     this.animals = await this.animalService.getAnimals();
     console.log(this.animals)
     
    }catch(error){
      console.log("failed to fetch",error)
    }

  }
   RetrieveAnimalToDeleteId(RetrievenAnimalId: number){
       
      this.animalToDeleteId= RetrievenAnimalId;
      console.log( this.animalToDeleteId)
   
   }





    OnConfirmDeleteAnimal(){

  this.animalService.deleteAnimal(this.animalToDeleteId).subscribe(
    {
      next: () => this.getAnimals()
      .then(() => this.hideDeleteModal())
      .then(()=> alert("Animal supprimée avec succèss!")),
      error: (err) => console.error('Failed to delete', err)
    }
  )


 }



      ngOnInit(): void {
       this.getAnimals();
        
      this.roleSubscription = this.userRoleService.userRole$.subscribe(role => {
      this.currentRole = role;
      console.log('Role updated in animal component:', role);
    });







       }


 
  //modal stuff

    isModalVisible = false;

  showModal(): void {
    if(this.isModalVisible === true){
      this.isModalVisible = false;
    }
    else{this.isModalVisible = true;}
    
  }

  hideModal(): void {
    this.isModalVisible = false;
  }

  isAdoptionRequestPostVisible=false;
   
  SetisAdoptionRequestPostVisible(){
    if(!this.isAdoptionRequestPostVisible)
   this.isAdoptionRequestPostVisible = true
  else if(this.isAdoptionRequestPostVisible)
    this.isAdoptionRequestPostVisible = false;
  

  }

  handleAnimalSubmit(animal: Animal): void {
    console.log('New animal submitted:', animal);
    // Handle the submitted animal data here
    this.hideModal();



  }

  //delete modal stuff

  isDeleteModalVisible= false;
  isEdit=false;
  AnimalIdToEdit:number | undefined; 

  hideDeleteModal(){
    // console.log("hidedeletemodal")
    // debugger;
    this.isDeleteModalVisible = false;
   /*  this.getAnimals(); */   // <- !!!!! taghra 3layach khddam refresh be3d delete
    
  }

  showDeleteModal(){
    this.isDeleteModalVisible = true;
  }

  setIsEdit(){
     if(this.isEdit === true){
      this.isEdit = false;
    }
    else{this.isEdit = true;}
    
  }

  setAnimalIdToEdit(animalIdToEdit:number | undefined){
    this.AnimalIdToEdit= animalIdToEdit;
  }
}



