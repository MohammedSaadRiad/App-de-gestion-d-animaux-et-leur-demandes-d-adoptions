import { Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DataUtils } from 'app/core/util/data-util.service';
import { IAdoptionRequest } from '../adoption-request.model';

@Component({
  selector: 'jhi-adoption-request-detail',
  templateUrl: './adoption-request-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class AdoptionRequestDetailComponent {
  adoptionRequest = input<IAdoptionRequest | null>(null);

  protected dataUtils = inject(DataUtils);

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
