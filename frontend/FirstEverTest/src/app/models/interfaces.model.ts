export interface Animal {
  id: number;
  name: string;
  race: string;
  age: number;
  gender: 'M' | 'F';
  description: string;
  adoptionStatus: 'ADOPTED' | 'AVAILABLE' | string;
  adoptionRequest: any; // can refine later
  imageUrl: string;
}



export interface APIResponseModel {
  message: string;
  result: boolean;
  data : any;
}



export interface AdoptionRequest {
  id: number;
  reasonOfAdoption: string;
  adoptionStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  email: string;
  phoneNumber: string;
  animal: Animal;
}