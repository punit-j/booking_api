import express from "express";
import { getBookingsForWeek } from "../../db/db.js"

const router = express.Router();

router.get('/scheduler', async (req, res) => {
    res.status(200);
});

export default router