const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const users = await db.collection("users").get();
      const reports = await db.collection("reports").get();
      const marketplace = await db.collection("marketplace").get();
      const routes = await db.collection("routes").get();

      res.json({
        users: users.size,
        reports: reports.size,
        marketplace: marketplace.size,
        routes: routes.size
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
