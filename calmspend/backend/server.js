const express = require("express");
const cors = require("cors");
require("dotenv").config();

const aiRoutes = require("./routes/ai");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "CalmSpend API running" });
});

app.use("/api/ai", aiRoutes);

app.listen(PORT, () => {
  console.log(`CalmSpend backend running on port ${PORT}`);
});
