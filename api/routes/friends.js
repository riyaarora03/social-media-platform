import express from "express";
import { getFriends,getSuggestions } from "../controllers/friend.js";

const router = express.Router()

router.get('/', getFriends)
router.get('/suggestions', getSuggestions)


export default router