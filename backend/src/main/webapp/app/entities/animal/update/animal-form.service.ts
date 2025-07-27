import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IAnimal, NewAnimal } from '../animal.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAnimal for edit and NewAnimalFormGroupInput for create.
 */
type AnimalFormGroupInput = IAnimal | PartialWithRequiredKeyOf<NewAnimal>;

type AnimalFormDefaults = Pick<NewAnimal, 'id'>;

type AnimalFormGroupContent = {
  id: FormControl<IAnimal['id'] | NewAnimal['id']>;
  name: FormControl<IAnimal['name']>;
  race: FormControl<IAnimal['race']>;
  age: FormControl<IAnimal['age']>;
  gender: FormControl<IAnimal['gender']>;
  description: FormControl<IAnimal['description']>;
  adoptionStatus: FormControl<IAnimal['adoptionStatus']>;
  imageUrl: FormControl<IAnimal['imageUrl']>;
};

export type AnimalFormGroup = FormGroup<AnimalFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AnimalFormService {
  createAnimalFormGroup(animal: AnimalFormGroupInput = { id: null }): AnimalFormGroup {
    const animalRawValue = {
      ...this.getFormDefaults(),
      ...animal,
    };
    return new FormGroup<AnimalFormGroupContent>({
      id: new FormControl(
        { value: animalRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(animalRawValue.name),
      race: new FormControl(animalRawValue.race, {
        validators: [Validators.required],
      }),
      age: new FormControl(animalRawValue.age, {
        validators: [Validators.required],
      }),
      gender: new FormControl(animalRawValue.gender, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(1), Validators.pattern('[MF]')],
      }),
      description: new FormControl(animalRawValue.description),
      adoptionStatus: new FormControl(animalRawValue.adoptionStatus, {
        validators: [Validators.required],
      }),
      imageUrl: new FormControl(animalRawValue.imageUrl),
    });
  }

  getAnimal(form: AnimalFormGroup): IAnimal | NewAnimal {
    return form.getRawValue() as IAnimal | NewAnimal;
  }

  resetForm(form: AnimalFormGroup, animal: AnimalFormGroupInput): void {
    const animalRawValue = { ...this.getFormDefaults(), ...animal };
    form.reset(
      {
        ...animalRawValue,
        id: { value: animalRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AnimalFormDefaults {
    return {
      id: null,
    };
  }
}
