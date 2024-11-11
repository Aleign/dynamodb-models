import dynamoose from 'dynamoose'
import { ConnectionError } from './ConnectionError'


interface ModelConfig {
  name: string
  schema: Record<string, any>
  options?: Record<string, any>
  tableName: string
}

interface DynamoDBConfig {
  endpoint?: string
  region?: string
  accessKeyId?: string
  secretAccessKey?: string
}

type DynamooseModel = ReturnType<typeof dynamoose.model>

export class DynamoDBModels {
  private _options: DynamoDBConfig
  private _models: Record<string, DynamooseModel>

  constructor(models: ModelConfig[], options?: DynamoDBConfig) {
    this._options = {
      ...(options || {})
    }
    this._models = {}
    this.setupDynamoConnection(this._options)
    this.initialiseModels(models)
  }

  get models(): Record<string, DynamooseModel> {
    return this._models
  }

  setupDynamoConnection(config: DynamoDBConfig): void {
    if (process.env.NODE_ENV === 'development') {
      dynamoose.aws.ddb.local(process.env.AWS_ENDPOINT_URL!)
    }

    if (config.endpoint) {
      const ddb = new dynamoose.aws.ddb.DynamoDB({
        endpoint: config.endpoint,
        region: config.region || process.env.AWS_REGION,
        credentials: {
          accessKeyId: config.accessKeyId || process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: config.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY!
        }
      })
      dynamoose.aws.ddb.set(ddb)
    }
  }

  initialiseModels(models: ModelConfig[]): void {
    if (!models?.length) return
    models.forEach(model => this.initialiseModel(model))
  }

  initialiseModel(model: ModelConfig): void {
    const { name, schema, options, tableName } = model
    let modelSchema = new dynamoose.Schema({ ...schema }, { ...(options || {}) })

    try {
      const dynamooseModel = dynamoose.model(name, modelSchema, { tableName })
      this._models[name] = dynamooseModel
      ;(this as any)[name] = dynamooseModel

    } catch (e: any) {
      console.error(e)
      throw new ConnectionError(e.message, e.statusCode || 400)
    }
  }
}