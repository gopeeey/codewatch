import { Transaction } from "src/types";

export class StorageTransaction implements Transaction {
  ended: boolean = false;

  async commit() {}

  async commitAndEnd() {}

  async rollback() {}

  async rollbackAndEnd() {}

  async end() {}
}
