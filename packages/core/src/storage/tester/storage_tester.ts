import { GetStorageFunc } from "src/storage/tester/types";
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

  constructor(getStorage: GetStorageFunc) {
    super(getStorage);
    this.init = new Init(getStorage);
    this.close = new Close(getStorage);
    this.createIssue = new CreateIssue(getStorage);
    this.addOccurrence = new AddOccurrence(getStorage);
    this.updateLastOccurrenceOnIssue = new UpdateLastOccurrenceOnIssue(
      getStorage
    );
    this.findIssueIdxArchiveStatusByFingerprint =
      new FindIssueIdxArchiveStatusByFingerprint(getStorage);
    this.runInTransaction = new RunInTransaction(getStorage);
    this.seededCrud = new SeededCrud(getStorage);
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

  run() {
    describe("Storage tests", () => {
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
