import { StorageTransaction } from "codewatch-core/dist/storage";
import { ClientSession } from "mongoose";
import { IssueModel } from "./IssueModel";

export class MongoDbTransaction extends StorageTransaction {
  session: ClientSession;

  private constructor(session: ClientSession) {
    super();
    this.session = session;
    this.ended = false;
  }

  static async start() {
    const session = await IssueModel.startSession();
    session.startTransaction();
    return new MongoDbTransaction(session);
  }

  async commit() {
    await this.session.commitTransaction();
    this.session.startTransaction();
  }

  async rollback() {
    await this.session.abortTransaction();
    this.session.startTransaction();
  }

  async end() {
    await this.session.endSession();
    this.ended = true;
  }

  async commitAndEnd(): Promise<void> {
    await this.session.commitTransaction();
    await this.end();
  }

  async rollbackAndEnd() {
    await this.session.abortTransaction();
    await this.end();
  }
}
