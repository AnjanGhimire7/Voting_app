import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { jwtAuth } from "../middlewares/auth.midlleware.js";
import {
  candidateUser,
  deleteCandidate,
  updateCandidate,
  votingCandidate,
} from "../controllers/candidate.controller.js";
import { allCandidateUser } from "../controllers/candidate.controller.js";
import { totalVoteCount } from "../controllers/candidate.controller.js";
const router = Router();

router
  .route("/registerCandidate")
  .post(upload.single("candidatePhoto"), jwtAuth, candidateUser);

router.route("/:candidateID").put(jwtAuth, updateCandidate);
router.route("/:candidateID").delete(jwtAuth, deleteCandidate);
router.route("/vote/:candidateID").post(jwtAuth, votingCandidate);
router.route("/vote/count").get(totalVoteCount);
router.route("/allCandidate").get(allCandidateUser);
export default router;
