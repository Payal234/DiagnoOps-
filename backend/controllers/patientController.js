import Patient from "../models/Patient.js";
import bcrypt from "bcryptjs";

// Save patient from order data (called when order is created/payment verified)
export const savePatientFromOrder = async (orderData) => {
  try {
    const {
      userName,
      userEmail,
      userContact,
      userAddress,
      userAge,
      userGender,
      userBloodGroup,
      userAllergies,
      adminId,
      orderId,
      dbOrderId,
      items,
      paymentStatus,
      bookingStatus,
      bookedAt,
    } = orderData;

    // Check if patient already exists with same email
    const existingPatient = await Patient.findOne({ email: userEmail });

    if (existingPatient) {
      // Update existing patient with lab info
      existingPatient.labAdminId = adminId;
      existingPatient.orderId = orderId;

      if (userAddress) {
        existingPatient.address = userAddress;
      }

      existingPatient.lastBooking = {
        dbOrderId: dbOrderId || existingPatient.lastBooking?.dbOrderId,
        orderId,
        items: Array.isArray(items)
          ? items.map((it) => ({
              id: it?.id,
              name: it?.name,
              price: it?.price,
              quantity: it?.quantity,
            }))
          : existingPatient.lastBooking?.items || [],
        paymentStatus: paymentStatus || existingPatient.lastBooking?.paymentStatus,
        bookingStatus: bookingStatus || existingPatient.lastBooking?.bookingStatus,
        bookedAt: bookedAt || existingPatient.lastBooking?.bookedAt,
      };

      await existingPatient.save();
      return existingPatient;
    }

    // Create new patient from order
    const newPatient = new Patient({
      name: userName,
      email: userEmail,
      address: userAddress,
      phone: userContact,
      age: userAge,
      gender: userGender,
      bloodGroup: userBloodGroup,
      allergies: userAllergies,
      labAdminId: adminId,
      orderId: orderId,

      lastBooking: {
        dbOrderId,
        orderId,
        items: Array.isArray(items)
          ? items.map((it) => ({
              id: it?.id,
              name: it?.name,
              price: it?.price,
              quantity: it?.quantity,
            }))
          : [],
        paymentStatus,
        bookingStatus,
        bookedAt,
      },
    });

    await newPatient.save();
    return newPatient;
  } catch (error) {
    console.error("Error saving patient from order:", error);
    throw error;
  }
};

// Get all patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get patient by ID
export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id).select("-password");
    
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get patients by lab admin
export const getPatientsByLab = async (req, res) => {
  try {
    // ✅ Token se labId lo (secure)
    const labAdminId = req.user.id;

    const patients = await Patient.find({ labAdminId })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register a new patient
export const registerPatient = async (req, res) => {
  try {
    const { name, email, password, address, phone, bloodGroup, gender, age, allergies } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }

    const existing = await Patient.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Patient already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const patient = new Patient({
      name,
      email,
      password: hashed,
      address,
      phone,
      bloodGroup,
      gender,
      age,
      allergies,
    });

    await patient.save();

    res.json({ success: true, message: "Patient registered successfully", patientId: patient._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update patient
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone, bloodGroup, gender, age, allergies } = req.body;

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    if (name) patient.name = name;
    if (address) patient.address = address;
    if (phone) patient.phone = phone;
    if (bloodGroup) patient.bloodGroup = bloodGroup;
    if (gender) patient.gender = gender;
    if (age) patient.age = age;
    if (allergies) patient.allergies = allergies;

    await patient.save();

    res.json({ success: true, message: "Patient updated successfully", patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete patient
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Patient.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.json({ success: true, message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
