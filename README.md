# @aleign/dynamodb-models

DynamoDB model wrapper using dynamoose for simplified model management.

## Installation

```bash
npm install @aleign/dynamodb-models
```

## Usage

### Basic Model Setup

```typescript
import { DynamoDBModels } from '@aleign/dynamodb-models'

const models = [
  {
    name: 'User',
    schema: {
      id: String,
      name: String,
      email: String
    },
    tableName: 'users-table'
  }
]

const db = new DynamoDBModels(models)
```

### Model Configuration

Each model requires:
- `name`: Model identifier
- `schema`: Dynamoose schema definition
- `tableName`: DynamoDB table name
- `options`: Optional schema configuration

```typescript
const userModel = {
  name: 'User',
  schema: {
    id: String,
    name: String,
    email: {
      type: String,
      required: true
    }
  },
  tableName: 'users-table',
  options: {
    timestamps: true
  }
}
```

### Accessing Models

```typescript
const db = new DynamoDBModels([userModel])

// Access model
const User = db.models.User

// Create new user
const user = new User({
  id: '123',
  name: 'John Doe',
  email: 'john@example.com'
})

await user.save()
```

## Environment Variables

- `AWS_REGION`: AWS Region
- `AWS_ENDPOINT_URL`: Local DynamoDB endpoint for development
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `STAGE`: Environment stage (development, production, etc)

## Configuration Options

```typescript
const options = {
  endpoint: 'http://localhost:8000', // Custom DynamoDB endpoint
  region: 'us-east-1',              // AWS region
  accessKeyId: 'your-key-id',       // AWS access key ID
  secretAccessKey: 'your-secret'    // AWS secret access key
}

const db = new DynamoDBModels(models, options)
```

## Table Naming

Tables are automatically prefixed with:
```
{prefix}-{stage}-
```

Example: `my-api-development-users-table`

## Development

```bash
# Run tests
npm test

# Build package
npm run build
```
