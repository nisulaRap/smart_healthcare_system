import express from "express";
import {
  registerPatient,
  getAllPatients,
  getPatientById,
  updateHealthCard,
  updateHealthCardStatus,
} from "../controllers/patientController.js";

const router = express.Router();

/**
 * @desc Register a new patient
 * @route POST /api/patients/register
 */
router.post("/register", registerPatient);

/**
 * @desc Get all patients (for Admin Dashboard / Card Issuance)
 * @route GET /api/patients
 */
router.get("/", getAllPatients);

/**
 * @desc Get single patient by ID (for Health Card page)
 * @route GET /api/patients/:id
 */
router.get("/:id", getPatientById);

/**
 * @desc Update health card status (Approve / Reject)
 * @route PUT /api/patients/:id
 */
router.put("/:id", updateHealthCardStatus);

/**
 * @desc Update patient details (edit info)
 * @route PUT /api/patients/update
 */
router.put("/update", updateHealthCard);

export default router;
