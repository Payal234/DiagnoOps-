import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import LabAdmin from "../models/LabAdmin.js";
import UserProfile from "../models/UserProfile.js";
import { savePatientFromOrder } from "./patientController.js";
import { sendEmail } from "../utils/sendEmail.js";
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_Key_SECRET,
});

// 👉 SUPER ADMIN ACCOUNT ID (Razorpay Route)
const SUPER_ADMIN_ACCOUNT_ID = process.env.SUPER_ADMIN_ACCOUNT_ID || "";

// ✅ CREATE ORDER CONTROLLER
export const createOrder = async (req, res) => {
  try {
    const {
      amount,
      items,
      adminId,
      adminAccountId,
      userId,
      userName,
      userEmail,
      userContact,
      userAddress,
      userAge,
      userGender,
      userBloodGroup,
      userAllergies,
    } = req.body;

    // Backfill missing user fields from user profile (so location can still show
    // even if the frontend didn't send it).
    let resolvedUserName = userName;
    let resolvedUserEmail = userEmail;
    let resolvedUserContact = userContact;
    let resolvedUserAddress = userAddress;
    let resolvedUserAge = userAge;
    let resolvedUserGender = userGender;
    let resolvedUserBloodGroup = userBloodGroup;
    let resolvedUserAllergies = userAllergies;

    const needsUserBackfill =
      (!resolvedUserAddress || !resolvedUserContact || !resolvedUserName || !resolvedUserEmail);

    if (needsUserBackfill) {
      try {
        const looksLikeObjectId = (v) => /^[a-f\d]{24}$/i.test(String(v || "").trim());
        const escapeRegExp = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        let profile = null;
        if (userId && looksLikeObjectId(userId)) {
          profile = await UserProfile.findById(String(userId)).select(
            "name email phone address age gender bloodGroup allergies"
          );
        }

        if (!profile && resolvedUserEmail) {
          const email = String(resolvedUserEmail).trim();
          profile = await UserProfile.findOne({ email: { $regex: `^${escapeRegExp(email)}$`, $options: "i" } }).select(
            "name email phone address age gender bloodGroup allergies"
          );
        }

        if (profile) {
          if (!resolvedUserName) resolvedUserName = profile.name;
          if (!resolvedUserEmail) resolvedUserEmail = profile.email;
          if (!resolvedUserContact) resolvedUserContact = profile.phone;
          if (!resolvedUserAddress) resolvedUserAddress = profile.address;
          if (!resolvedUserAge && profile.age !== undefined) resolvedUserAge = profile.age;
          if (!resolvedUserGender) resolvedUserGender = profile.gender;
          if (!resolvedUserBloodGroup) resolvedUserBloodGroup = profile.bloodGroup;
          if (!resolvedUserAllergies) resolvedUserAllergies = profile.allergies;
        }
      } catch (e) {
        // Ignore profile lookup failures; order can still be created.
      }
    }

    // Resolve lab admin details.
    // Frontend currently sends adminId as labName (route param). We support both:
    // - Mongo ObjectId string (lab admin _id)
    // - labName string
    const normalizedItems = Array.isArray(items) ? items : [];
    const candidateAdminRef =
      (adminId !== undefined && adminId !== null ? String(adminId) : "").trim() ||
      String(normalizedItems?.[0]?.adminId || "").trim() ||
      String(normalizedItems?.[0]?.lab || "").trim();

    const looksLikeObjectId = (v) => /^[a-f\d]{24}$/i.test(String(v || "").trim());

    let resolvedAdminId = looksLikeObjectId(candidateAdminRef) ? candidateAdminRef : "";
    let resolvedAdminAccountId = (adminAccountId ? String(adminAccountId) : "").trim();
    let resolvedLabName = "";

    if (!resolvedAdminId && candidateAdminRef) {
      // Treat candidateAdminRef as labName
      const lab = await LabAdmin.findOne({ labName: candidateAdminRef }).select("_id labName razorpayAccountId");
      if (lab) {
        resolvedAdminId = String(lab._id);
        resolvedLabName = lab.labName || "";
        if (!resolvedAdminAccountId) resolvedAdminAccountId = lab.razorpayAccountId || "";
      }
    }

    if (!resolvedAdminId && candidateAdminRef) {
      // If we still can't resolve, save what we got for debugging but avoid crashing.
      resolvedLabName = candidateAdminRef;
    }

    const platformFee = 10; // 👈 fix or dynamic
    const adminAmount = amount - platformFee;
    const superAdminAmount = platformFee;

    const transfers = [];
    if (resolvedAdminAccountId) {
      transfers.push({
        account: resolvedAdminAccountId,
        amount: adminAmount * 100,
        currency: "INR",
        notes: { role: "admin" },
      });
    }

    if (SUPER_ADMIN_ACCOUNT_ID) {
      transfers.push({
        account: SUPER_ADMIN_ACCOUNT_ID,
        amount: platformFee * 100,
        currency: "INR",
        notes: { role: "platform_fee" },
      });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
      ...(transfers.length ? { transfers } : {}),
    };

    const order = await razorpay.orders.create(options);

    // ✅ Save in DB
    const newOrder = await Order.create({
      items: normalizedItems.map((it) => ({
        ...it,
        // Keep item-level fields consistent for reporting
        adminId: resolvedAdminId || it?.adminId || resolvedLabName || "",
        adminAccountId: it?.adminAccountId ?? resolvedAdminAccountId,
      })),
      amount,
      userId,
      userName: resolvedUserName,
      userEmail: resolvedUserEmail,
      userContact: resolvedUserContact,
      userAddress: resolvedUserAddress,
      userAge: resolvedUserAge,
      userGender: resolvedUserGender,
      userBloodGroup: resolvedUserBloodGroup,
      userAllergies: resolvedUserAllergies,
      platformFee,
      superAdminAmount,
      adminAmount,
      adminId: resolvedAdminId || (resolvedLabName || adminId || ""),
      adminAccountId: resolvedAdminAccountId || adminAccountId,
      superAdminAccountId: SUPER_ADMIN_ACCOUNT_ID,
      orderId: order.id,
      bookingStatus: "Booked",
    });

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      dbOrderId: newOrder._id,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating order", details: err.message });
  }
};

export const getAdminEarnings = async (req, res) => {
  try {
    const { adminId } = req.params;
    if (!adminId) {
      return res.status(400).json({ error: "adminId is required" });
    }

    const earnings = await Order.aggregate([
      {
        $match: {
          adminId,
          $or: [{ paymentStatus: "success" }, { status: "success" }],
        },
      },
      {
        $group: {
          _id: null,
          totalAdminAmount: { $sum: "$adminAmount" },
          totalPlatformFee: { $sum: "$platformFee" },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    const summary = earnings[0] || {
      totalAdminAmount: 0,
      totalPlatformFee: 0,
      orderCount: 0,
    };

    res.json({ success: true, earnings: summary });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch admin earnings", details: err.message });
  }
};

export const getSuperAdminEarnings = async (req, res) => {
  try {
    const earnings = await Order.aggregate([
      { $match: { $or: [{ paymentStatus: "success" }, { status: "success" }] } },
      {
        $group: {
          _id: null,
          totalPlatformFee: { $sum: "$platformFee" },
          totalAmount: { $sum: "$amount" },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    const summary = earnings[0] || {
      totalPlatformFee: 0,
      totalAmount: 0,
      orderCount: 0,
    };

    res.json({ success: true, earnings: summary });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch super admin earnings", details: err.message });
  }
};

export const getOrdersByAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    if (!adminId) {
      return res.status(400).json({ error: "adminId is required" });
    }

    const orders = await Order.find({
      adminId,
      $or: [{ paymentStatus: "success" }, { status: "success" }],
    }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch admin orders", details: err.message });
  }
};

// ✅ Get orders for currently logged-in lab admin (token-based)
export const getOrdersForLabAdminMe = async (req, res) => {
  try {
    if (req.user?.role !== "labadmin") {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    const labAdminId = req.user.id;
    if (!labAdminId) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const me = await LabAdmin.findById(labAdminId).select("labName");
    const myLabName = (me?.labName || "").trim();

    const rawOrders = await Order.find({
      $or: [
        { adminId: labAdminId },
        { "items.adminId": labAdminId },
        // Backward-compat: older orders stored adminId/items.adminId as labName
        ...(myLabName ? [{ adminId: myLabName }, { "items.adminId": myLabName }] : []),
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    // Backfill missing userAddress for older orders from user profiles
    const looksLikeObjectId = (v) => /^[a-f\d]{24}$/i.test(String(v || "").trim());
    const escapeRegExp = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const missingAddressOrderRows = rawOrders.filter((o) => !o?.userAddress);

    const missingAddressUserIds = Array.from(
      new Set(
        missingAddressOrderRows
          .map((o) => String(o?.userId || "").trim())
          .filter((id) => id && looksLikeObjectId(id))
      )
    );

    const missingAddressEmails = Array.from(
      new Set(
        missingAddressOrderRows
          .map((o) => String(o?.userEmail || "").trim())
          .filter(Boolean)
      )
    );

    let addressByUserId = {};
    let addressByEmail = {};
    if (missingAddressUserIds.length || missingAddressEmails.length) {
      try {
        const emailRegexes = missingAddressEmails.map(
          (email) => new RegExp(`^${escapeRegExp(email)}$`, "i")
        );

        const profiles = await UserProfile.find({
          $or: [
            ...(missingAddressUserIds.length ? [{ _id: { $in: missingAddressUserIds } }] : []),
            ...(emailRegexes.length ? [{ email: { $in: emailRegexes } }] : []),
          ],
        })
          .select("_id email address")
          .lean();

        addressByUserId = (profiles || []).reduce((acc, p) => {
          acc[String(p._id)] = p.address || "";
          return acc;
        }, {});

        addressByEmail = (profiles || []).reduce((acc, p) => {
          const email = String(p.email || "").trim().toLowerCase();
          if (email) acc[email] = p.address || "";
          return acc;
        }, {});
      } catch (e) {
        addressByUserId = {};
        addressByEmail = {};
      }
    }

    const orders = rawOrders.map((o) => {
      const items = Array.isArray(o.items)
        ? o.items.filter(
            (it) =>
              !it?.adminId ||
              String(it.adminId) === String(labAdminId) ||
              (myLabName && String(it.adminId) === String(myLabName))
          )
        : [];

      const backfilledUserAddress =
        o.userAddress ||
        (o.userId ? addressByUserId[String(o.userId)] : "") ||
        (o.userEmail ? addressByEmail[String(o.userEmail).trim().toLowerCase()] : "") ||
        "";

      return {
        ...o,
        items,
        userAddress: backfilledUserAddress,
      };
    });

    res.json({ success: true, orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Failed to fetch orders", details: err.message });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const orders = await Order.find({
      userId,
      $or: [{ paymentStatus: "success" }, { status: "success" }],
    }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch user orders", details: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const rawBookingStatus = String(req.body?.bookingStatus || "").trim();

    const statusAliases = {
      booked: "Booked",
      "sample collected": "Sample Collected",
      processing: "Processing",
      "report ready": "Report Ready",
      approved: "Approved",
      approvd: "Approved",
      "booking confirm": "Booking Confirm",
      "booking confirmed": "Booking Confirm",
      rejected: "Rejected",
    };

    const bookingStatus = statusAliases[rawBookingStatus.toLowerCase()] || rawBookingStatus;

    const ALLOWED_BOOKING_STEPS = [
      "Booked",
      "Sample Collected",
      "Processing",
      "Report Ready",
      "Approved",
      "Booking Confirm",
      "Rejected",
    ];

    if (!orderId || !rawBookingStatus) {
      return res.status(400).json({ error: "orderId and bookingStatus are required" });
    }

    if (!ALLOWED_BOOKING_STEPS.includes(String(bookingStatus))) {
      return res.status(400).json({ error: "Invalid bookingStatus" });
    }

    // AuthZ: labadmin can update only their own orders.
    // (Superadmin/admin support can be added later if needed.)
    if (req.user?.role !== "labadmin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const labAdminId = req.user?.id;
    const me = await LabAdmin.findById(labAdminId).select("labName");
    const myLabName = (me?.labName || "").trim();

    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        $or: [
          { adminId: labAdminId },
          { "items.adminId": labAdminId },
          ...(myLabName ? [{ adminId: myLabName }, { "items.adminId": myLabName }] : []),
        ],
      },
      { bookingStatus },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    try {
      if (order.userEmail && bookingStatus === "Booking Confirm") {
  const testList = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border:1px solid #ddd;">${item.name}</td>
          <td style="padding:8px;border:1px solid #ddd;">${item.quantity || 1}</td>
          <td style="padding:8px;border:1px solid #ddd;">₹${item.price}</td>
        </tr>
      `
    )
    .join("");

  await sendEmail(
    order.userEmail,
    "🧪 Booking Confirmed - Diagnoops",
    `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #eee; border-radius:10px; overflow:hidden;">
      
      <div style="background:#06b6d4; color:white; padding:15px;">
        <h2 style="margin:0;">Booking Confirmed ✅</h2>
      </div>

      <div style="padding:20px;">
        <p>Hello <strong>${order.userName || "User"}</strong>,</p>
        <p>Your lab test booking has been <strong>confirmed</strong>.</p>

        <p><strong>Order ID:</strong> ${order.orderId}</p>

        <h3 style="margin-top:20px;">🧾 Test Details</h3>

        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr style="background:#f1f5f9;">
              <th style="padding:8px;border:1px solid #ddd;">Test Name</th>
              <th style="padding:8px;border:1px solid #ddd;">Qty</th>
              <th style="padding:8px;border:1px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${testList}
          </tbody>
        </table>

        <p style="margin-top:20px;">
          Our team will contact you shortly for sample collection.
        </p>

        <p style="color:#555;">Thank you for choosing Diagnoops 💙</p>
      </div>

      <div style="background:#f8fafc; text-align:center; padding:10px; font-size:12px; color:#777;">
        © ${new Date().getFullYear()} Diagnoops. All rights reserved.
      </div>
    </div>
    `
  );
}
if (order.userEmail && bookingStatus === "Approved") {
  const testNames = order.items.map((item) => item.name).join(", ");

  await sendEmail(
    order.userEmail,
    "📄 Report Approved - Diagnoops",
    `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #eee; border-radius:10px; overflow:hidden;">
      
      <div style="background:#10b981; color:white; padding:15px;">
        <h2 style="margin:0;">Report Approved ✅</h2>
      </div>

      <div style="padding:20px;">
        <p>Hello <strong>${order.userName || "User"}</strong>,</p>

        <p>Your test report has been <strong>approved</strong> and is ready.</p>

        <p><strong>Order ID:</strong> ${order.orderId}</p>

        <p><strong>Tests:</strong> ${testNames}</p>

        <p style="margin-top:20px;">
          You can now view/download your report from your dashboard.
        </p>

        <p style="color:#555;">Stay healthy! 💚</p>
      </div>

      <div style="background:#f8fafc; text-align:center; padding:10px; font-size:12px; color:#777;">
        © ${new Date().getFullYear()} Diagnoops. All rights reserved.
      </div>
    </div>
    `
  );
}
    } catch (err) {
      console.log("Email error:", err);
    }

    res.json({ success: true, order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update order status", details: err.message });
  }
};

// ✅ VERIFY PAYMENT CONTROLLER
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_Key_SECRET;
    const expectedSignature = crypto
      .createHmac("sha256", razorpaySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      const order = await Order.findByIdAndUpdate(dbOrderId, {
        paymentId: razorpay_payment_id,
        paymentStatus: "success",
        status: "success",
      }, { new: true });

      // 👤 Save patient from order data
      if (order) {
        try {
          await savePatientFromOrder({
            userName: order.userName,
            userEmail: order.userEmail,
            userContact: order.userContact,
            userAddress: order.userAddress,
            userAge: order.userAge,
            userGender: order.userGender,
            userBloodGroup: order.userBloodGroup,
            userAllergies: order.userAllergies,
            adminId: order.adminId,
            orderId: order.orderId,
            dbOrderId: order._id,
            items: order.items,
            paymentStatus: order.paymentStatus || order.status,
            bookingStatus: order.bookingStatus,
            bookedAt: order.createdAt,
          });
        } catch (patientErr) {
          console.error("Error saving patient:", patientErr);
          // Don't fail the payment if patient save fails
        }
      }

      res.json({ success: true });

    } else {
      res.status(400).json({ success: false });
    }

  } catch (err) {
    console.log(err);
    res.status(500).send("Verification failed");
  }
};

// ✅ UPLOAD REPORT CONTROLLER
export const uploadReport = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reportStatus, doctorName } = req.body;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    if (!orderId || !reportStatus || !doctorName) {
      return res.status(400).json({ 
        error: "orderId, file, reportStatus, and doctorName are required" 
      });
    }

    if (!["Normal", "Abnormal"].includes(reportStatus)) {
      return res.status(400).json({ error: "reportStatus must be 'Normal' or 'Abnormal'" });
    }

    // AuthZ: labadmin can upload only their own orders
    if (req.user?.role !== "labadmin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const labAdminId = req.user?.id;
    const me = await LabAdmin.findById(labAdminId).select("labName");
    const myLabName = (me?.labName || "").trim();

    // Get file URL (Cloudinary returns path as secure URL, local storage returns filename)
    const fileUrl = req.file.path || `${process.env.BACKEND_URL || "http://localhost:5000"}/uploads/lab_documents/${req.file.filename}`;
    const fileName = req.file.originalname || req.file.filename;

    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        $or: [
          { adminId: labAdminId },
          { "items.adminId": labAdminId },
          ...(myLabName ? [{ adminId: myLabName }, { "items.adminId": myLabName }] : []),
        ],
      },
      {
        report: {
          fileUrl,
          fileName,
          status: reportStatus,
          doctorName,
          uploadedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found or unauthorized" });
    }

    res.json({ success: true, order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to upload report", details: err.message });
  }
};