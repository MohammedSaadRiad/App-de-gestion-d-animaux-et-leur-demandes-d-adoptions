import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IAnimal } from 'app/entities/animal/animal.model';
import { AnimalService } from 'app/entities/animal/service/animal.service';
import { RequestStatus } from 'app/entities/enumerations/request-status.model';
import { AdoptionRequestService } from '../service/adoption-request.service';
import { IAdoptionRequest } from '../adoption-request.model';
import { AdoptionRequestFormGroup, AdoptionRequestFormService } from './adoption-request-form.service';

@Component({
  selector: 'jhi-adoption-request-update',
  templateUrl: './adoption-request-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AdoptionRequestUpdateComponent implements OnInit {
  isSaving = false;
  adoptionRequest: IAdoptionRequest | null = null;
  requestStatusValues = Object.keys(RequestStatus);

  animalsSharedCollection: IAnimal[] = [];

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected adoptionRequestService = inject(AdoptionRequestService);
  protected adoptionRequestFormService = inject(AdoptionRequestFormService);
  protected animalService = inject(AnimalService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AdoptionRequestFormGroup = this.adoptionRequestFormService.createAdoptionRequestFormGroup();

  compareAnimal = (o1: IAnimal | null, o2: IAnimal | null): boolean => this.animalService.compareAnimal(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ adoptionRequest }) => {
      this.adoptionRequest = adoptionRequest;
      if (adoptionRequest) {
        this.updateForm(adoptionRequest);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('jhipsterFinalTestAppApp.error', { ...err, key: `error.file.${err.key}` }),
        ),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const adoptionRequest = this.adoptionRequestFormService.getAdoptionRequest(this.editForm);
    if (adoptionRequest.id !== null) {
      this.subscribeToSaveResponse(this.adoptionRequestService.update(adoptionRequest));
    } else {
      this.subscribeToSaveResponse(this.adoptionRequestService.create(adoptionRequest));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdoptionRequest>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(adoptionRequest: IAdoptionRequest): void {
    this.adoptionRequest = adoptionRequest;
    this.adoptionRequestFormService.resetForm(this.editForm, adoptionRequest);

    this.animalsSharedCollection = this.animalService.addAnimalToCollectionIfMissing<IAnimal>(
      this.animalsSharedCollection,
      adoptionRequest.animal,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.animalService
      .query()
      .pipe(map((res: HttpResponse<IAnimal[]>) => res.body ?? []))
      .pipe(map((animals: IAnimal[]) => this.animalService.addAnimalToCollectionIfMissing<IAnimal>(animals, this.adoptionRequest?.animal)))
      .subscribe((animals: IAnimal[]) => (this.animalsSharedCollection = animals));
  }
}
