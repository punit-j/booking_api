import express from "express";
import { getBookingsForWeek, addBooking, deleteBooking } from "../../db/db.js";
import {agentHeaderMiddleware, adminHeaderMiddleware} from "../middleware/middleware.js";
import {bookingRequiredFields, checkRequiredFields, checkDate} from "../../utils/utils.js"

const router = express.Router();
router.use(express.json())

router.get('/scheduler', agentHeaderMiddleware, async (req, res) => {
    const week = req.query.week
    
    if (!checkDate(week)) {
        res.status(400).json({ message: 'Date provided is not correct' })
        return
    }

    try {
        const bookings = await getBookingsForWeek(week)
        res.json({ bookings });
    }
    catch (err) {
        res.status(500).json({message:'error while retrieving data ' + err})
    }
});

router.post('/booking', adminHeaderMiddleware, async (req, res) => {
    const reqBody = req.body;
    if (checkRequiredFields(reqBody, bookingRequiredFields)) {
        res.status(400).json({message: "missing required fields"})
        return
    }

    if (!checkDate(reqBody.finishDate)){
        res.status(400).json({ message: 'Date provided is not correct' })
        return
    }

    try {
        await addBooking(reqBody, req.headers['x-agent-id'])
        res.status(200).json({ message: 'booking added successfully' });
    }
    catch (err) {
        res.status(500).json({message:'error while retrieving data ' + err})
    }
});

router.delete('/booking/:bookingId', adminHeaderMiddleware, async (req, res) => {
    const bookingId = req.params.bookingId;

    try {
        await deleteBooking(bookingId);
        res.status(204).send(); 
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error ' + err });
    }
})


export default router