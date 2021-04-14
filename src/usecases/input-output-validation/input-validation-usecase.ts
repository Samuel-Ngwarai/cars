import Ajv from 'ajv';
import { Request, Response, NextFunction } from 'express';

import { InputSchema } from '../../entities/schemas/input-validation';
import { OutputSchema } from '../../entities/schemas/output-validation';

export class InputValidationUsecase {
  private ajv;
  private validator;
  constructor() {
    this.ajv = new Ajv();
    this.validator = this.ajv.compile(InputSchema);
  }
    
  public execute(req: Request, res: Response, next: NextFunction) {
    console.log('InputValidationUsecase::execute');

    try {
      const valid = this.validator(req?.body);

      if (!valid) {
        throw this.validator?.errors;
      }
      next();
    } catch (error) {
      console.log('InputValidationUsecase::execute, error occured during input validation ', error);
      throw error;
    }
  }
};

export class OutputValidationUsecase {
  private ajv;
  private validator;
  constructor() {
    this.ajv = new Ajv();
    this.validator = this.ajv.compile(OutputSchema);
  }
    
  public execute(req: Request, res: Response, next: NextFunction) {
    console.log('OutputValidationUsecase::execute');

    try {
      const valid = this.validator(res?.locals);

      if (!valid) {
        throw this.validator?.errors;
      }
      res.json(res?.locals);
    } catch (error) {
      console.log('OutputValidationUsecase::execute, error occured during input validation ', error);
      throw error;
    }
  }
};
