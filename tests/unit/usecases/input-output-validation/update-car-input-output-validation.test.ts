import { Request, Response, NextFunction } from 'express';

import { InputValidationUsecase, OutputValidationUsecase } from '../../../../src/usecases/input-output-validation/input-output-validation-usecase';

describe(__filename, () => {
  const inputValidationUsecase = new InputValidationUsecase();
  const outputValidationUsecase = new OutputValidationUsecase();

  const mockNext = () => {};

  describe('InputValidationUsecase', () => {
    it('should correctly validate input', () => {

      const mockRequest = {
        originalUrl: '/updateCar',
        body: {
          id: 'SomeUuid',
          model: 'someModel',
          people: 5,
          distance: 5000
        },
      } as Request;

      inputValidationUsecase.execute(mockRequest, {} as Response, mockNext as NextFunction);
    });

    it('should fail on input with missing car id', () => {

      const mockRequest = {
        originalUrl: '/updateCar',
        body: {
          brand: 'someBrand',
          color: 'someColor'
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
        originalUrl: '/updateCar',
        body: {
          id: 'someUUID',
          model: 'someModel',
          brand: 'someBrand',
          color: 'someColor',
          people: 5,
          distance: 5000,
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
        originalUrl: '/updateCar',
        body: {
          id: 'someUUID',
          color: 'someColor',
          people: 50,
          distance: -1,
        },
      } as Request;

      const expectedError = [
        {
          instancePath: '/people',
          schemaPath: '#/properties/people/maximum',
          keyword: 'maximum',
          params: { comparison: '<=', limit: 10 },
          message: 'must be <= 10'
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
          message: 'Update Successful'
        },
        json: () => {}
      } as unknown as Request;

      outputValidationUsecase.execute({ originalUrl: '/updateCar' } as Request, mockResponse as unknown as Response, mockNext as NextFunction);
    });

    // TODO: similar test cases can be compressed with test.each
    it('should fail on input with missing properties', () => {

      const mockResponse = {
        locals: {
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
        outputValidationUsecase.execute({ originalUrl: '/updateCar' } as Request, mockResponse as unknown as Response, mockNext as NextFunction);
        throw new Error('This line should not be reached');
      } catch (error) {
        expect(error.message).toEqual(JSON.stringify(expectedError));
      }
    });

    it('should fail on input with additional properties', () => {

      const mockResponse = {
        locals: {
          message: 'update Successful',
          additional: 'additionalProperty'
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
        outputValidationUsecase.execute({ originalUrl: '/updateCar' } as Request, mockResponse as unknown as Response, mockNext as NextFunction);
        throw new Error('This line should not be reached');
      } catch (error) {
        expect(error.message).toEqual(JSON.stringify(expectedError));
      }
    });

    it('should fail on wrong output type', () => {

      const mockResponse = {
        locals: {
          message: 4
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
        outputValidationUsecase.execute({ originalUrl: '/updateCar' } as Request, mockResponse as unknown as Response, mockNext as NextFunction);
        throw new Error('This line should not be reached');
      } catch (error) {
        expect(error.message).toEqual(JSON.stringify(expectedError));
      }
    });
  });

});
