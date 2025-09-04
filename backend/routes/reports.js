const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  // Get all reports
  router.get("/", async (req, res) => {
    try {
      const snap = await db.collection("reports").get();
      const reports = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      res.json(reports);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Assign report to driver
  router.put("/assign/:id", async (req, res) => {
    try {
      const { driverId } = req.body;
      await db.collection("reports").doc(req.params.id).update({
        assignedTo: driverId,
        status: "assigned"
      });
      res.json({ message: "Report assigned" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
