import { Car, CreateCarMetadata } from '../../entities/car';
import { GeneralError } from '../../entities/error';

import { logger } from '../../utils/logger';
export class CreateCarUsecase {
  constructor() {}

  public execute(data: CreateCarMetadata): Car {
    logger.info('CreateCarUsecase::execute');
    try {
      const newCar = Car.create(data);

      return newCar;
    } catch (error) {
      logger.error('CreateCarUsecase::execute returned an error: ' + error);
      throw new GeneralError({ message: error.message, status: error.status });
    }
  }
}
