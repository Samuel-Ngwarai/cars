import { Request, Response, NextFunction } from 'express';

import { InputValidationUsecase, OutputValidationUsecase } from '../../../../src/usecases/input-output-validation/input-output-validation-usecase';

describe(__filename, () => {
  const inputValidationUsecase = new InputValidationUsecase();
  const outputValidationUsecase = new OutputValidationUsecase();

  const mockNext = () => {};

  describe('InputValidationUsecase', () => {
    it('should correctly validate input', () => {

      const mockRequest = {
        body: {
          model: 'someModel',
          brand: 'someBrand',
          color: 'someColor',
          people: 5,
          distance: 5000
        },
      } as Request;

      inputValidationUsecase.execute(mockRequest, {} as Response, mockNext as NextFunction);
    });

    it('should fail on input with missing properties', () => {

      const mockRequest = {
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
          params: { missingProperty: 'model' },
          message: 'must have required property \'model\''
        },
      ]

      try {
        inputValidationUsecase.execute(mockRequest, {} as Response, mockNext as NextFunction);
        throw new Error('This line should not be reached');
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });

    it('should fail on input with additional properties', () => {

      const mockRequest = {
        body: {
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
        expect(error).toEqual(expectedError);
      }
    })

    // TODO: can be automated for each wrong input with test.each()
    it('should fail on invalid input', () => {

      const mockRequest = {
        body: {
          model: 'someModel',
          brand: 'someBrand',
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
        expect(error).toEqual(expectedError);
      }
    })
  });

  describe('OutputValidationUsecase', () => {
    it('should correctly validate input', () => {

      const mockResponse = {
        locals: {
          id: 'someUUID',
          model: 'someModel',
          brand: 'someBrand',
          color: 'someColor',
          people: 5,
          distance: 5000
        },
        json: () => {}
      } as unknown as Request;

      outputValidationUsecase.execute({} as Request, mockResponse as unknown as Response, mockNext as NextFunction);
    });

    // TODO: similar test cases can be compressed with test.each
    it('should fail on input with missing properties', () => {

      const mockResponse = {
        locals: {
          brand: 'someBrand',
          color: 'someColor'
        },
      } as unknown as Request;

      const expectedError = [
        {
          instancePath: '',
          schemaPath: '#/required',
          keyword: 'required',
          params: { missingProperty: 'id' },
          message: 'must have required property \'id\''
        },
      ]

      try {
        outputValidationUsecase.execute({} as Request, mockResponse as unknown as Response, mockNext as NextFunction);
        throw new Error('This line should not be reached');
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });

    it('should fail on input with additional properties', () => {

      const mockResponse = {
        locals: {
          id: 'someUUID',
          model: 'someModel',
          brand: 'someBrand',
          color: 'someColor',
          people: 5,
          distance: 5000,
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
        outputValidationUsecase.execute({} as Request, mockResponse as unknown as Response, mockNext as NextFunction);
        throw new Error('This line should not be reached');
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });

    it('should fail on input with additional properties', () => {

      const mockResponse = {
        locals: {
          id: 'someUUID',
          model: 'someModel',
          brand: 'someBrand',
          color: 'someColor',
          people: 50,
          distance: -1

        },
      } as unknown as  Request;
  
      const expectedError =  [
        {
          instancePath: '/people',
          schemaPath: '#/properties/people/maximum',
          keyword: 'maximum',
          params: { comparison: '<=', limit: 10 },
          message: 'must be <= 10'
        },
      ];
  
  
      try {
        outputValidationUsecase.execute({} as Request, mockResponse as unknown as Response, mockNext as NextFunction);
        throw new Error('This line should not be reached');
      } catch (error) {
        expect(error).toEqual(expectedError);
      }
    });
  });

});
