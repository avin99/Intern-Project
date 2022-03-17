const express = require('express')
const router = express.Router()
const {
  getUsers,
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/userController')
const { protect,isAdmin } = require('../middleware/authMiddleware')


router.get('/',isAdmin, getUsers)
router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)

module.exports = router