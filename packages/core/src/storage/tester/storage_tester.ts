import { Storage } from "src/types";
import { AddOccurrence } from "./add_occurrence";
import { Close } from "./close";
import { CreateIssue } from "./create_issue";
import { FindIssueIdxArchiveStatusByFingerprint } from "./find_issue_id_x_archive_status_by_fingerprint";
import { Init } from "./init";
import { RunInTransaction } from "./run_in_transaction";
import { SeededCrud } from "./seeded_crud";
import { StorageScenario } from "./storage_scenario";
import { UpdateLastOccurrenceOnIssue } from "./update_last_occurrence_on_issue";

export class StorageTester extends StorageScenario {
  init: Init;
  close: Close;
  createIssue: CreateIssue;
  addOccurrence: AddOccurrence;
  updateLastOccurrenceOnIssue: UpdateLastOccurrenceOnIssue;
  findIssueIdxArchiveStatusByFingerprint: FindIssueIdxArchiveStatusByFingerprint;
  runInTransaction: RunInTransaction;
  seededCrud: SeededCrud;

  cleanupTables?: () => Promise<void>;
  cleanupDb?: () => Promise<void>;

  private _initTimeout = 10000;

  constructor(storage: Storage) {
    super(storage);
    this.init = new Init(storage);
    this.close = new Close(storage);
    this.createIssue = new CreateIssue(storage);
    this.addOccurrence = new AddOccurrence(storage);
    this.updateLastOccurrenceOnIssue = new UpdateLastOccurrenceOnIssue(storage);
    this.findIssueIdxArchiveStatusByFingerprint =
      new FindIssueIdxArchiveStatusByFingerprint(storage);
    this.runInTransaction = new RunInTransaction(storage);
    this.seededCrud = new SeededCrud(storage);
  }

  setCleanupTablesFunc(
    func: Exclude<StorageTester["cleanupTables"], undefined>,
    timeout?: number
  ) {
    this.setAfterEach(func, timeout || 5000);
  }

  setCleanupDbFunc(
    func: Exclude<StorageTester["cleanupDb"], undefined>,
    timeout?: number
  ) {
    this.setAfterAll(func, timeout || 5000);
  }

  /**
   * Set the amount of time to wait for the storage to be initialized
   * (db connection, migrations etc) in milliseconds, before running the tests
   * @param timeout
   */
  setInitTimeout(timeout: number) {
    this._initTimeout = timeout;
  }

  protected runScenario() {
    describe("Storage tests", () => {
      beforeAll(async () => {
        if (!this._storage.ready) await this._storage.init();
      }, this._initTimeout);

      afterAll(async () => {
        await this._storage.close();
      }, 10000);

      this.callHooks();

      this.init.run();
      this.close.run();
      this.createIssue.run();
      this.addOccurrence.run();
      this.updateLastOccurrenceOnIssue.run();
      this.findIssueIdxArchiveStatusByFingerprint.run();
      this.runInTransaction.run();
      this.seededCrud.run();
    });
  }
}
