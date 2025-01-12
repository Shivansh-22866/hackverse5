import Router from 'express'
import { DSARRequest } from '../models/dsarRequest.schema.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/submit', authMiddleware, async(req, res) => {
    try {
        const {requestType, description} = req.body

        const dsarRequest = new DSARRequest({
            userId: req.user.userId,
            requestType,
            description
        })

        await dsarRequest.save()

        res.status(201).json({msg: "DSAR request submitted successfully!"})
    }

    catch(e) {
        res.status(500).json({msg: e.message})
    }
})

router.get('/requests', authMiddleware, async (req, res) => {
  console.log(req.user.userId)
  try {
    const request = await DSARRequest.find({}).populate('userId', 'email');
    console.log(request)
    const requests = await DSARRequest.find({
      ...(req.user.role !== 'admin' ? { userId: req.user.userId } : {})
    }).populate('userId', 'email');

    res.json(requests);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});


export default router