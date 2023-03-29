const express = require("express");
const { getContent, createContent } = require("../controllers/content");
const router = express.Router();

router.get("/content", getContent);
router.post("/content", createContent);

module.exports = router;
