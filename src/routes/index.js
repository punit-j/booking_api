import express from "express";
import {
    getBookingsForWeek,
    createBooking,
    deleteBooking,
} from '../controllers/bookingController.js';
import { getAllUsers } from "../controllers/userController.js";
import { getAllAgents } from "../controllers/agentController.js";
import { agentHeaderMiddleware, adminHeaderMiddleware } from "./middleware/auth.js";

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to your API' });
});

// GET /scheduler?week=weekdate
router.get('/scheduler', agentHeaderMiddleware, getBookingsForWeek);

// POST /booking
router.post('/booking', adminHeaderMiddleware, createBooking);

// DELETE /booking/:id
router.delete('/booking/:id', deleteBooking);

// GET /users
router.get('/users', agentHeaderMiddleware, getAllUsers);

// GET /agents
router.get('/agents', adminHeaderMiddleware, getAllAgents);

export default router;