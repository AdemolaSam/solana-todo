const { getChallenge, verify } = require("../controllers/auth.controller");

const router = require("express").Router();

router.post("/challenge", getChallenge);
router.post("/verify", verify);

module.exports = router;
