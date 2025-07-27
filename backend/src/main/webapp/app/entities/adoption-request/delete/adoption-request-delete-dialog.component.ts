import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAdoptionRequest } from '../adoption-request.model';
import { AdoptionRequestService } from '../service/adoption-request.service';

@Component({
  templateUrl: './adoption-request-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AdoptionRequestDeleteDialogComponent {
  adoptionRequest?: IAdoptionRequest;

  protected adoptionRequestService = inject(AdoptionRequestService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.adoptionRequestService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
