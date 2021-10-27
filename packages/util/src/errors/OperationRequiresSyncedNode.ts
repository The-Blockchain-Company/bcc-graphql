import { CustomError } from 'ts-custom-error'

export class OperationRequiresSyncedNode extends CustomError {
  public constructor (operation: string) {
    super()
    this.message = `Cannot ${operation} until bcc-node is close to the network tip`
  }
}
