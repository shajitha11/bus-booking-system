const { jwtDecrypt } = require("jose");

const ADMIN_SECRET_KEY = new TextEncoder().encode(process.env.ADMIN_SECRET_KEY);
const CUSTOMER_SECRET_KEY = new TextEncoder().encode(process.env.CUSTOMER_SECRET_KEY);

async function verifyAnyUserToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Authorization required",
      });
    }
    const token = authHeader.split(" ")[1];
    try {
      const { payload } = await jwtDecrypt(token, ADMIN_SECRET_KEY);
      if (payload.purpose === "AUTH" && payload.role === "ADMIN") {
        req.user = {
          adminId: payload.adminId,
          role: payload.role,
        };
        return next();
      }
    } catch (err) { }

    try {
      const { payload } = await jwtDecrypt(token, CUSTOMER_SECRET_KEY);
      if (payload.purpose === "AUTH" && payload.role === "CUSTOMER") {
        req.user = {
          userId: payload.userId,
          role: payload.role,
        };
        return next();
      }
    } catch (err) { }

    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
}
module.exports = verifyAnyUserToken;
