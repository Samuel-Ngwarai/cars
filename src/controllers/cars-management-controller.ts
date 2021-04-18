import { Request, Response, NextFunction } from 'express';

import { CreateCarMetadata, Car } from '../entities/car';
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

        res.locals = { response: newCar };
        return next();
      } catch (error) {
        logger.error('CarsManagementController::createCar, error occurred during car creation');
        return next(error);
      }
    }

    public async updateCar(req: Request, res: Response, next: NextFunction): Promise<void> {
      logger.info('CarsManagementController::updateCar');
      try {
        const { id, model, brand, color, people, distance } = req.body;
        const updateCarData: Car = { id, model, brand, color, people, distance };

        await this.database.update(updateCarData);

        res.locals = { response: { message: 'Update Successful' } };

        return next();
      } catch (error) {
        logger.error('CarsManagementController::updateCar, error occurred during car update');
        return next(error);
      }
    }

    public async getCars(req: Request, res: Response, next: NextFunction): Promise<void> {
      logger.info('CarsManagementController::getCars');
      try {
        const { id } = req.query as { id: string };

        const cars = await this.database.get(id);

        res.locals = { response: cars };

        return next();
      } catch (error) {
        logger.error('CarsManagementController::getCars, error occurred during car retrieval');
        return next(error);
      }
    }

    public async deleteCar(req: Request, res: Response, next: NextFunction): Promise<void> {
      logger.info('CarsManagementController::deleteCar');
      try {
        const { id } = req.body;

        await this.database.delete(id);

        res.locals = { response: { message: 'Deletion Successful' } };

        return next();
      } catch (error) {
        logger.error('CarsManagementController::deleteCar, error occurred during car deletion');
        return next(error);
      }
    }
}
