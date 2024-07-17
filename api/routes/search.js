import express from "express";
import { searchUsers } from "../controllers/search.js";

const router = express.Router();

router.get("/", searchUsers);

export default router;
