import dynamoose from 'dynamoose';
interface ModelConfig {
    name: string;
    schema: Record<string, any>;
    options?: Record<string, any>;
    tableName: string;
}
interface DynamoDBConfig {
    endpoint?: string;
    region?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    prefix?: string;
}
type DynamooseModel = ReturnType<typeof dynamoose.model>;
export declare class DynamoDBModels {
    private _options;
    private _models;
    constructor(models: ModelConfig[], options?: DynamoDBConfig);
    get models(): Record<string, DynamooseModel>;
    setupDynamoConnection(config: DynamoDBConfig): void;
    initialiseModels(models: ModelConfig[]): void;
    initialiseModel(model: ModelConfig): void;
}
export {};
