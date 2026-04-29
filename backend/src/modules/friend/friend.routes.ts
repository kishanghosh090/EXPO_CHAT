import express from "express";
import { requireAuth } from "../../middleware/require-auth";
import { discoverFriends, listFriends, sendRequest } from "./friend.controller";

const router = express.Router();

// send request to friend
// list friend
// discover friend

router.use(requireAuth);
router.post("/request",sendRequest);

router.get("/list", listFriends);

router.get("/discover", discoverFriends);

export default router;
