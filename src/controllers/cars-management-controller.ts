import { Request, Response, NextFunction } from 'express';

import { Car } from '../entities/car';

import { CreateCarUsecase } from '../usecases/car-management/create-car-usecase';

export class CarsManagementController {
    private createCarUsecase = new CreateCarUsecase();
    constructor() {}

    public async createCar(req: Request, res: Response, next: NextFunction): Promise<Car> {
      try {
        const { model, brand, color } = req.body;
        const newCar = this.createCarUsecase.execute({ model, brand, color });

        res.locals = newCar;

        return next();
      } catch (error) {
        console.error('CarsManagementController::createCar, error occurred during car creation');
        return next(error);
      }
    }
}
