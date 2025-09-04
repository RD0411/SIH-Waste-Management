const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  // Get all routes
  router.get("/", async (req, res) => {
    try {
      const snap = await db.collection("routes").get();
      const routes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      res.json(routes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create new route
  router.post("/", async (req, res) => {
    try {
      const { driverId, name, stops } = req.body;
      await db.collection("routes").add({ driverId, name, stops });
      res.json({ message: "Route created" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
