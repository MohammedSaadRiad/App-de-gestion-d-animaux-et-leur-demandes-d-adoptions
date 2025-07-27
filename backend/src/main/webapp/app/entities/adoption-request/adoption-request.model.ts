import { IAnimal } from 'app/entities/animal/animal.model';
import { RequestStatus } from 'app/entities/enumerations/request-status.model';

export interface IAdoptionRequest {
  id: number;
  reasonOfAdoption?: string | null;
  adoptionStatus?: keyof typeof RequestStatus | null;
  email?: string | null;
  phoneNumber?: string | null;
  animal?: IAnimal | null;
}

export type NewAdoptionRequest = Omit<IAdoptionRequest, 'id'> & { id: null };
