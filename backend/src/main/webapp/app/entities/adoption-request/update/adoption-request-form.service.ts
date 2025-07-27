import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IAdoptionRequest, NewAdoptionRequest } from '../adoption-request.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAdoptionRequest for edit and NewAdoptionRequestFormGroupInput for create.
 */
type AdoptionRequestFormGroupInput = IAdoptionRequest | PartialWithRequiredKeyOf<NewAdoptionRequest>;

type AdoptionRequestFormDefaults = Pick<NewAdoptionRequest, 'id'>;

type AdoptionRequestFormGroupContent = {
  id: FormControl<IAdoptionRequest['id'] | NewAdoptionRequest['id']>;
  reasonOfAdoption: FormControl<IAdoptionRequest['reasonOfAdoption']>;
  adoptionStatus: FormControl<IAdoptionRequest['adoptionStatus']>;
  email: FormControl<IAdoptionRequest['email']>;
  phoneNumber: FormControl<IAdoptionRequest['phoneNumber']>;
  animal: FormControl<IAdoptionRequest['animal']>;
};

export type AdoptionRequestFormGroup = FormGroup<AdoptionRequestFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AdoptionRequestFormService {
  createAdoptionRequestFormGroup(adoptionRequest: AdoptionRequestFormGroupInput = { id: null }): AdoptionRequestFormGroup {
    const adoptionRequestRawValue = {
      ...this.getFormDefaults(),
      ...adoptionRequest,
    };
    return new FormGroup<AdoptionRequestFormGroupContent>({
      id: new FormControl(
        { value: adoptionRequestRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      reasonOfAdoption: new FormControl(adoptionRequestRawValue.reasonOfAdoption, {
        validators: [Validators.required],
      }),
      adoptionStatus: new FormControl(adoptionRequestRawValue.adoptionStatus, {
        validators: [Validators.required],
      }),
      email: new FormControl(adoptionRequestRawValue.email, {
        validators: [Validators.required],
      }),
      phoneNumber: new FormControl(adoptionRequestRawValue.phoneNumber, {
        validators: [Validators.required],
      }),
      animal: new FormControl(adoptionRequestRawValue.animal),
    });
  }

  getAdoptionRequest(form: AdoptionRequestFormGroup): IAdoptionRequest | NewAdoptionRequest {
    return form.getRawValue() as IAdoptionRequest | NewAdoptionRequest;
  }

  resetForm(form: AdoptionRequestFormGroup, adoptionRequest: AdoptionRequestFormGroupInput): void {
    const adoptionRequestRawValue = { ...this.getFormDefaults(), ...adoptionRequest };
    form.reset(
      {
        ...adoptionRequestRawValue,
        id: { value: adoptionRequestRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AdoptionRequestFormDefaults {
    return {
      id: null,
    };
  }
}
