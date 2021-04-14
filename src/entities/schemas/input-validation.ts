export const InputSchema = {
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
