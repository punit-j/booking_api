import { Op } from 'sequelize';
import Booking from '../models/booking.js';
import User from '../models/user.js';
import Agent from '../models/agent.js';
import {bookingRequiredFields, checkRequiredFields, checkDate} from "../utils/utils.js"

// GET /scheduler?week=weekdate
async function getBookingsForWeek(req, res) {
  try {
    const { week } = req.query;

    if (!checkDate(week)) {
        res.status(400).json({ message: 'Date provided is not correct' })
        return
    }
    
    // Calculate the start and end date for the given week
    const startDate = new Date(week);
    const endDate = new Date(week);
    endDate.setDate(endDate.getDate() + 7);

    // Fetch all bookings and related user data for the specified week
    const bookings = await Booking.findAll({
      where: {
        start_at: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
        {
          model: Agent,
          attributes: ['name', 'email'],
        },
      ],
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings for the week:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /booking
async function createBooking(req, res) {
  try {
    // Extract relevant data from the request body
    const { userId, start_at, finish_at } = req.body;
    const agentId = req.headers['x-agent-id'];

    if (checkRequiredFields(reqBody, bookingRequiredFields)) {
      res.status(400).json({message: "missing required fields"})
      return
  }

  if (!checkDate(reqBody.finishDate)){
      res.status(400).json({ message: 'Date provided is not correct' })
      return
  }

    // Check if the current agent matches the provided agentId (for authorization)
    const agent = await Agent.findOne({ where: { id: agentId } });
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Create a new booking
    const booking = await Booking.create({
      userId,
      agentId,
      start_at,
      finish_at,
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// DELETE /booking/:id
async function deleteBooking(req, res) {
  try {
    const { id } = req.params;

    // Find the booking by ID
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Delete the booking
    await booking.destroy();

    res.status(204).send(); // No content (successful deletion)
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export { getBookingsForWeek, createBooking, deleteBooking };