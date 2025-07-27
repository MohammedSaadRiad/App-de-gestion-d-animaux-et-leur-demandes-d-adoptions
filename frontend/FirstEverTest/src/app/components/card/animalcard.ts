import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';

/**
 * @title Card with media size
 */
@Component({
  selector: 'animal-card',
  templateUrl: 'animalcard.html',
  styleUrl: 'animalcard.css',
  imports: [MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimalCard {
 
 
 
  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;
}