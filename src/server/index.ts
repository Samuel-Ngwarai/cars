import express, { Express } from 'express';
import bodyparser from 'body-parser';

import { CarsManagementController } from '../controllers/cars-management-controller';
import { IRoute } from '../routes/routes-i';

const port = 3000;
export class Server {
  private server: Express;

  public constructor() {
    this.server = express();
  }

  public async init(listen: boolean): Promise<Express> {
    try {
      if (listen) {
        await this.server.listen(port);
      }
      console.log('Server::init - Server running at:', {
        uri: `localhost:${port}`,
      });
    } catch (error) {
      console.error('Server::init - Server failed to start', { error });
      process.exit(1);
    }

    return this.server;
  }

  public addExtensions() {
    this.server.use(bodyparser.json());
  }

  public addRoutes(routes: IRoute, carsManagementController: CarsManagementController): void {    
    routes.register(this.server, carsManagementController);
  }

  public addErrorHandler() {
    this.server.use((err, req, res, next) => {
      // TODO: Extend error handler
      console.error(err);
      res.status(500).send('Something broke!')
    })
  }
}
