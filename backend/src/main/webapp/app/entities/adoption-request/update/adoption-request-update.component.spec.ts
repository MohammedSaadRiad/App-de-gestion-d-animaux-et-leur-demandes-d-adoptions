import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IAnimal } from 'app/entities/animal/animal.model';
import { AnimalService } from 'app/entities/animal/service/animal.service';
import { AdoptionRequestService } from '../service/adoption-request.service';
import { IAdoptionRequest } from '../adoption-request.model';
import { AdoptionRequestFormService } from './adoption-request-form.service';

import { AdoptionRequestUpdateComponent } from './adoption-request-update.component';

describe('AdoptionRequest Management Update Component', () => {
  let comp: AdoptionRequestUpdateComponent;
  let fixture: ComponentFixture<AdoptionRequestUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let adoptionRequestFormService: AdoptionRequestFormService;
  let adoptionRequestService: AdoptionRequestService;
  let animalService: AnimalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdoptionRequestUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AdoptionRequestUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AdoptionRequestUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    adoptionRequestFormService = TestBed.inject(AdoptionRequestFormService);
    adoptionRequestService = TestBed.inject(AdoptionRequestService);
    animalService = TestBed.inject(AnimalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Animal query and add missing value', () => {
      const adoptionRequest: IAdoptionRequest = { id: 14879 };
      const animal: IAnimal = { id: 27263 };
      adoptionRequest.animal = animal;

      const animalCollection: IAnimal[] = [{ id: 27263 }];
      jest.spyOn(animalService, 'query').mockReturnValue(of(new HttpResponse({ body: animalCollection })));
      const additionalAnimals = [animal];
      const expectedCollection: IAnimal[] = [...additionalAnimals, ...animalCollection];
      jest.spyOn(animalService, 'addAnimalToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ adoptionRequest });
      comp.ngOnInit();

      expect(animalService.query).toHaveBeenCalled();
      expect(animalService.addAnimalToCollectionIfMissing).toHaveBeenCalledWith(
        animalCollection,
        ...additionalAnimals.map(expect.objectContaining),
      );
      expect(comp.animalsSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const adoptionRequest: IAdoptionRequest = { id: 14879 };
      const animal: IAnimal = { id: 27263 };
      adoptionRequest.animal = animal;

      activatedRoute.data = of({ adoptionRequest });
      comp.ngOnInit();

      expect(comp.animalsSharedCollection).toContainEqual(animal);
      expect(comp.adoptionRequest).toEqual(adoptionRequest);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAdoptionRequest>>();
      const adoptionRequest = { id: 15285 };
      jest.spyOn(adoptionRequestFormService, 'getAdoptionRequest').mockReturnValue(adoptionRequest);
      jest.spyOn(adoptionRequestService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ adoptionRequest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: adoptionRequest }));
      saveSubject.complete();

      // THEN
      expect(adoptionRequestFormService.getAdoptionRequest).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(adoptionRequestService.update).toHaveBeenCalledWith(expect.objectContaining(adoptionRequest));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAdoptionRequest>>();
      const adoptionRequest = { id: 15285 };
      jest.spyOn(adoptionRequestFormService, 'getAdoptionRequest').mockReturnValue({ id: null });
      jest.spyOn(adoptionRequestService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ adoptionRequest: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: adoptionRequest }));
      saveSubject.complete();

      // THEN
      expect(adoptionRequestFormService.getAdoptionRequest).toHaveBeenCalled();
      expect(adoptionRequestService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAdoptionRequest>>();
      const adoptionRequest = { id: 15285 };
      jest.spyOn(adoptionRequestService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ adoptionRequest });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(adoptionRequestService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAnimal', () => {
      it('should forward to animalService', () => {
        const entity = { id: 27263 };
        const entity2 = { id: 14673 };
        jest.spyOn(animalService, 'compareAnimal');
        comp.compareAnimal(entity, entity2);
        expect(animalService.compareAnimal).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
