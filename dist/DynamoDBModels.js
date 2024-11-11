"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBModels = void 0;
const dynamoose_1 = __importDefault(require("dynamoose"));
const ConnectionError_1 = require("./ConnectionError");
class DynamoDBModels {
    _options;
    _models;
    constructor(models, options) {
        this._options = {
            prefix: 'aleign-api',
            ...(options || {})
        };
        this._models = {};
        dynamoose_1.default.Table.defaults.set({
            prefix: `${this._options.prefix}-${process.env.STAGE}-`,
            create: false
        });
        this.setupDynamoConnection(this._options);
        this.initialiseModels(models);
    }
    get models() {
        return this._models;
    }
    setupDynamoConnection(config) {
        if (process.env.NODE_ENV === 'development') {
            dynamoose_1.default.aws.ddb.local(process.env.AWS_ENDPOINT_URL);
        }
        if (config.endpoint) {
            const ddb = new dynamoose_1.default.aws.ddb.DynamoDB({
                endpoint: config.endpoint,
                region: config.region || process.env.AWS_REGION,
                credentials: {
                    accessKeyId: config.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: config.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY
                }
            });
            dynamoose_1.default.aws.ddb.set(ddb);
        }
    }
    initialiseModels(models) {
        if (!models?.length)
            return;
        models.forEach(model => this.initialiseModel(model));
    }
    initialiseModel(model) {
        const { name, schema, options, tableName } = model;
        let modelSchema = new dynamoose_1.default.Schema({ ...schema }, { ...(options || {}) });
        try {
            const dynamooseModel = dynamoose_1.default.model(name, modelSchema, { tableName });
            this._models[name] = dynamooseModel;
            this[name] = dynamooseModel;
        }
        catch (e) {
            console.error(e);
            throw new ConnectionError_1.ConnectionError(e.message, e.statusCode || 400);
        }
    }
}
exports.DynamoDBModels = DynamoDBModels;
