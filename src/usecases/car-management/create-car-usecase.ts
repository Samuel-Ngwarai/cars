import { Car, CreateCarMetadata } from '../../entities/car';

import { logger } from '../../utils/logger'
export class CreateCarUsecase {
  constructor() {}

  public execute(data: CreateCarMetadata): Car {
    logger.info('CreateCarUsecase::execute')
    try {            
      const newCar = Car.create(data);

      return newCar;
    } catch (error) {
      logger.error('CreateCarUsecase::execute returned an error: ' + error)
      throw error;
    }
  }
}
