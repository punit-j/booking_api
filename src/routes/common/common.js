import express from "express";
import {agentHeaderMiddleware, adminHeaderMiddleware} from "../middleware/middleware.js";
import { getUsers, getAgents } from "../../db/db.js";

const router = express.Router();

router.get('/users', agentHeaderMiddleware, async (req, res) => {
    try {
        const agentId = req.headers['x-agent-id'];

        const users = await getUsers(agentId);

        res.json({users});
    }
    catch (err) {
        res.status(500).json({message:'error while retrieving data ' + err})
    }
})


router.get('/agents', adminHeaderMiddleware, async (req, res) => {
    try {
        const agents = await getAgents();

        res.json({agents});
    }
    catch (err) {
        res.status(500).json({message:'error while retrieving data ' + err})
    }
})

export default router