const { jwtDecrypt } = require("jose");

const ADMIN_SECRET_KEY = new TextEncoder().encode(process.env.ADMIN_SECRET_KEY);

async function verifyAdminToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, error: "Authorization required" });
        }
        const token = authHeader.split(" ")[1];
        const { payload } = await jwtDecrypt(token, ADMIN_SECRET_KEY);

        if (payload.purpose !== "AUTH" || payload.role !== "ADMIN") {
            return res.status(403).json({ success: false, error: "Admins Only" });
        }
        req.user = {
            adminId: payload.adminId,
            role: payload.role
        };
        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: "Invalid or expired token" })
    }
}
module.exports = verifyAdminToken;
