import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAnimal } from '../animal.model';
import { AnimalService } from '../service/animal.service';

@Component({
  templateUrl: './animal-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AnimalDeleteDialogComponent {
  animal?: IAnimal;

  protected animalService = inject(AnimalService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.animalService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
