const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./config/firebase");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/users", require("./routes/users")(db));
app.use("/api/reports", require("./routes/reports")(db));
app.use("/api/routes", require("./routes/routes")(db));
app.use("/api/marketplace", require("./routes/marketplace")(db));
app.use("/api/stats", require("./routes/stats")(db));


const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend running at http://localhost:${PORT}`));
