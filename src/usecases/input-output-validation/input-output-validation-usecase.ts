import Ajv from 'ajv';
import { Request, Response, NextFunction } from 'express';
import { GeneralError } from '../../entities/error';

import { CreateCarSchema, UpdateCarSchema, DeleteCarSchema } from '../../entities/schemas/input-validation';
import { CreateCarResponseSchema, ResponseMessageSchema, GetCarsResponseSchema } from '../../entities/schemas/output-validation';

import { logger } from '../../utils/logger';

export class InputValidationUsecase {
  private ajv;
  constructor() {
    this.ajv = new Ajv();
  }

  public execute(req: Request, res: Response, next: NextFunction) {
    logger.debug('InputValidationUsecase::execute');

    try {
      if (req.path === '/getCars') {
        logger.info(`InputValidationUsecase::execute, skipping input validation for ${req.path}`);
        return next();
      }

      let schema;
      switch(req.path) {
      case '/createCar':
        schema = CreateCarSchema;
        break;
      case '/updateCar':
        schema = UpdateCarSchema;
        break;
      case '/deleteCar':
        schema = DeleteCarSchema;
        break;
      default:
        throw new GeneralError({ message: `${req.originalUrl} does not have a schema definition` });
      }

      const validator = this.ajv.compile(schema);

      const valid = validator(req?.body);

      if (!valid) {
        throw validator?.errors;
      }

      next();
    } catch (error) {
      logger.error('InputValidationUsecase::execute, error occured during input validation ', error);
      throw new GeneralError({ message: JSON.stringify(error), status: 422 });
    }
  }
};

export class OutputValidationUsecase {
  private ajv;
  constructor() {
    this.ajv = new Ajv();
  }

  public execute(req: Request, res: Response, next: NextFunction) {
    logger.debug('OutputValidationUsecase::execute');

    try {

      let schema;

      switch(req.path) {
      case '/createCar':
        schema = CreateCarResponseSchema;
        break;
      case '/updateCar':
        schema = ResponseMessageSchema;
        break;
      case '/getCars':
        schema = GetCarsResponseSchema;
        break;
      case '/deleteCar':
        schema = ResponseMessageSchema;
        break;
      default:
        throw new GeneralError({ message: `${req.originalUrl} does not have a schema definition` });
      }

      const validator = this.ajv.compile(schema);

      const valid = validator(res?.locals?.response);

      if (!valid) {
        throw validator?.errors;
      }
      res.json(res?.locals?.response);
    } catch (error) {
      logger.error('OutputValidationUsecase::execute, error occured during output validation ', error);
      throw new GeneralError({ message: JSON.stringify(error), status: 422 });
    }
  }
};
