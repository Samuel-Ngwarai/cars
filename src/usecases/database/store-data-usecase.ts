import { Car } from '../../entities/car';
import { IDatabaseService } from '../../entities/database-i';
import { GeneralError } from '../../entities/error';

import { logger } from '../../utils/logger';

export class StoreCarUsecase {
  constructor(private readonly database: IDatabaseService) {}

  public async execute(car: Car): Promise<void> {
    logger.info('StoreCarUsecase::execute');
    try {
      await this.database.store(car);
    } catch (error) {
      logger.error('StoreCarUsecase::execute, error occured while storing car to database');
      throw new GeneralError({ message: error.message });
    }
  }
}
