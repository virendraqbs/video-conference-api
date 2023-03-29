const express = require("express");
const { chatServer, pingServer } = require("../controllers/chat");
const router = express.Router();

router.get("/", chatServer);
router.get("/ping", pingServer);

module.exports = router;
