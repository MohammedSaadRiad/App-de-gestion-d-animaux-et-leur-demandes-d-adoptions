import { Component } from '@angular/core';
import { AnimalCard } from './components/card/animalcard';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AnimalsComponent } from './components/animals/animals.component';
import { HttpClientModule } from '@angular/common/http'
import { RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
   imports:[NavbarComponent,AnimalsComponent, HttpClientModule, RouterOutlet]
  
})
export class AppComponent {

}
