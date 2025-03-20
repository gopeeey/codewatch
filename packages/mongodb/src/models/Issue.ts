import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { DbIssue } from "../types";

export const issueSchema = new mongoose.Schema<DbIssue>(
  {
    id: { type: String, default: () => nanoid(30), required: true },
    archived: { type: Boolean, default: false, required: true },
    name: { type: String, required: true },
    fingerprint: { type: String, required: true },
    totalOccurrences: { type: Number, required: true },
    isLog: { type: Boolean, default: false, required: true },
    lastOccurrenceMessage: { type: String },
    lastOccurrenceTimestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
    unhandled: { type: Boolean, default: false, required: true },
    resolved: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

export const issuesCollectionName = "codewatchIssues";
