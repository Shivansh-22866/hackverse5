import { Router } from "express";
import bcryptjs from 'bcryptjs'
import { User } from "../models/user.schema.js";

const router = Router();

router.post('/register', async(req, res) => {
    try {
        const {email, password} = req.body

        const hashedPassword = await bcryptjs.hash(password, 10)

        const user = new User({
            email,
            password: hashedPassword
        })

        await user.save()

        res.status(201).json({msg: "User created successfully!"})
    }

    catch(e) {
        res.status(500).json({msg: e.message})
    }
})

export default router