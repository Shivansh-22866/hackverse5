import { Router } from "express";
import bcryptjs from 'bcryptjs'
import { User } from "../models/user.schema.js";
import jwt from 'jsonwebtoken'

const router = Router();

router.post('/register', async(req, res) => {
    try {
        const {email, password} = req.body

        if(!email || !password) {
            res.status(401).json({msg: "Missing credentials, please check email or password!"})
        }

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

router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
    
        if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        const isValidPassword = await bcryptjs.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        const token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
    
        res.json({ token, role: user.role });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
})

export default router