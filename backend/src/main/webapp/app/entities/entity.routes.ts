import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'jhipsterFinalTestAppApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'animal',
    data: { pageTitle: 'jhipsterFinalTestAppApp.animal.home.title' },
    loadChildren: () => import('./animal/animal.routes'),
  },
  {
    path: 'adoption-request',
    data: { pageTitle: 'jhipsterFinalTestAppApp.adoptionRequest.home.title' },
    loadChildren: () => import('./adoption-request/adoption-request.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
