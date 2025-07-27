import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAdoptionRequest, NewAdoptionRequest } from '../adoption-request.model';

export type PartialUpdateAdoptionRequest = Partial<IAdoptionRequest> & Pick<IAdoptionRequest, 'id'>;

export type EntityResponseType = HttpResponse<IAdoptionRequest>;
export type EntityArrayResponseType = HttpResponse<IAdoptionRequest[]>;

@Injectable({ providedIn: 'root' })
export class AdoptionRequestService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/adoption-requests');

  create(adoptionRequest: NewAdoptionRequest): Observable<EntityResponseType> {
    return this.http.post<IAdoptionRequest>(this.resourceUrl, adoptionRequest, { observe: 'response' });
  }

  update(adoptionRequest: IAdoptionRequest): Observable<EntityResponseType> {
    return this.http.put<IAdoptionRequest>(`${this.resourceUrl}/${this.getAdoptionRequestIdentifier(adoptionRequest)}`, adoptionRequest, {
      observe: 'response',
    });
  }

  partialUpdate(adoptionRequest: PartialUpdateAdoptionRequest): Observable<EntityResponseType> {
    return this.http.patch<IAdoptionRequest>(`${this.resourceUrl}/${this.getAdoptionRequestIdentifier(adoptionRequest)}`, adoptionRequest, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAdoptionRequest>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAdoptionRequest[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAdoptionRequestIdentifier(adoptionRequest: Pick<IAdoptionRequest, 'id'>): number {
    return adoptionRequest.id;
  }

  compareAdoptionRequest(o1: Pick<IAdoptionRequest, 'id'> | null, o2: Pick<IAdoptionRequest, 'id'> | null): boolean {
    return o1 && o2 ? this.getAdoptionRequestIdentifier(o1) === this.getAdoptionRequestIdentifier(o2) : o1 === o2;
  }

  addAdoptionRequestToCollectionIfMissing<Type extends Pick<IAdoptionRequest, 'id'>>(
    adoptionRequestCollection: Type[],
    ...adoptionRequestsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const adoptionRequests: Type[] = adoptionRequestsToCheck.filter(isPresent);
    if (adoptionRequests.length > 0) {
      const adoptionRequestCollectionIdentifiers = adoptionRequestCollection.map(adoptionRequestItem =>
        this.getAdoptionRequestIdentifier(adoptionRequestItem),
      );
      const adoptionRequestsToAdd = adoptionRequests.filter(adoptionRequestItem => {
        const adoptionRequestIdentifier = this.getAdoptionRequestIdentifier(adoptionRequestItem);
        if (adoptionRequestCollectionIdentifiers.includes(adoptionRequestIdentifier)) {
          return false;
        }
        adoptionRequestCollectionIdentifiers.push(adoptionRequestIdentifier);
        return true;
      });
      return [...adoptionRequestsToAdd, ...adoptionRequestCollection];
    }
    return adoptionRequestCollection;
  }
}
