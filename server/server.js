require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

// Database connection
mongoose.connect('mongodb://localhost:27017/gisdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.send('GIS Backend Running')
})

const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

const wisataRoutes = require('./routes/wisata')
app.use('/api/wisata', wisataRoutes)

const adminRoutes = require('./routes/admin')
app.use('/api/admin', adminRoutes)

// Jalankan server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})