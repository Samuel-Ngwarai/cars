import { Car } from './car';

export interface IDatabaseService {
    store: (car: Car) => void;
}