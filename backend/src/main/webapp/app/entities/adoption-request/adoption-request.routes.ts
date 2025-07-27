import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import AdoptionRequestResolve from './route/adoption-request-routing-resolve.service';

const adoptionRequestRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/adoption-request.component').then(m => m.AdoptionRequestComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/adoption-request-detail.component').then(m => m.AdoptionRequestDetailComponent),
    resolve: {
      adoptionRequest: AdoptionRequestResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/adoption-request-update.component').then(m => m.AdoptionRequestUpdateComponent),
    resolve: {
      adoptionRequest: AdoptionRequestResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/adoption-request-update.component').then(m => m.AdoptionRequestUpdateComponent),
    resolve: {
      adoptionRequest: AdoptionRequestResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default adoptionRequestRoute;
