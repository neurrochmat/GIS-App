const mongoose = require('mongoose')

const WisataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  kategori: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  deskripsi: { type: String },
  gambar: { type: String }, // URL gambar opsional
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Wisata', WisataSchema)
