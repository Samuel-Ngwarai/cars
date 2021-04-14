import { RequestData } from '../entities/request';
import { Car } from '../entities/car';

import { CreateCarUsecase } from '../usecases/car-management/create-car-usecase';

export class CarsManagementController {
    private createCarUsecase = new CreateCarUsecase();
    constructor() {}

    public async createCar(requestBody: RequestData): Promise<Car> {
      try {
        const { model, brand, color } = requestBody;
        const newCar = this.createCarUsecase.execute({ model, brand, color });

        return newCar;
      } catch (error) {
        console.error('CarsManagementController::createCar, error occurred during car creation');
        throw error;
      }
    }
}
