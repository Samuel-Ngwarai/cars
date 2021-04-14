import * as uuid from 'uuid';

jest.mock('uuid');

import { CreateCarUsecase } from '../../../../src/usecases/car-management/create-car-usecase';

describe(__filename, () => {
  const createCarUsecase = new CreateCarUsecase();

  it('should create and return a new car', async () => {
    const uuidSpy = jest.spyOn(uuid, 'v4');
    uuidSpy.mockReturnValue('mocked_uuid');

    const carData = {
      model: 'model',
      brand: 'brand',
      color: 'color'
    };

    const res = await createCarUsecase.execute(carData);

    const expected = {
      id: 'mocked_uuid',
      ...carData
    };

    expect(res).toEqual(expected);
  })
});
