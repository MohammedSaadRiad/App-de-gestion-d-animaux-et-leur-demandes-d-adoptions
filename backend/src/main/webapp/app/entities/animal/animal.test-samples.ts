import { IAnimal, NewAnimal } from './animal.model';

export const sampleWithRequiredData: IAnimal = {
  id: 15325,
  race: 'ah croon',
  age: 14620,
  gender: 'F',
  adoptionStatus: 'ADOPTED',
};

export const sampleWithPartialData: IAnimal = {
  id: 8091,
  name: 'cellar',
  race: 'sticker generally declaration',
  age: 2615,
  gender: 'F',
  description: '../fake-data/blob/hipster.txt',
  adoptionStatus: 'ADOPTED',
};

export const sampleWithFullData: IAnimal = {
  id: 28924,
  name: 'nervously',
  race: 'excluding bicycle',
  age: 10080,
  gender: 'M',
  description: '../fake-data/blob/hipster.txt',
  adoptionStatus: 'ADOPTED',
  imageUrl: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewAnimal = {
  race: 'unwritten',
  age: 13289,
  gender: 'F',
  adoptionStatus: 'ADOPTED',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
