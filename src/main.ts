import { Express } from 'express';
import { Server } from './server';
import { Routes } from './routes';

export default class App {
  public expressServer: Express;
  private server: Server;

  public constructor(private readonly listen: boolean) {}

  public async init(): Promise<void> {
    this.server = new Server();

    const routes = new Routes();
    this.server.addExtensions();
    this.server.addRoutes(routes);
    this.server.addErrorHandler();

    this.expressServer = await this.server.init(this.listen);

    console.log('App::init - Application started');
  }
}

if (require.main === module) {
  const app = new App(true);
  app.init();
}
