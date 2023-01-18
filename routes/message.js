var express = require("express");

const { addNewMessage, getChatById } = require("../controllers/message");
const router = express.Router();

router.post("/addNewMessage", addNewMessage);

router.get("/getChatById/:chatId", getChatById);

module.exports = router;
