export const CreateCarResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    model: { type: 'string' },
    brand: { type: 'string' },
    color: { type: 'string' },
    people: { type: 'number', minimum: 1, maximum: 10 },
    distance: { type: 'number', minimum: 0 }
  },
  required: ['id', 'model', 'brand', 'color', 'people', 'distance'],
  additionalProperties: false,
};

export const ResponseMessageSchema = {
  type: 'object',
  properties: {
    message: { type: 'string' }
  },
  required: ['message'],
  additionalProperties: false,
};

export const GetCarsResponseSchema = {
  type: 'array',
  items: CreateCarResponseSchema
};
