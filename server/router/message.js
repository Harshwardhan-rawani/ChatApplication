const express = require("express");
const { getMessage,postMessage } = require("../controller/message");

const router = express.Router();

router.post("/api/messages", postMessage);


router.get("/api/messages/:senderId/:receiverId", getMessage);

module.exports = router;
