require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const collectRoutes = require("./routes/collectRoutes");
const logRoutes = require("./routes/logRoutes");
const monitorRoutes = require("./routes/monitorRoutes");
const groupRoutes = require("./routes/groupRoutes");

app.use(
  cors(
    process.env.NODE_ENV == "production"
      ? {
          origin: "https://recoge-latas-uc2v.onrender.com",
          credentials: true,
        }
      : {
          origin: "http://localhost:5500",
          credentials: true,
        }
  )
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/collects", collectRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/monitor", monitorRoutes);
app.use("/api/groups", groupRoutes);

app.listen(8080, () => {
  console.log(`Server running on port 8080`);
});
