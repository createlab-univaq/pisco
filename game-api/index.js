require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const excelRoutes = require("./routes/excel.routes");
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      // automatically set cors origin header based on client request for faster developing
      // TODO: check domain cors in production env
      return callback(null, true);
    },
    credentials: true,
  }),
);

// DB
connectDB();

// Routes
app.use(require("./routes/utente.routes"));
app.use("/api/tentativi-test", require("./routes/tentativoTest.routes"));
app.use(excelRoutes);
app.use("/api/health", healthRoutes);
app.use("/auth", authRoutes);
// Avvio server
app.listen(3000, () => {
  console.log("Server avviato su http://localhost:3000");
});
