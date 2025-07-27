import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAnimal, NewAnimal } from '../animal.model';

export type PartialUpdateAnimal = Partial<IAnimal> & Pick<IAnimal, 'id'>;

export type EntityResponseType = HttpResponse<IAnimal>;
export type EntityArrayResponseType = HttpResponse<IAnimal[]>;

@Injectable({ providedIn: 'root' })
export class AnimalService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/animals');

  create(animal: NewAnimal): Observable<EntityResponseType> {
    return this.http.post<IAnimal>(this.resourceUrl, animal, { observe: 'response' });
  }

  update(animal: IAnimal): Observable<EntityResponseType> {
    return this.http.put<IAnimal>(`${this.resourceUrl}/${this.getAnimalIdentifier(animal)}`, animal, { observe: 'response' });
  }

  partialUpdate(animal: PartialUpdateAnimal): Observable<EntityResponseType> {
    return this.http.patch<IAnimal>(`${this.resourceUrl}/${this.getAnimalIdentifier(animal)}`, animal, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAnimal>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAnimal[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAnimalIdentifier(animal: Pick<IAnimal, 'id'>): number {
    return animal.id;
  }

  compareAnimal(o1: Pick<IAnimal, 'id'> | null, o2: Pick<IAnimal, 'id'> | null): boolean {
    return o1 && o2 ? this.getAnimalIdentifier(o1) === this.getAnimalIdentifier(o2) : o1 === o2;
  }

  addAnimalToCollectionIfMissing<Type extends Pick<IAnimal, 'id'>>(
    animalCollection: Type[],
    ...animalsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const animals: Type[] = animalsToCheck.filter(isPresent);
    if (animals.length > 0) {
      const animalCollectionIdentifiers = animalCollection.map(animalItem => this.getAnimalIdentifier(animalItem));
      const animalsToAdd = animals.filter(animalItem => {
        const animalIdentifier = this.getAnimalIdentifier(animalItem);
        if (animalCollectionIdentifiers.includes(animalIdentifier)) {
          return false;
        }
        animalCollectionIdentifiers.push(animalIdentifier);
        return true;
      });
      return [...animalsToAdd, ...animalCollection];
    }
    return animalCollection;
  }
}
