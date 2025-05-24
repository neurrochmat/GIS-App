const router = require('express').Router()
const Wisata = require('../model/wisata')
const jwt = require('jsonwebtoken')
const User = require('../model/user')

// Middleware autentikasi JWT
function authAdmin(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'Token diperlukan' })
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey')
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ message: 'Token tidak valid' })
  }
}

// Hanya admin yang boleh tambah data
async function onlyAdmin(req, res, next) {
  const user = await User.findById(req.user.id)
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Hanya admin yang boleh menambah data' })
  }
  next()
}

// Tambah data wisata (admin only)
router.post('/', authAdmin, onlyAdmin, async (req, res) => {
  try {
    const { name, kategori, latitude, longitude, deskripsi, gambar } = req.body
    const wisata = new Wisata({ name, kategori, latitude, longitude, deskripsi, gambar, createdBy: req.user.id })
    await wisata.save()
    res.status(201).json({ message: 'Data wisata berhasil ditambah', wisata })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// List semua data wisata
router.get('/', async (req, res) => {
  const wisata = await Wisata.find()
  res.json(wisata)
})

module.exports = router
