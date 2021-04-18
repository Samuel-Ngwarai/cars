export const CreateCarSchema = {
  type: 'object',
  properties: {
    model: { type: 'string' },
    brand: { type: 'string' },
    color: { type: 'string' },
    people: { type: 'number', minimum: 1, maximum: 10 },
    distance: { type: 'number', minimum: 0 }
  },
  required: ['model', 'brand', 'color', 'people', 'distance'],
  additionalProperties: false,
};

export const UpdateCarSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    model: { type: 'string' },
    brand: { type: 'string' },
    color: { type: 'string' },
    people: { type: 'number', minimum: 1, maximum: 10 },
    distance: { type: 'number', minimum: 0 }
  },
  required: ['id'],
  additionalProperties: false,
};

export const DeleteCarSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
  },
  required: ['id'],
  additionalProperties: false,
};
