const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));
const { PORT } = process.env;

const requestId=require("./middleware/requestId");
const globalLogger=require("./middleware/globalLogger");

app.use(requestId);
app.use(globalLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

const userController = require("./controllers/user.controller");
const districtRoutes = require("./controllers/district.controller");
const routeRoutes = require("./controllers/route.controller");
const busRoutes = require("./controllers/bus.controller");
const bookingRoutes = require("./controllers/booking.controller");

userController.setUpRoutes(app);

districtRoutes(app);
routeRoutes(app);
busRoutes(app);
bookingRoutes(app);

app.use(require("./middleware/errorHandler"));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});