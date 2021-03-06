import { Car } from './car';

export interface IDatabaseService {
    store: (car: Car) => void;
    update: (car: Car) => void;
    get: (id?: string) => Promise<Car[]>;
    delete: (id: string) => void;
}
