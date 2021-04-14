import { Express, Request, Response, NextFunction } from 'express';

import { IRoute } from './routes-i';
import { CarsManagementController } from '../controllers/cars-management-controller';
import { InputValidationUsecase, OutputValidationUsecase } from '../usecases/input-output-validation/input-output-validation-usecase';

export class Routes implements IRoute {
  private inputValidationUsecase = new InputValidationUsecase();
  private outputValidationUsecase = new OutputValidationUsecase();
  constructor() {}

  public register(app: Express, carsManagementController: CarsManagementController): void {
    app.get('/', async () => {
      throw new Error('Uknown route called. Try "/createCar" for example')
    });

    app.get('/readyz', async (req: Request, res: Response) => {
      res.json({ ready: true });
    });

    app.get('/healthz', async (req: Request, res: Response) => {
      res.json({ healthy: true });
    });

    app.post('/createCar', 
      this.inputValidationUsecase.execute.bind(this.inputValidationUsecase),
      carsManagementController.createCar.bind(carsManagementController),
      this.outputValidationUsecase.execute.bind(this.outputValidationUsecase));
  }
}
