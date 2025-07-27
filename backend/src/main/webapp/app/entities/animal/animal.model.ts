import { AdoptionStatus } from 'app/entities/enumerations/adoption-status.model';

export interface IAnimal {
  id: number;
  name?: string | null;
  race?: string | null;
  age?: number | null;
  gender?: string | null;
  description?: string | null;
  adoptionStatus?: keyof typeof AdoptionStatus | null;
  imageUrl?: string | null;
}

export type NewAnimal = Omit<IAnimal, 'id'> & { id: null };
