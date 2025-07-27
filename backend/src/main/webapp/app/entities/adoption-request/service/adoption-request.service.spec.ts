import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IAdoptionRequest } from '../adoption-request.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../adoption-request.test-samples';

import { AdoptionRequestService } from './adoption-request.service';

const requireRestSample: IAdoptionRequest = {
  ...sampleWithRequiredData,
};

describe('AdoptionRequest Service', () => {
  let service: AdoptionRequestService;
  let httpMock: HttpTestingController;
  let expectedResult: IAdoptionRequest | IAdoptionRequest[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AdoptionRequestService);
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

    it('should create a AdoptionRequest', () => {
      const adoptionRequest = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(adoptionRequest).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AdoptionRequest', () => {
      const adoptionRequest = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(adoptionRequest).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AdoptionRequest', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AdoptionRequest', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AdoptionRequest', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAdoptionRequestToCollectionIfMissing', () => {
      it('should add a AdoptionRequest to an empty array', () => {
        const adoptionRequest: IAdoptionRequest = sampleWithRequiredData;
        expectedResult = service.addAdoptionRequestToCollectionIfMissing([], adoptionRequest);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(adoptionRequest);
      });

      it('should not add a AdoptionRequest to an array that contains it', () => {
        const adoptionRequest: IAdoptionRequest = sampleWithRequiredData;
        const adoptionRequestCollection: IAdoptionRequest[] = [
          {
            ...adoptionRequest,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAdoptionRequestToCollectionIfMissing(adoptionRequestCollection, adoptionRequest);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AdoptionRequest to an array that doesn't contain it", () => {
        const adoptionRequest: IAdoptionRequest = sampleWithRequiredData;
        const adoptionRequestCollection: IAdoptionRequest[] = [sampleWithPartialData];
        expectedResult = service.addAdoptionRequestToCollectionIfMissing(adoptionRequestCollection, adoptionRequest);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(adoptionRequest);
      });

      it('should add only unique AdoptionRequest to an array', () => {
        const adoptionRequestArray: IAdoptionRequest[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const adoptionRequestCollection: IAdoptionRequest[] = [sampleWithRequiredData];
        expectedResult = service.addAdoptionRequestToCollectionIfMissing(adoptionRequestCollection, ...adoptionRequestArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const adoptionRequest: IAdoptionRequest = sampleWithRequiredData;
        const adoptionRequest2: IAdoptionRequest = sampleWithPartialData;
        expectedResult = service.addAdoptionRequestToCollectionIfMissing([], adoptionRequest, adoptionRequest2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(adoptionRequest);
        expect(expectedResult).toContain(adoptionRequest2);
      });

      it('should accept null and undefined values', () => {
        const adoptionRequest: IAdoptionRequest = sampleWithRequiredData;
        expectedResult = service.addAdoptionRequestToCollectionIfMissing([], null, adoptionRequest, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(adoptionRequest);
      });

      it('should return initial array if no AdoptionRequest is added', () => {
        const adoptionRequestCollection: IAdoptionRequest[] = [sampleWithRequiredData];
        expectedResult = service.addAdoptionRequestToCollectionIfMissing(adoptionRequestCollection, undefined, null);
        expect(expectedResult).toEqual(adoptionRequestCollection);
      });
    });

    describe('compareAdoptionRequest', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAdoptionRequest(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 15285 };
        const entity2 = null;

        const compareResult1 = service.compareAdoptionRequest(entity1, entity2);
        const compareResult2 = service.compareAdoptionRequest(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 15285 };
        const entity2 = { id: 14879 };

        const compareResult1 = service.compareAdoptionRequest(entity1, entity2);
        const compareResult2 = service.compareAdoptionRequest(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 15285 };
        const entity2 = { id: 15285 };

        const compareResult1 = service.compareAdoptionRequest(entity1, entity2);
        const compareResult2 = service.compareAdoptionRequest(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
