import { Router } from "express";

import {
  loginUser,
  userRegister,
  logOut,
  changePassword,
  currentUser,
  getAllUser,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { jwtAuth } from "../middlewares/auth.midlleware.js";

const router = Router();

router.route("/register").post(upload.single("citizenship"), userRegister);
router.route("/login").post(loginUser);

//secured route

router.route("/logout").post(jwtAuth, logOut);
router.route("/profile/changePassword").put(jwtAuth, changePassword);
router.route("/profile").get(jwtAuth, currentUser);
router.route("/allUser").get(getAllUser);

export default router;
