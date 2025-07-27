import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnimalsComponent } from './components/animals/animals.component'; 
import { RequestsComponent } from './components/requests/requests.component';
import { AnimalDetailComponent } from './components/animal-detail/animal-detail.component';
export const routes: Routes = [
  { path: 'animals', component: AnimalsComponent },
 
  { path: 'animals/:id', component: AnimalDetailComponent },
 

  { path: 'request', component:RequestsComponent },
   { path: '', redirectTo: '/animals', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}