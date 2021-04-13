import { Express } from 'express';
import { IRoute } from './routes-i';

export class Routes implements IRoute {
  constructor() {}

  public register(app: Express): void {
    app.get('/readyz', async (req: any, res: any) => {
      console.log(req.body);
      res.json({ ready: true });
    });

    app.get('/healthz', async (req: any, res: any) => {
      console.log('ReqBody  - ', req.body);
      res.json({ healthy: true });
    });

    app.get('/', async (req: any, res: any) => {
      console.log('Handle default route');
      console.log('Reqbody', req.body);
      res.json('handle default route');
    });
  }
}
