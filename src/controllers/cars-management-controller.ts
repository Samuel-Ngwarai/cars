import { Request, Response, NextFunction } from 'express';

import { Car, CreateCarMetadata } from '../entities/car';

import { CreateCarUsecase } from '../usecases/car-management/create-car-usecase';
import { logger } from '../utils/logger';

export class CarsManagementController {
    private createCarUsecase = new CreateCarUsecase();
    constructor() {}

    public async createCar(req: Request, res: Response, next: NextFunction): Promise<Car> {
      logger.info('CarsManagementController::createCar')
      try {
        const { model, brand, color, people, distance } = req.body;
        const createCarData: CreateCarMetadata = { model, brand, color, people, distance };
        const newCar = this.createCarUsecase.execute(createCarData);

        res.locals = newCar;

        return next();
      } catch (error) {
        logger.error('CarsManagementController::createCar, error occurred during car creation');
        return next(error);
      }
    }
}
