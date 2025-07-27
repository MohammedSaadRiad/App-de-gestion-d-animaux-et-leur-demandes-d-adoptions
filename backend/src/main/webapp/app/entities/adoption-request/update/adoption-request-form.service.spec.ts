import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../adoption-request.test-samples';

import { AdoptionRequestFormService } from './adoption-request-form.service';

describe('AdoptionRequest Form Service', () => {
  let service: AdoptionRequestFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdoptionRequestFormService);
  });

  describe('Service methods', () => {
    describe('createAdoptionRequestFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAdoptionRequestFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            reasonOfAdoption: expect.any(Object),
            adoptionStatus: expect.any(Object),
            email: expect.any(Object),
            phoneNumber: expect.any(Object),
            animal: expect.any(Object),
          }),
        );
      });

      it('passing IAdoptionRequest should create a new form with FormGroup', () => {
        const formGroup = service.createAdoptionRequestFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            reasonOfAdoption: expect.any(Object),
            adoptionStatus: expect.any(Object),
            email: expect.any(Object),
            phoneNumber: expect.any(Object),
            animal: expect.any(Object),
          }),
        );
      });
    });

    describe('getAdoptionRequest', () => {
      it('should return NewAdoptionRequest for default AdoptionRequest initial value', () => {
        const formGroup = service.createAdoptionRequestFormGroup(sampleWithNewData);

        const adoptionRequest = service.getAdoptionRequest(formGroup) as any;

        expect(adoptionRequest).toMatchObject(sampleWithNewData);
      });

      it('should return NewAdoptionRequest for empty AdoptionRequest initial value', () => {
        const formGroup = service.createAdoptionRequestFormGroup();

        const adoptionRequest = service.getAdoptionRequest(formGroup) as any;

        expect(adoptionRequest).toMatchObject({});
      });

      it('should return IAdoptionRequest', () => {
        const formGroup = service.createAdoptionRequestFormGroup(sampleWithRequiredData);

        const adoptionRequest = service.getAdoptionRequest(formGroup) as any;

        expect(adoptionRequest).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAdoptionRequest should not enable id FormControl', () => {
        const formGroup = service.createAdoptionRequestFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAdoptionRequest should disable id FormControl', () => {
        const formGroup = service.createAdoptionRequestFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
