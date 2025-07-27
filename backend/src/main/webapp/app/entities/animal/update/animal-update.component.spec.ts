import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { AnimalService } from '../service/animal.service';
import { IAnimal } from '../animal.model';
import { AnimalFormService } from './animal-form.service';

import { AnimalUpdateComponent } from './animal-update.component';

describe('Animal Management Update Component', () => {
  let comp: AnimalUpdateComponent;
  let fixture: ComponentFixture<AnimalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let animalFormService: AnimalFormService;
  let animalService: AnimalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AnimalUpdateComponent],
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
      .overrideTemplate(AnimalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AnimalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    animalFormService = TestBed.inject(AnimalFormService);
    animalService = TestBed.inject(AnimalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const animal: IAnimal = { id: 14673 };

      activatedRoute.data = of({ animal });
      comp.ngOnInit();

      expect(comp.animal).toEqual(animal);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnimal>>();
      const animal = { id: 27263 };
      jest.spyOn(animalFormService, 'getAnimal').mockReturnValue(animal);
      jest.spyOn(animalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ animal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: animal }));
      saveSubject.complete();

      // THEN
      expect(animalFormService.getAnimal).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(animalService.update).toHaveBeenCalledWith(expect.objectContaining(animal));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnimal>>();
      const animal = { id: 27263 };
      jest.spyOn(animalFormService, 'getAnimal').mockReturnValue({ id: null });
      jest.spyOn(animalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ animal: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: animal }));
      saveSubject.complete();

      // THEN
      expect(animalFormService.getAnimal).toHaveBeenCalled();
      expect(animalService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAnimal>>();
      const animal = { id: 27263 };
      jest.spyOn(animalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ animal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(animalService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
