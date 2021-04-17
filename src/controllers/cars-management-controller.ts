import { Request, Response, NextFunction } from 'express';

import { CreateCarMetadata } from '../entities/car';
import { IDatabaseService } from '../entities/database-i';

import { CreateCarUsecase } from '../usecases/car-management/create-car-usecase';
import { StoreCarUsecase } from '../usecases/database/store-data-usecase';
import { logger } from '../utils/logger';

export class CarsManagementController {
    private createCarUsecase = new CreateCarUsecase();
    private storeCarUsecase = new StoreCarUsecase(this.database);
    constructor(private readonly database: IDatabaseService) {}

    public async createCar(req: Request, res: Response, next: NextFunction): Promise<void> {
      logger.info('CarsManagementController::createCar');
      try {
        const { model, brand, color, people, distance } = req.body;
        const createCarData: CreateCarMetadata = { model, brand, color, people, distance };
        const newCar = this.createCarUsecase.execute(createCarData);

        await this.storeCarUsecase.execute(newCar);

        res.locals = newCar;
        return next();
      } catch (error) {
        logger.error('CarsManagementController::createCar, error occurred during car creation');
        return next(error);
      }
    }
}
