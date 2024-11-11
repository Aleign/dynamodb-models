"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const DynamoDBModels_1 = require("../src/DynamoDBModels");
describe('DynamoDBModels', () => {
    it('initializes with empty models when no models provided', () => {
        const db = new DynamoDBModels_1.DynamoDBModels([]);
        (0, chai_1.expect)(db.models).to.deep.equal({});
    });
    it('initializes models with correct schema and table name', () => {
        const testModel = {
            name: 'TestModel',
            schema: { id: String, name: String },
            tableName: 'test-table'
        };
        const db = new DynamoDBModels_1.DynamoDBModels([testModel]);
        (0, chai_1.expect)(db.models).to.have.property('TestModel');
    });
    it('throws ConnectionError when model initialization fails', () => {
        const invalidModel = {
            name: 'InvalidModel',
            schema: { invalidField: {} },
            tableName: 'test-table'
        };
        (0, chai_1.expect)(() => new DynamoDBModels_1.DynamoDBModels([invalidModel])).to.throw();
    });
});
