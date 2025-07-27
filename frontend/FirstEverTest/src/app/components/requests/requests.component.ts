import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '../animal-form-modal/animal-form-modal.component';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdoptionRequestService } from '../../services/services/request.service';
import { AdoptionRequest } from '../../models/interfaces.model';
import { Subscription } from 'rxjs';
import { UserRole, UserRoleService } from '../../services/services/user-role-serivce.service';
import { NormalDeleteModalComponent } from '../normal-delete-modal/normal-delete-modal.component';

@Component({
  selector: 'app-requests',
  imports: [CommonModule,ModalComponent,ReactiveFormsModule,NormalDeleteModalComponent],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit {
  requests: AdoptionRequest[] | undefined;
  isLoading = false;
  error = '';
  IsUserEdit = false;
  isAdminEdit = false;
  isDeleteModal = false;
  AdoptionRequestIdToDelete: number | undefined;
  private roleSubscription: Subscription | undefined;
  UpdatedRequestStatusToPatch = '';
  AdoptionRequestToUpdateStatus: any;
AdoptionRequestToUpdateStatusId: number | undefined;


currentRole: UserRole = 'user';
  constructor(private adoptionRequestService: AdoptionRequestService,private userRoleService:UserRoleService) { }


AdoptionRequestToEdit: any;



RequestForm = new FormGroup({
    

    reasonOfAdoption: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern('^\\+?[0-9]{10,}$') // Basic phone pattern
    ]),
    adoptionStatus: new FormControl('',
      Validators.required
    ),
    id : new FormControl(0, [Validators.required, Validators.pattern('^[0-9]+$')])
    
  });













  ngOnInit(): void {
    this.loadRequests();


this.roleSubscription = this.userRoleService.userRole$.subscribe(role => {
      this.currentRole = role;
      console.log('Role updated in request component:', role);

  });

  }

  async loadRequests() {
    this.isLoading = true;
    this.adoptionRequestService.getAllRequests().subscribe({
      next: (requests) => {
        this.requests = requests;
        console.log(requests)
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.isLoading = false;
      }
    });
  }


SetAdoptionRequestToUpdateStatusId(AdoptionRequestToUpdateStatusId: any){

  this.AdoptionRequestToUpdateStatusId = AdoptionRequestToUpdateStatusId
  console.log(AdoptionRequestToUpdateStatusId)
}




  SetAdoptionRequestIdToDelete(adoptionRequestIdToDelete: number | undefined){
    this.AdoptionRequestIdToDelete= adoptionRequestIdToDelete;
    console.log("adoption request id to delete retrieven", adoptionRequestIdToDelete)
  }


SetUpdatedRequestStatusToPatch(UpdatedRequestStatusToPatch: string){
  this.UpdatedRequestStatusToPatch = UpdatedRequestStatusToPatch;
  console.log(this.UpdatedRequestStatusToPatch)
   
}

SetAdoptionRequestToUpdateStatus(RetrievenAdoptionRequestToUpdateStatus: any){
  // this.AdoptionRequestToUpdateStatus = AdoptionRequestIdToDelete
if(this.UpdatedRequestStatusToPatch === 'ACCEPTED' || 'REJECTED' || 'PENDING'){
  const AdoptionRequestToUpdateStatusToSend = {
     id: RetrievenAdoptionRequestToUpdateStatus.id,
     reasonOfAdoption: RetrievenAdoptionRequestToUpdateStatus.reasonOfAdoption,
        email: RetrievenAdoptionRequestToUpdateStatus.email,
        adoptionStatus: this.UpdatedRequestStatusToPatch,
        phoneNumber: RetrievenAdoptionRequestToUpdateStatus.phoneNumber,
        animal:RetrievenAdoptionRequestToUpdateStatus.animal
    
  }

 console.log(AdoptionRequestToUpdateStatusToSend)



 this.adoptionRequestService.PatchAdoptionRequest(AdoptionRequestToUpdateStatusToSend).subscribe({
    next: () => this.loadRequests()
    .then(()=> this.SetIsAdminEditFalse())
    .then(()=> alert("Etat modifiée avec succèss!")), 
    error: (err) => console.error('Failed to patch:',err)
  })
    


this.AdoptionRequestToUpdateStatusId = 0;





}
}






  SetIsUserEditTrue(){
    /*  if(this.IsUserEdit){
      this.IsUserEdit = false;
     }else {
      this.IsUserEdit= true;
     } */

      this.IsUserEdit=true;
  }

  SetIsAdminEditTrue(){
    this.isAdminEdit= true;
  }


  SetIsAdminEditFalse(){
  
 this.isAdminEdit= false;
  }
SetIsUserEditFalse(){
  

      this.IsUserEdit=false;
      this.AdoptionRequestToEdit = null;
  }
setIsDeleteModalTrue(){

  this.isDeleteModal = true;
}
setIsDeleteModalFalse(){

  this.isDeleteModal = false;
}

  SetAdoptionRequestToEdit(AdoptionRequestToEdit:any){
  
      this.AdoptionRequestToEdit= AdoptionRequestToEdit;
      
      this.RequestForm.setValue({
        id: AdoptionRequestToEdit.id,
        reasonOfAdoption: AdoptionRequestToEdit.reasonOfAdoption,
        email: AdoptionRequestToEdit.email,
        adoptionStatus: AdoptionRequestToEdit.adoptionStatus,
        phoneNumber: AdoptionRequestToEdit.phoneNumber



      })}








      
 OnSubmitPatchAdoptionRequest(){

  const AdoptionRequestToSubmit = this.RequestForm.value;
  
  console.log(AdoptionRequestToSubmit)

  this.adoptionRequestService.PatchAdoptionRequest(AdoptionRequestToSubmit).subscribe({
    next: () => this.loadRequests()
    .then(()=> this.SetIsUserEditFalse())
    .then(()=> alert("Demande d'adoption modifiée avec succèss!")), 
    error: (err) => console.error('Failed to patch:',err)
  })
 }

 OnConfirmDeleteAdoptionRequest(){

  this.adoptionRequestService.deleteAdoptionRequest(this.AdoptionRequestIdToDelete).subscribe(
    {
      next: () => this.loadRequests()
      .then(() => this.setIsDeleteModalFalse())
      .then(()=> alert("Demande d'adoption supprimée avec succèss!")),
      error: (err) => console.error('Failed to delete', err)
    }
  )


 }
      
  
}