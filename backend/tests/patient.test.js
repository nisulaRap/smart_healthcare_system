import request from "supertest";
import mongoose from "mongoose";
import {app} from "../app.js";
import dotenv from "dotenv";
import Patient from "../models/Patient.js";

dotenv.config();

// Setup test DB connection
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

// Cleanup before each test
beforeEach(async () => {
  await Patient.deleteMany();
});

// Close connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

/**
 *  TEST 1: Successful Registration
 */
test("should register a new patient successfully", async () => {
  const res = await request(app)
    .post("/api/patients/register")
    .send({
      name: "Senuri",
      dob: "2002-09-10",
      contact: "0771234567",
      idNumber: "123456789V",
      medicalHistory: "No allergies",
    });

  expect(res.statusCode).toBe(201);
  expect(res.body).toHaveProperty("cardNumber");
  expect(res.body.message).toBe("Registration successful");
});

/**
 *  TEST 2: Missing Required Fields
 */
test("should fail if required fields are missing", async () => {
  const res = await request(app)
    .post("/api/patients/register")
    .send({
      name: "",
      dob: "",
      contact: "",
      idNumber: "",
    });

  expect(res.statusCode).toBe(400);
  expect(res.body.message).toBe("Please fill all required fields.");
});

/**
 *  TEST 3: Duplicate Patient
 */
test("should prevent duplicate registration", async () => {
  await Patient.create({
    name: "Senuri",
    dob: "2002-09-10",
    contact: "0771234567",
    idNumber: "123456789V",
    cardNumber: "HC-ABC123",
  });

  const res = await request(app)
    .post("/api/patients/register")
    .send({
      name: "Senuri",
      dob: "2002-09-10",
      contact: "0771234567",
      idNumber: "123456789V",
    });

  expect(res.statusCode).toBe(400);
  expect(res.body.message).toBe("Patient already exists. Try updating instead.");
});

/**
 *  TEST 4: Successful Update
 */
test("should update an existing patient's details", async () => {
  await Patient.create({
    name: "Senuri",
    dob: "2002-09-10",
    contact: "0771234567",
    idNumber: "987654321V",
    cardNumber: "HC-123AAA",
  });

  const res = await request(app)
    .put("/api/patients/update")
    .send({
      idNumber: "987654321V",
      contact: "0779999999",
      medicalHistory: "Updated test history",
    });

  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBe("Health card updated successfully.");
});

/**
 * TEST 5: Patient Not Found
 */
test("should return 404 if patient not found", async () => {
  const res = await request(app)
    .put("/api/patients/update")
    .send({
      idNumber: "000000000V",
      contact: "0779999999",
    });

  expect(res.statusCode).toBe(404);
  expect(res.body.message).toBe("Patient not found.");
});


