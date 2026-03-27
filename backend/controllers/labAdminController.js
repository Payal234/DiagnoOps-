import LabAdmin from "../models/LabAdmin.js";
import SuperAdmin from "../models/SuperAdmin.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

export const loginLabAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const labAdmin = await LabAdmin.findOne({ email: String(email).trim().toLowerCase() });
    if (!labAdmin) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(String(password), labAdmin.password);
    if (!ok) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (labAdmin.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: labAdmin.status === "rejected" ? "Your request was rejected." : "Your account is not approved yet.",
        status: labAdmin.status,
      });
    }

    const token = jwt.sign(
      { id: labAdmin._id, role: "labadmin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      labAdmin: {
        _id: labAdmin._id,
        ownerName: labAdmin.ownerName,
        email: labAdmin.email,
        mobile: labAdmin.mobile,
        labName: labAdmin.labName,
        status: labAdmin.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public: list approved labs for customer-facing UI
export const getPublicLabs = async (req, res) => {
  try {
    const labs = await LabAdmin.find({ status: "approved" })
      .select(
        "ownerName labName address openingDay openingTime closingTime experience labPhoto slogan about whyChooseUs happyPatients createdAt"
      )
      .sort({ createdAt: -1 });

    // Only return entries that have a labName set
    const safeLabs = labs
      .filter((l) => l.labName && String(l.labName).trim())
      .map((l) => ({
        _id: l._id,
        ownerName: l.ownerName,
        labName: l.labName,
        address: l.address,
        openingDay: l.openingDay,
        openingTime: l.openingTime,
        closingTime: l.closingTime,
        experience: l.experience,
        labPhoto: l.labPhoto,
        slogan: l.slogan,
        about: l.about,
        whyChooseUs: l.whyChooseUs,
        happyPatients: l.happyPatients,
        createdAt: l.createdAt,
      }));

    res.json({ success: true, labs: safeLabs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Public: get single approved lab by labName (used by LabInfo)
export const getPublicLabByName = async (req, res) => {
  try {
    const labName = String(req.params.labName || "").trim();
    if (!labName) {
      return res.status(400).json({ success: false, message: "labName is required" });
    }

    const lab = await LabAdmin.findOne({ status: "approved", labName })
      .select(
        "ownerName labName address openingDay openingTime closingTime experience labPhoto slogan about whyChooseUs happyPatients createdAt"
      );

    if (!lab) {
      return res.status(404).json({ success: false, message: "Lab not found" });
    }

    res.json({
      success: true,
      lab: {
        _id: lab._id,
        ownerName: lab.ownerName,
        labName: lab.labName,
        address: lab.address,
        openingDay: lab.openingDay,
        openingTime: lab.openingTime,
        closingTime: lab.closingTime,
        experience: lab.experience,
        labPhoto: lab.labPhoto,
        slogan: lab.slogan,
        about: lab.about,
        whyChooseUs: lab.whyChooseUs,
        happyPatients: lab.happyPatients,
        createdAt: lab.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLabAdminMe = async (req, res) => {
  try {
    if (req.user?.role !== "labadmin") {
      return res.status(403).json({ message: "Access denied." });
    }

    const labAdmin = await LabAdmin.findById(req.user.id).select("-password");
    if (!labAdmin) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, labAdmin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLabAdminMe = async (req, res) => {
  try {
    if (req.user?.role !== "labadmin") {
      return res.status(403).json({ message: "Access denied." });
    }

    const toUploadedUrl = (file) => {
      if (!file) return "";
      // Cloudinary: file.path is a URL. Disk: file.filename is saved under /uploads/lab_documents
      return file.path?.startsWith("http")
        ? file.path
        : `${req.protocol}://${req.get("host")}/uploads/lab_documents/${file.filename}`;
    };

    const allowedFields = [
      "ownerName",
      "mobile",
      "labName",
      "licenseNumber",
      "experience",
      "openingDay",
      "openingTime",
      "closingTime",
      "address",
      "slogan",
      "about",
      "whyChooseUs",
      "happyPatients",
    ];

    const update = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        update[key] = req.body[key];
      }
    }

    // Optional file updates (multipart/form-data)
    const labPhotoFile = req.files?.labPhoto?.[0];
    if (labPhotoFile) {
      update.labPhoto = toUploadedUrl(labPhotoFile);
    }

    // Optional license document re-upload (not required, but supported)
    const licenseFile = req.files?.licenseFile?.[0];
    if (licenseFile) {
      update.licenseFile = toUploadedUrl(licenseFile);
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    if (update.experience !== undefined && update.experience !== null && update.experience !== "") {
      const exp = Number(update.experience);
      if (Number.isNaN(exp) || exp < 0) {
        return res.status(400).json({ message: "Experience must be 0 or greater" });
      }
      update.experience = exp;
    }

    if (update.happyPatients !== undefined && update.happyPatients !== null && update.happyPatients !== "") {
      const hp = Number(update.happyPatients);
      if (Number.isNaN(hp) || hp < 0) {
        return res.status(400).json({ message: "Happy Patients must be 0 or greater" });
      }
      update.happyPatients = hp;
    }

    const updated = await LabAdmin.findByIdAndUpdate(
      req.user.id,
      { $set: update },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, labAdmin: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerLabAdmin = async (req, res) => {
  try {
    const data = req.body;

    const email = String(data.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const existing = await LabAdmin.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    if (!data.password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "License document is required" });
    }

    const hashedPassword = await bcrypt.hash(String(data.password), 10);

    // For Cloudinary, req.file.path is a URL. For disk storage, build an absolute URL under /uploads.
    const licenseFileUrl = req.file.path?.startsWith("http")
      ? req.file.path
      : `${req.protocol}://${req.get("host")}/uploads/lab_documents/${req.file.filename}`;

    const newLabAdmin = new LabAdmin({
      ownerName: data.ownerName,
      mobile: data.mobile,
      email,
      password: hashedPassword,

      labName: data.labName,
      licenseNumber: data.licenseNumber,
      experience: data.experience ? Number(data.experience) : 0,

      openingDay: data.openingDay,
      openingTime: data.openingTime,
      closingTime: data.closingTime,
      address: data.address,

      slogan: data.slogan || "",
      about: data.about || "",
      whyChooseUs: data.whyChooseUs || "",
      happyPatients: data.happyPatients ? Number(data.happyPatients) : 0,

      licenseFile: licenseFileUrl,
    });

    await newLabAdmin.save();

    // Notify super admin(s) about the new lab registration
    try {
      let superAdminEmails = [];
      if (process.env.SUPERADMIN_EMAIL) {
        superAdminEmails = process.env.SUPERADMIN_EMAIL.split(",").map((e) => e.trim()).filter(Boolean);
      }

      if (superAdminEmails.length === 0) {
        const admins = await SuperAdmin.find({}).select("email").lean();
        superAdminEmails = admins.map((admin) => admin.email).filter(Boolean);
      }

      if (superAdminEmails.length > 0) {
        const subject = "New Lab Registration Awaiting Approval";
        const approveUrl = (process.env.ADMIN_PANEL_URL || "http://localhost:5174").replace(/\/$/, "") + "/super-admin/manage-labs";

        const html = `
          <h2>New Lab Registration</h2>
          <p>A new lab has registered and needs your review.</p>
          <ul>
            <li><strong>Owner:</strong> ${newLabAdmin.ownerName || "N/A"}</li>
            <li><strong>Lab Name:</strong> ${newLabAdmin.labName || "N/A"}</li>
            <li><strong>Email:</strong> ${newLabAdmin.email}</li>
            <li><strong>Mobile:</strong> ${newLabAdmin.mobile || "N/A"}</li>
            <li><strong>License #:</strong> ${newLabAdmin.licenseNumber || "N/A"}</li>
          </ul>
          <p>Review and approve it here: <a href="${approveUrl}">${approveUrl}</a></p>
        `;

        await Promise.all(superAdminEmails.map((sendTo) => sendEmail(sendTo, subject, html)));
      } else {
        console.log("No super admin email configured to send new registration alerts.");
      }
    } catch (notifyError) {
      console.log("Failed to send super admin notification email:", notifyError);
    }

    res.json({
      success: true,
      message: "Registered successfully. Waiting for approval.",
      labAdmin: {
        _id: newLabAdmin._id,
        ownerName: newLabAdmin.ownerName,
        email: newLabAdmin.email,
        status: newLabAdmin.status,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllLabAdmins = async (req, res) => {
  try {
    const labs = await LabAdmin.find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(labs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLabAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["pending", "approved", "rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const lab = await LabAdmin.findById(id).select("-password");
    if (!lab) return res.status(404).json({ message: "Lab not found" });

    const previousStatus = lab.status;
    lab.status = status;
    await lab.save();

    // Send email only on transition to approved
    if (previousStatus !== "approved" && status === "approved") {
      const adminPanelUrl = process.env.ADMIN_PANEL_URL || "http://localhost:5174";
      const base = adminPanelUrl.replace(/\/$/, "");
      const loginUrl = `${base}/admin/login?email=${encodeURIComponent(lab.email)}`;

      const ownerName = (lab.ownerName && String(lab.ownerName).trim()) || "";
      const fallbackName =
        (lab.email && String(lab.email).split("@")[0]) ||
        (lab.labName && String(lab.labName).trim()) ||
        "User";

      const subject = "🎉 Your DiagnoOps Profile is Approved";

const html = `
<div style="margin:0;padding:0;background:#f6f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Main Card -->
        <table width="480" cellpadding="0" cellspacing="0" 
          style="background:#ffffff;border-radius:14px;padding:32px 28px;box-shadow:0 10px 30px rgba(0,0,0,0.06)">

          <!-- Logo / Brand -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <div style="
                font-size:20px;
                font-weight:700;
                color:#0f172a;
                letter-spacing:0.5px;
              ">
                DiagnoOps
              </div>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td align="center">
              <h1 style="margin:0;font-size:20px;color:#0f172a;">
                Your profile has been approved 🎉
              </h1>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:18px 0;">
              <div style="height:1px;background:#e2e8f0;"></div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="color:#334155;font-size:14px;line-height:1.7">

              <p style="margin:0 0 12px;">
                Hi <b>${ownerName || fallbackName}</b>,
              </p>

              <p style="margin:0 0 12px;">
                Great news! Your lab profile has been successfully approved on <b>DiagnoOps</b>. 
                You can now access your dashboard and start managing your services.
              </p>

              <!-- Info Box -->
              <div style="
                background:#f8fafc;
                border:1px solid #e2e8f0;
                padding:14px;
                border-radius:10px;
                margin:18px 0;
              ">
                <p style="margin:0;font-size:12px;color:#64748b;">Registered Email</p>
                <p style="margin:4px 0 0;font-weight:600;color:#0f172a;">
                  ${lab.email}
                </p>
              </div>

              <!-- CTA -->
              <div style="text-align:center;margin:26px 0;">
                <a href="${loginUrl}" 
                  style="
                    background:#0f172a;
                    color:#ffffff;
                    padding:12px 22px;
                    border-radius:8px;
                    text-decoration:none;
                    font-size:14px;
                    font-weight:600;
                    display:inline-block;
                    box-shadow:0 4px 14px rgba(0,0,0,0.15);
                  ">
                  Login to Dashboard →
                </a>
              </div>

              <p style="margin:0;color:#64748b;font-size:12px;text-align:center">
                Use the same email and password you registered with.
              </p>


            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                © ${new Date().getFullYear()} DiagnoOps. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</div>
`;

      // Don't block approval response if email fails
      const ok = await sendEmail(lab.email, subject, html);
      if (!ok) {
        console.log(`Approval email failed for ${lab.email}`);
      }
    }

    res.json({ success: true, lab });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};