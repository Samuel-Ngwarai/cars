import { Car, CreateCarMetadata } from '../../entities/car';

export class CreateCarUsecase {
  constructor() {}

  public execute(data: CreateCarMetadata): Car {
    console.log('CreateCarUsecase::execute')
    try {            
      const newCar = Car.create(data);

      return newCar;
    } catch (error) {
      console.log('CreateCarUsecase::execute returned an error: ' + error)
      throw error;
    }
  }
}
