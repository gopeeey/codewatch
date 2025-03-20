import mongoose from "mongoose";
import { DbOccurrence } from "../types";

export const occurrenceSchema = new mongoose.Schema<DbOccurrence>({
  issueId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true, default: () => Date.now() },
  stdoutLogs: {
    type: [{ type: { timestamp: Number, message: String } }],
    default: [],
    required: true,
  },
  stderrLogs: {
    type: [{ type: { timestamp: Number, message: String } }],
    default: [],
    required: true,
  },
  stack: { type: String, required: true },
  extraData: {},
  systemInfo: {
    deviceMemory: { type: Number, required: true },
    freeMemory: { type: Number, required: true },
    appMemoryUsage: { type: Number, required: true },
    deviceUptime: { type: Number, required: true },
    appUptime: { type: Number, required: true },
  },
  context: { type: [{ type: [String] }] },
});

export const occurrencesCollectionName = "codewatchOccurrences";
