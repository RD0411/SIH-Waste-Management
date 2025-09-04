const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  // Get all marketplace items
  router.get("/", async (req, res) => {
    try {
      const snap = await db.collection("marketplace").get();
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete item
  router.delete("/:id", async (req, res) => {
    try {
      await db.collection("marketplace").doc(req.params.id).delete();
      res.json({ message: "Item deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
