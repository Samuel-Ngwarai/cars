import { Express } from 'express';
import { CarsManagementController } from '../controllers/cars-management-controller';

export interface IRoute {
  register: (app: Express, carsManagementController: CarsManagementController) => void;
}
