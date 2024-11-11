import { expect } from 'chai'
import { DynamoDBModels } from '../src/DynamoDBModels'

describe('DynamoDBModels', () => {
  it('initializes with empty models when no models provided', () => {
    const db = new DynamoDBModels([])
    expect(db.models).to.deep.equal({})
  })

  it('initializes models with correct schema and table name', () => {
    const testModel = {
      name: 'TestModel',
      schema: { id: String, name: String },
      tableName: 'test-table'
    }
    
    const db = new DynamoDBModels([testModel])
    expect(db.models).to.have.property('TestModel')
  })

  it('throws ConnectionError when model initialization fails', () => {
    const invalidModel = {
      name: 'InvalidModel',
      schema: { invalidField: {} },
      tableName: 'test-table'
    }
    
    expect(() => new DynamoDBModels([invalidModel])).to.throw()
  })
})
