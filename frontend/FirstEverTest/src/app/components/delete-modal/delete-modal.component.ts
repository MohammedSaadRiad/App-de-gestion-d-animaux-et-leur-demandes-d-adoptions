// delete-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { signal } from '@angular/core';
import { AnimalService } from '../../services/services/animal.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrl:'./delete-modal.component.css'
})
export class DeleteModalComponent {
  @Input() animalIdToDelete: number | undefined;
  @Output() confirmDelete = new EventEmitter<void>();
  @Output() EmitCancel = new EventEmitter<void>();

  
 constructor(private animalService: AnimalService) {}
  
  onDelete() {
      this.animalService.deleteAnimal(this.animalIdToDelete).subscribe((res:any) => {
        if(res.result){
          
         
        }else{
          
        }


       })
    this.confirmDelete.emit();
    
  }

  onCancel() {
    this.EmitCancel.emit();
    console.log(this.animalIdToDelete)
    console.log("emitcancel")
    
  }

  
}