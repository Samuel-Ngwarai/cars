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
      if (req.method === 'GET') {
        logger.info(`InputValidationUsecase::execute, skipping input validation for ${req.path}`);
        return next();
      }

      let schema;
      switch(req.method) {
      case 'POST':
        schema = CreateCarSchema;
        break;
      case 'PUT':
        schema = UpdateCarSchema;
        break;
      case 'DELETE':
        schema = DeleteCarSchema;
        break;
      default:
        throw new GeneralError({ message: `${req.method} ${req.originalUrl} does not have a schema definition` });
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

      switch(req.method) {
      case 'POST':
        schema = CreateCarResponseSchema;
        break;
      case 'PUT':
        schema = ResponseMessageSchema;
        break;
      case 'GET':
        schema = GetCarsResponseSchema;
        break;
      case 'DELETE':
        schema = ResponseMessageSchema;
        break;
      default:
        throw new GeneralError({ message: `${req.method} ${req.originalUrl} does not have a schema definition` });
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
