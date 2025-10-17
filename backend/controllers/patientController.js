import Patient from "../models/Patient.js";
import crypto from "crypto";

/**
 * @desc Register a new patient (status: pending)
 * @route POST /api/patients/register
 */
export const registerPatient = async (req, res) => {
  try {
    const { name, dob, contact, idNumber, medicalHistory } = req.body;

    // Validate required fields
    if (!name || !dob || !contact || !idNumber) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields." });
    }

    // Check if patient already exists
    const existing = await Patient.findOne({ idNumber });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Patient already exists. Try updating instead." });
    }

    // Create new patient (status: pending, no card yet)
    const patient = await Patient.create({
      name,
      dob,
      contact,
      idNumber,
      medicalHistory,
      status: "pending",
    });

    res.status(201).json({
      message: "Registration successful. Awaiting card issuance approval.",
      patient,
    });
  } catch (error) {
    console.error("❌ Error registering patient:", error.message);
    res.status(500).json({ message: "Please try again later." });
  }
};

/**
 * @desc Get all registered patients (Admin view)
 * @route GET /api/patients
 */
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch patients." });
  }
};

/**
 * @desc Get single patient details (for Health Card page)
 * @route GET /api/patients/:id
 */
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving patient details." });
  }
};

/**
 * @desc Update health card status (Approve / Reject)
 * @route PUT /api/patients/:id
 */
export const updateHealthCardStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    patient.status = status;

    // If approved, generate card number
    if (status === "approved" && !patient.cardNumber) {
      patient.cardNumber =
        "HC-" + crypto.randomBytes(3).toString("hex").toUpperCase();
      patient.issuedAt = new Date();
    }

    await patient.save();
    res.json({ message: `Patient ${status} successfully.`, patient });
  } catch (error) {
    console.error("❌ Error updating status:", error.message);
    res.status(500).json({ message: "Failed to update health card status." });
  }
};

/**
 * @desc Update existing patient info (for editing details)
 * @route PUT /api/patients/update
 */
export const updateHealthCard = async (req, res) => {
  try {
    const { idNumber, name, contact, medicalHistory } = req.body;
    const patient = await Patient.findOne({ idNumber });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found." });
    }

    if (name) patient.name = name;
    if (contact) patient.contact = contact;
    if (medicalHistory) patient.medicalHistory = medicalHistory;

    await patient.save();
    res.json({ message: "Health card updated successfully.", patient });
  } catch (error) {
    res.status(500).json({ message: "Please try again later." });
  }
};
