import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAdoptionRequest } from '../adoption-request.model';
import { AdoptionRequestService } from '../service/adoption-request.service';

const adoptionRequestResolve = (route: ActivatedRouteSnapshot): Observable<null | IAdoptionRequest> => {
  const id = route.params.id;
  if (id) {
    return inject(AdoptionRequestService)
      .find(id)
      .pipe(
        mergeMap((adoptionRequest: HttpResponse<IAdoptionRequest>) => {
          if (adoptionRequest.body) {
            return of(adoptionRequest.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default adoptionRequestResolve;
