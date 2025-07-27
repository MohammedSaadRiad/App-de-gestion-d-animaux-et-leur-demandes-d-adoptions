import { IAdoptionRequest, NewAdoptionRequest } from './adoption-request.model';

export const sampleWithRequiredData: IAdoptionRequest = {
  id: 13688,
  reasonOfAdoption: '../fake-data/blob/hipster.txt',
  adoptionStatus: 'REJECTED',
  email: 'Alexzander85@hotmail.com',
  phoneNumber: 'circa',
};

export const sampleWithPartialData: IAdoptionRequest = {
  id: 29411,
  reasonOfAdoption: '../fake-data/blob/hipster.txt',
  adoptionStatus: 'PENDING',
  email: 'Grover_McClure18@yahoo.com',
  phoneNumber: 'aw',
};

export const sampleWithFullData: IAdoptionRequest = {
  id: 12381,
  reasonOfAdoption: '../fake-data/blob/hipster.txt',
  adoptionStatus: 'ACCEPTED',
  email: 'Cleveland_Abshire42@hotmail.com',
  phoneNumber: 'incinerate abaft',
};

export const sampleWithNewData: NewAdoptionRequest = {
  reasonOfAdoption: '../fake-data/blob/hipster.txt',
  adoptionStatus: 'ACCEPTED',
  email: 'Destin50@yahoo.com',
  phoneNumber: 'typewriter since gray',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
