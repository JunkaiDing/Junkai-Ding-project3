import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    difficulty: { type: String, enum: ["EASY", "NORMAL", "CUSTOM"], required: true },
    createdBy: { type: String, required: true },
    solution: { type: [[Number]], required: true },
    initialBoard: { type: [[Number]], required: true },
    board: { type: [[Number]], required: true },
    status: { type: String, enum: ["playing", "won"], default: "playing" },
    config: { type: Object, required: true },
    completedBy: { type: [String], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("Game", gameSchema);
