import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

export type CreateCarMetadata = {
    color: string;
    brand: string;
    model: string;
    people: number;
    distance: number;
};

export class Car {
  public id: string;
  public color: string;
  public model: string;
  public brand: string;
  public people: number;
  public distance: number;

  public static create(data: CreateCarMetadata): Car {
    const { color, brand, model, people, distance } = data;
    const instance = new Car();

    instance.id = uuidv4();
    instance.color = color;
    instance.model = model;
    instance.brand = brand;
    instance.people = people;
    instance.distance = distance;

    return instance;
  }
}

export const MongooseCarSchema = new mongoose.Schema({
  id: { type : String, unique : true, required : true, dropDups: true },
  color: { type : String, required : true },
  model: { type : String, required : true },
  brand: { type : String, required : true },
  people: { type : String, required : true },
  distance: { type : String, required : true }
});
