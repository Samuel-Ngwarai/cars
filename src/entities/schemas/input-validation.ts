export const InputSchema = {
  type: 'object',
  properties: {
    model: { type: 'string' },
    brand: { type: 'string' },
    color: { type: 'string' }
  },
  required: ['model', 'brand', 'color'],
  additionalProperties: false,
}
