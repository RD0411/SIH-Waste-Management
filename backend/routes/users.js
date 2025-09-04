const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  // Get all users
  router.get("/", async (req, res) => {
    try {
      const snap = await db.collection("users").get();
      const users = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update role/status
  router.put("/:id", async (req, res) => {
    try {
      await db.collection("users").doc(req.params.id).update(req.body);
      res.json({ message: "User updated" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
