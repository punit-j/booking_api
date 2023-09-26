import { getAgentRole } from "../../db/db.js"

// If it's not agent request, return error
export const adminHeaderMiddleware = async (req, res, next) => {
    const agentId = req.headers['x-agent-id'];

    if (agentId === undefined){
        res.status(401).json({ message: 'not authorised' })
        return
    }

    try {
        const agent = await getAgentRole(agentId);
        if (agent['recordset'][0]['role'] != 'admin') {
            res.status(401).json({ message: 'not authorised' })
            return
        }
    }
    catch (err) {
        res.status(500).json({ message: 'internal server error ' + err })
    }

    // Continue processing the request
    next();
}

export const regularHeaderMiddleware = async (req, res, next) => {
    // If it's not agent request, return error
    const agentId = req.headers['x-agent-id'];

    if (agentId === undefined){
        res.status(401).json({ message: 'not authorised' })
        return
    }

    try {
        const agent = await getAgentRole(agentId);
        if (agent['recordset'][0]['role'] != 'regular') {
            res.status(401).json({ message: 'not authorised' })
            return
        }
    }
    catch (err) {
        res.status(500).json({ message: 'internal server error ' + err })
    }

    // Continue processing the request
    next();
}

export const agentHeaderMiddleware = async (req, res, next) => {
    // If it's not agent request, return error
    const agentId = req.headers['x-agent-id'];

    if (agentId === undefined){
        res.status(401).json({ message: 'not authorised' })
        return
    }
    
    try {
        const agent = await getAgentRole(agentId);
        if (agent['recordset'].length == 0) {
            res.status(401).json({ message: 'not authorised' })
            return
        }
    }
    catch (err) {
        res.status(500).json({ message: 'internal server error ' + err })
    }

    // Continue processing the request
    next();
}