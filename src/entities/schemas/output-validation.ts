export const OutputSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    model: { type: 'string' },
    brand: { type: 'string' },
    color: { type: 'string' }
  },
  required: ['id', 'model', 'brand', 'color'],
  additionalProperties: false,
}
