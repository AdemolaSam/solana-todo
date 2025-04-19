const {
  getTodo,
  createTodo,
  updateUser,
  getUser,
} = require("../controllers/user.controller");
const AuthenticateJWT = require("../middleware/auth.middleware");

const router = require("express").Router();

router.use(AuthenticateJWT);

router.get("/", getUser);
router.patch("update", updateUser);
router.get("/todo", getTodo);
router.post("/todo", createTodo);

module.exports = router;
