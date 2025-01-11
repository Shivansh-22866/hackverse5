import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/classify', authMiddleware, async(req, res) => {
    try {
        const {data} = req.body

        const patterns = {
            email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
            phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
            ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
        }

        const results = {};
        for (const [type, pattern] of Object.entries(patterns)) {
          results[type] = (data.match(pattern) || []).length;
        }

        res.json({ results });
    }

    catch(e) {
        res.status(500).json({msg: e.message})
    }
})

export default router