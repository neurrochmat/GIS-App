const router = require('express').Router()
const User = require('../model/user')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password diperlukan' })
    }

    // Cek user existing
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' })
    }

    // Buat user baru
    const isFirstUser = (await User.countDocuments({})) === 0;
    const user = new User({ email, password, role: isFirstUser ? 'admin' : 'user' })
    await user.save()
    res.status(201).json({ message: `User berhasil dibuat${isFirstUser ? ' (admin)' : ''}` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password diperlukan' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Email tidak ditemukan' })
    }
    const bcrypt = require('bcryptjs')
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Password salah' })
    }
    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' })
    res.json({ token, user: { email: user.email } })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router