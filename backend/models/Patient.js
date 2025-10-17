import mongoose from "mongoose";

/**
 * @description Patient Schema for Registration and Health Card Management
 * @fields
 *  name, dob, contact, idNumber, medicalHistory, cardNumber, status, issuedAt, createdAt
 */
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  contact: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  medicalHistory: { type: String },

  // Health card details
  cardNumber: { type: String, unique: true, sparse: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  issuedAt: { type: Date },

  // Audit
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Patient", patientSchema);
