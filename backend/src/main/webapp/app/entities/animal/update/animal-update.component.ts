import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { AdoptionStatus } from 'app/entities/enumerations/adoption-status.model';
import { AnimalService } from '../service/animal.service';
import { IAnimal } from '../animal.model';
import { AnimalFormGroup, AnimalFormService } from './animal-form.service';

@Component({
  selector: 'jhi-animal-update',
  templateUrl: './animal-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AnimalUpdateComponent implements OnInit {
  isSaving = false;
  animal: IAnimal | null = null;
  adoptionStatusValues = Object.keys(AdoptionStatus);

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected animalService = inject(AnimalService);
  protected animalFormService = inject(AnimalFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AnimalFormGroup = this.animalFormService.createAnimalFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ animal }) => {
      this.animal = animal;
      if (animal) {
        this.updateForm(animal);
      }
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
    const animal = this.animalFormService.getAnimal(this.editForm);
    if (animal.id !== null) {
      this.subscribeToSaveResponse(this.animalService.update(animal));
    } else {
      this.subscribeToSaveResponse(this.animalService.create(animal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAnimal>>): void {
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

  protected updateForm(animal: IAnimal): void {
    this.animal = animal;
    this.animalFormService.resetForm(this.editForm, animal);
  }
}
