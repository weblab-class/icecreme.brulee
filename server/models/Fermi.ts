import { Schema, model, Document } from "mongoose";
const mongoose = require("mongoose");

const FermiSchema = new Schema({
  question: String,
  answer: Number,
});

export interface Fermi extends Document {
  question: string;
  answer: number;
}

const FermiModel = model<Fermi>("Fermi", FermiSchema);

module.exports = mongoose.model("Fermi", FermiSchema);