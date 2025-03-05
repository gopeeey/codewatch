import { GetStorageFunc } from "dev/types";
import { AddOccurrence } from "./AddOccurrence";
import { Close } from "./Close";
import { CreateIssue } from "./CreateIssue";
import { FindIssueIdxArchiveStatusByFingerprint } from "./FindIssueIdxArchiveStatusByFingerprint";
import { Init } from "./Init";
import { StorageScenario } from "./StorageScenario";
import { UpdateLastOccurrenceOnIssue } from "./UpdateLastOccurrenceOnIssue";

export class StorageTester extends StorageScenario {
  init: Init;
  close: Close;
  createIssue: CreateIssue;
  addOccurrence: AddOccurrence;
  updateLastOccurrenceOnIssue: UpdateLastOccurrenceOnIssue;
  findIssueIdxArchiveStatusByFingerprint: FindIssueIdxArchiveStatusByFingerprint;

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
    });
  }
}
