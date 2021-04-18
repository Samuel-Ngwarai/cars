import { Request, Response, NextFunction } from 'express';

import { InputValidationUsecase, OutputValidationUsecase } from '../../../../src/usecases/input-output-validation/input-output-validation-usecase';

describe(__filename, () => {
  const inputValidationUsecase = new InputValidationUsecase();
  const outputValidationUsecase = new OutputValidationUsecase();
  const path = '/deleteCar';
  const method = 'DELETE';

  const mockNext = () => {};

  describe('InputValidationUsecase', () => {
    it('should correctly validate input', () => {

      const mockRequest = {
        path,
        method,
        body: {
          id: 'SomeUuid',
        },
      } as Request;

      inputValidationUsecase.execute(mockRequest, {} as Response, mockNext as NextFunction);
    });

    it('should fail on input with missing car id', () => {

      const mockRequest = {
        path,
        method,
        body: {
        },
      } as Request;

      const expectedError = [
        {
          instancePath: '',
          schemaPath: '#/required',
          keyword: 'required',
          params: { missingProperty: 'id' },
          message: 'must have required property \'id\''
        },
      ];

      try {
        inputValidationUsecase.execute(mockRequest, {} as Response, mockNext as NextFunction);
        throw new Error('This line should not be reached');
      } catch (error) {
        expect(error.message).toEqual(JSON.stringify(expectedError));
      }
    });

    it('should fail on input with additional properties', () => {

      const mockRequest = {
        path,
        method,
        body: {
          id: 'someUUID',
          additional: 'additionalProperty'
        },
      } as Request;

      const expectedError = [
        {
          instancePath: '',
          schemaPath: '#/additionalProperties',
          keyword: 'additionalProperties',
          params: { additionalProperty: 'additional' },
          message: 'must NOT have additional properties'
        },
      ];


      try {
        inputValidationUsecase.execute(mockRequest, {} as Response, mockNext as NextFunction);
        throw new Error('This line should not be reached');
      } catch (error) {
        expect(error.message).toEqual(JSON.stringify(expectedError));
      }
    });

    // TODO: can be automated for each wrong input with test.each()
    it('should fail on invalid input', () => {

      const mockRequest = {
        path,
        method,
        body: {
          id: 128,
        },
      } as Request;

      const expectedError = [
        {
          instancePath: '/id',
          schemaPath: '#/properties/id/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string'
        },
      ];


      try {
        inputValidationUsecase.execute(mockRequest, {} as Response, mockNext as NextFunction);
        throw new Error('This line should not be reached');
      } catch (error) {
        expect(error.message).toEqual(JSON.stringify(expectedError));
      }
    });
  });

  describe('OutputValidationUsecase', () => {
    it('should correctly validate input', () => {

      const mockResponse = {
        locals: {
          response: {
            message: 'Deletion Successful'
          }
        },
        json: () => {}
      } as unknown as Request;

      outputValidationUsecase.execute({ path, method } as Request, mockResponse as unknown as Response, mockNext as NextFunction);
    });

    // TODO: similar test cases can be compressed with test.each
    it('should fail on input with missing properties', () => {

      const mockResponse = {
        locals: {
          response: {}
        },
      } as unknown as Request;

      const expectedError = [
        {
          instancePath: '',
          schemaPath: '#/required',
          keyword: 'required',
          params: { missingProperty: 'message' },
          message: 'must have required property \'message\''
        },
      ];

      try {
        outputValidationUsecase.execute({ path, method } as Request, mockResponse as unknown as Response, mockNext as NextFunction);
        throw new Error('This line should not be reached');
      } catch (error) {
        expect(error.message).toEqual(JSON.stringify(expectedError));
      }
    });

    it('should fail on input with additional properties', () => {

      const mockResponse = {
        locals: {
          response: {
            message: 'Deletion Successful',
            additional: 'additionalProperty'
          }
        },
      } as unknown as  Request;

      const expectedError =  [
        {
          instancePath: '',
          schemaPath: '#/additionalProperties',
          keyword: 'additionalProperties',
          params: { additionalProperty: 'additional' },
          message: 'must NOT have additional properties'
        },
      ];


      try {
        outputValidationUsecase.execute({ path, method } as Request, mockResponse as unknown as Response, mockNext as NextFunction);
        throw new Error('This line should not be reached');
      } catch (error) {
        expect(error.message).toEqual(JSON.stringify(expectedError));
      }
    });

    it('should fail on wrong output type', () => {

      const mockResponse = {
        locals: {
          response: {
            message: 4
          }
        },
      } as unknown as  Request;

      const expectedError =  [
        {
          instancePath: '/message',
          schemaPath: '#/properties/message/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string'
        },
      ];


      try {
        outputValidationUsecase.execute({ path, method } as Request, mockResponse as unknown as Response, mockNext as NextFunction);
        throw new Error('This line should not be reached');
      } catch (error) {
        expect(error.message).toEqual(JSON.stringify(expectedError));
      }
    });
  });

});
