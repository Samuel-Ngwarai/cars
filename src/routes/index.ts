import { Express, Request, Response, NextFunction } from 'express';

import { IRoute } from './routes-i';
import { CarsManagementController } from '../controllers/cars-management-controller';
import { InputValidationUsecase, OutputValidationUsecase } from '../usecases/input-output-validation/input-output-validation-usecase';

export class Routes implements IRoute {
  private inputValidationUsecase = new InputValidationUsecase();
  private outputValidationUsecase = new OutputValidationUsecase();
  constructor() {}

  public register(app: Express, carsManagementController: CarsManagementController): void {
    app.get('/', async (req: Request, res: Response) => {
      res.status(404).send('Uknown route called. Try "/createCar" for example');
    });

    app.get('/readyz', async (req: Request, res: Response) => {
      res.json({ ready: true });
    });

    app.get('/healthz', async (req: Request, res: Response) => {
      res.json({ healthy: true });
    });

    app.post('/car',
      this.inputValidationUsecase.execute.bind(this.inputValidationUsecase),
      carsManagementController.createCar.bind(carsManagementController),
      this.outputValidationUsecase.execute.bind(this.outputValidationUsecase));

    app.put('/car',
      this.inputValidationUsecase.execute.bind(this.inputValidationUsecase),
      carsManagementController.updateCar.bind(carsManagementController),
      this.outputValidationUsecase.execute.bind(this.outputValidationUsecase));

    app.get('/car',
      this.inputValidationUsecase.execute.bind(this.inputValidationUsecase),
      carsManagementController.getCars.bind(carsManagementController),
      this.outputValidationUsecase.execute.bind(this.outputValidationUsecase));


    app.delete('/car',
      this.inputValidationUsecase.execute.bind(this.inputValidationUsecase),
      carsManagementController.deleteCar.bind(carsManagementController),
      this.outputValidationUsecase.execute.bind(this.outputValidationUsecase));

    app.get('*',function (req: Request, res: Response) {
      res.status(404).send('Uknown route called. Try "/createCar" for example');
    });
  }
}
