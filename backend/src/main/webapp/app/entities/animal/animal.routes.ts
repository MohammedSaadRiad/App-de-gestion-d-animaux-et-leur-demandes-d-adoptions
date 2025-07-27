import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import AnimalResolve from './route/animal-routing-resolve.service';

const animalRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/animal.component').then(m => m.AnimalComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/animal-detail.component').then(m => m.AnimalDetailComponent),
    resolve: {
      animal: AnimalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/animal-update.component').then(m => m.AnimalUpdateComponent),
    resolve: {
      animal: AnimalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/animal-update.component').then(m => m.AnimalUpdateComponent),
    resolve: {
      animal: AnimalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default animalRoute;
