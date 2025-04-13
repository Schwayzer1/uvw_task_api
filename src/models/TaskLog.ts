import mongoose, { Document, Schema } from "mongoose";

export interface ITaskLog extends Document {
  taskId: mongoose.Types.ObjectId;
  oldStatus: string;
  newStatus: string;
  updatedBy: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const TaskLogSchema = new Schema<ITaskLog>(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    oldStatus: { type: String, required: true },
    newStatus: { type: String, required: true },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export default mongoose.model<ITaskLog>("TaskLog", TaskLogSchema);
