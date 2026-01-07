const db = require("../config/db");
const sendMail = require("../utils/mail");
const bcrypt = require("bcrypt");
const hashPassword = require("../utils/hash");
const { EncryptJWT, jwtDecrypt } = require("jose");
const query = require("../queries/user.query");
const ADMIN_SECRET_KEY = new TextEncoder().encode(process.env.ADMIN_SECRET_KEY);
const CUSTOMER_SECRET_KEY = new TextEncoder().encode(process.env.CUSTOMER_SECRET_KEY);
const otpStore = new Map();

async function signUpCheck(req, res) {
  try {
    const { username, email, password, confirmPassword, phone } = req.body;

    if (!username || !email || !password || !confirmPassword || !phone)
      return res.status(400).json({ success: false, error: "All fields are required" });

    if (password !== confirmPassword)
      return res.status(400).json({ success: false, error: "Passwords do not match" });

    const [userExists] = await db.query(query.checkUserExists, [username, email]);
    if (userExists.length > 0)
      return res.status(409).json({ success: false, error: "Username or email already exists" });

    const hash = await hashPassword(password);
    await db.query(query.insertUser, [username, email, hash, phone,"CUSTOMER"]);

    sendMail(email, "Welcome to our Space!", `Hii ${username},\n\n ThankYou for Signing Up ! We're excited to have You.`);
    return res.json({ success: true, message: "Signup successful! Please login." });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

async function loginCheck(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ success: false, error: "All fields are required" });

    const [rows] = await db.query(query.getUserByUsername, [username]);
    if (rows.length === 0)
      return res.status(400).json({ success: false, error: "Invalid username or password" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ success: false, error: "Invalid username or password" });

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore.set(user.userId, {
      otp,
      attempts: 0,
      expiresAt: Date.now() + 2 * 60 * 1000
    });

    sendMail(user.email, "OTP for Login", `Your OTP is ${otp}`);

    const secretKey = user.role === "ADMIN" ? ADMIN_SECRET_KEY : CUSTOMER_SECRET_KEY;

    const tempToken = await new EncryptJWT({
      purpose: "TEMP_AUTH",
      userId: user.userId,
      role: user.role
    })
      .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
      .setExpirationTime("2m")
      .encrypt(secretKey);

    return res.json({ success: true, tempToken, message: "OTP sent to mail" });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

async function verifyOtp(req, res) {
  try {
    const { otp, tempToken } = req.body;

    if (!otp || !tempToken)
      return res.status(400).json({ success: false, error: "OTP required" });

    let payload;

    try {
      ({ payload } = await jwtDecrypt(tempToken, CUSTOMER_SECRET_KEY));
    } catch {
      try {
        ({ payload } = await jwtDecrypt(tempToken, ADMIN_SECRET_KEY));
      } catch {
        return res.status(401).json({ success: false, error: "Invalid or expired token" });
      }
    }

    if (payload.purpose !== "TEMP_AUTH")
      return res.status(403).json({ success: false, error: "Invalid token purpose" });

    const data = otpStore.get(payload.userId);

    if (!data || Date.now() > data.expiresAt) {
      otpStore.delete(payload.userId);
      return res.status(400).json({ success: false, error: "OTP expired" });
    }

    if (parseInt(otp) !== data.otp) {
      data.attempts++;

      if (data.attempts >= 3) {
        otpStore.delete(payload.userId);
        return res.status(400).json({
          success: false,
          error: "OTP attempts exceeded",
        });
      }

      return res.status(400).json({
        success: false,
        error: "Invalid OTP",
      });
    }

    otpStore.delete(payload.userId);

    const secretKey =
      payload.role === "ADMIN" ? ADMIN_SECRET_KEY : CUSTOMER_SECRET_KEY;

    const mainToken = await new EncryptJWT({
      purpose: "AUTH",
      userId: payload.userId,
      role: payload.role,
    })
      .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
      .setExpirationTime("1h")
      .encrypt(secretKey);

    return res.json({ success: true, mainToken });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

async function verifyForgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, error: "Email required" });

    const [rows] = await db.query(query.getUserByEmail, [email]);
    if (rows.length === 0)
      return res.status(400).json({ success: false, error: "Email not found" });

    const user = rows[0];
    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore.set(user.userId, {
      otp,
      attempts: 0,
      expiresAt: Date.now() + 2 * 60 * 1000
    });

    sendMail(email, "OTP for Reset Password", `Your OTP is ${otp}`);

    const tempToken = await new EncryptJWT({
      purpose: "RESET_PASSWORD",
      userId: user.userId,
      role: "CUSTOMER"
    })
      .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
      .setExpirationTime("2m")
      .encrypt(CUSTOMER_SECRET_KEY);

    return res.json({ success: true, tempToken });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

async function resetPassword(req, res) {
  try {
    const { otp, tempToken, password, confirmPassword } = req.body;

    if (!otp || !password || !confirmPassword)
      return res.status(400).json({ success: false, error: "All fields required" });

    if (password !== confirmPassword)
      return res.status(400).json({ success: false, error: "Passwords do not match" });

    let payload;
    try {
      ({ payload } = await jwtDecrypt(tempToken, CUSTOMER_SECRET_KEY));
    } catch {
      return res.status(400).json({ success: false, error: "Invalid or expired token" });
    }

    const data = otpStore.get(payload.userId);

    if (payload.purpose !== "RESET_PASSWORD") {
      return res.status(403).json({ success: false, error: "Invalid token purpose" });
    }

    if (!data || Date.now() > data.expiresAt)
      return res.status(400).json({ success: false, error: "OTP expired" });

    if (parseInt(otp) !== data.otp) {
      data.attempts++;
      if (data.attempts >= 3) {
        otpStore.delete(payload.userId);
        return res.status(400).json({ success: false, error: "OTP attempts exceeded" });
      }
      return res.status(400).json({ success: false, error: "Invalid OTP" });
    }

    otpStore.delete(payload.userId);

    const hash = await hashPassword(password);
    await db.query(query.updatePasswordById, [hash, payload.userId]);

    const [userRows] = await db.query(query.getUserById, [payload.userId]);
    const user = userRows[0];
    if (user) {
      sendMail(user.email, "Password Reset Successful", `Hi ${user.username},\n\nYour password has been reset successfully.`);
    }
    return res.json({ success: true, message: "Password reset successful" });
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

function setUpRoutes(app) {
  app.post("/api/user/signup", signUpCheck);
  app.post("/api/user/login", loginCheck);
  app.post("/api/user/verify-otp", verifyOtp);
  app.post("/api/user/forgot-password", verifyForgotPassword);
  app.put("/api/user/reset-password", resetPassword);
}
module.exports = { setUpRoutes };