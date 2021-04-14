import { v4 as uuidv4 } from 'uuid';

export type CreateCarMetadata = {
    color: string;
    brand: string;
    model: string;
};

export class Car {
  public id: string;
  public color: string;
  public model: string;
  public brand: string;

  public static create(data: CreateCarMetadata): Car {
    const { color, brand, model } = data;
    const instance = new Car();

    instance.id = uuidv4();
    instance.color = color;
    instance.model = model;
    instance.brand = brand;

    return instance;
  }
}
