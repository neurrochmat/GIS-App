const mongoose = require('mongoose')

const WisataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  kategori: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  deskripsi: { type: String },
  // Informasi Operasional
  jamOperasional: {
    senin: { buka: String, tutup: String },
    selasa: { buka: String, tutup: String },
    rabu: { buka: String, tutup: String },
    kamis: { buka: String, tutup: String },
    jumat: { buka: String, tutup: String },
    sabtu: { buka: String, tutup: String },
    minggu: { buka: String, tutup: String }
  },
  hargaTiket: {
    dewasa: { type: Number },
    anak: { type: Number },
    manula: { type: Number }
  },
  // Fasilitas dan Kontak
  fasilitas: [String],
  kontak: {
    telepon: String,
    email: String,
    website: String
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  // Gallery Foto
  gallery: [{
    url: String,
    caption: String
  }],
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

// Update the updatedAt timestamp before saving
WisataSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('Wisata', WisataSchema)
