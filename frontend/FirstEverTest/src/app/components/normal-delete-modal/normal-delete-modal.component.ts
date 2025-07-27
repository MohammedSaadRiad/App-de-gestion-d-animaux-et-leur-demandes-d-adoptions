// delete-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'normal-delete-modal',
  templateUrl: './normal-delete-modal.component.html',
  styleUrl:'./normal-delete-modal.component.css'
})
export class NormalDeleteModalComponent {
  
  @Output() confirmDelete = new EventEmitter<void>();
  @Output() EmitCancel = new EventEmitter<void>();

  
  
  onDelete() {
    this.confirmDelete.emit();
    
  }

  onCancel() {
    this.EmitCancel.emit();

    
  }

  
}