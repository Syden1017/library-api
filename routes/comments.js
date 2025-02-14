const express = require("express");
const router = express.Router();

router.get("/", (_req, res) => {
    res.render("comments", { title: "Обсуждение книги" });
});

module.exports = router;