export class ConnectionError extends Error {

  statusCode: number

  constructor(message: any, statusCode?: any) {
   super(message)
   this.statusCode = statusCode || message.statusCode
  }
 }
