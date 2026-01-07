const { jwtDecrypt } = require("jose");

const CUSTOMER_SECRET_KEY = new TextEncoder().encode(process.env.CUSTOMER_SECRET_KEY);

async function verifyCustomerToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "Authorization required" });
    }

    const token = authHeader.split(" ")[1];
    const { payload } = await jwtDecrypt(token, CUSTOMER_SECRET_KEY);

    if (payload.purpose !== "AUTH" || payload.role !== "CUSTOMER") {
      return res.status(403).json({ success: false, error: "Unauthorized customer" });
    }

    req.user = {
      userId: payload.userId,
      role: payload.role
    };
    next();

  } catch (err) {
    console.log("token error:", err.message);
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}
module.exports = verifyCustomerToken;
