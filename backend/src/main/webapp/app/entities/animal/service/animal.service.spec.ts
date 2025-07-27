import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IAnimal } from '../animal.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../animal.test-samples';

import { AnimalService } from './animal.service';

const requireRestSample: IAnimal = {
  ...sampleWithRequiredData,
};

describe('Animal Service', () => {
  let service: AnimalService;
  let httpMock: HttpTestingController;
  let expectedResult: IAnimal | IAnimal[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AnimalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Animal', () => {
      const animal = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(animal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Animal', () => {
      const animal = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(animal).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Animal', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Animal', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Animal', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAnimalToCollectionIfMissing', () => {
      it('should add a Animal to an empty array', () => {
        const animal: IAnimal = sampleWithRequiredData;
        expectedResult = service.addAnimalToCollectionIfMissing([], animal);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(animal);
      });

      it('should not add a Animal to an array that contains it', () => {
        const animal: IAnimal = sampleWithRequiredData;
        const animalCollection: IAnimal[] = [
          {
            ...animal,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAnimalToCollectionIfMissing(animalCollection, animal);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Animal to an array that doesn't contain it", () => {
        const animal: IAnimal = sampleWithRequiredData;
        const animalCollection: IAnimal[] = [sampleWithPartialData];
        expectedResult = service.addAnimalToCollectionIfMissing(animalCollection, animal);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(animal);
      });

      it('should add only unique Animal to an array', () => {
        const animalArray: IAnimal[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const animalCollection: IAnimal[] = [sampleWithRequiredData];
        expectedResult = service.addAnimalToCollectionIfMissing(animalCollection, ...animalArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const animal: IAnimal = sampleWithRequiredData;
        const animal2: IAnimal = sampleWithPartialData;
        expectedResult = service.addAnimalToCollectionIfMissing([], animal, animal2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(animal);
        expect(expectedResult).toContain(animal2);
      });

      it('should accept null and undefined values', () => {
        const animal: IAnimal = sampleWithRequiredData;
        expectedResult = service.addAnimalToCollectionIfMissing([], null, animal, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(animal);
      });

      it('should return initial array if no Animal is added', () => {
        const animalCollection: IAnimal[] = [sampleWithRequiredData];
        expectedResult = service.addAnimalToCollectionIfMissing(animalCollection, undefined, null);
        expect(expectedResult).toEqual(animalCollection);
      });
    });

    describe('compareAnimal', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAnimal(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 27263 };
        const entity2 = null;

        const compareResult1 = service.compareAnimal(entity1, entity2);
        const compareResult2 = service.compareAnimal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 27263 };
        const entity2 = { id: 14673 };

        const compareResult1 = service.compareAnimal(entity1, entity2);
        const compareResult2 = service.compareAnimal(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 27263 };
        const entity2 = { id: 27263 };

        const compareResult1 = service.compareAnimal(entity1, entity2);
        const compareResult2 = service.compareAnimal(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
