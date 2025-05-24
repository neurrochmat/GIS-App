import React, { useState } from 'react'
import axios from 'axios'

function WisataForm({ token, onSuccess }) {
  const [name, setName] = useState('')
  const [kategori, setKategori] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [gambar, setGambar] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await axios.post('http://localhost:5000/api/wisata', {
        name, kategori, latitude: parseFloat(latitude), longitude: parseFloat(longitude), deskripsi, gambar
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSuccess('Data wisata berhasil ditambah!')
      setName('')
      setKategori('')
      setLatitude('')
      setLongitude('')
      setDeskripsi('')
      setGambar('')
      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambah data')
    }
  }

  return (
    <div className="auth-container" style={{marginTop: 24, marginBottom: 24}}>
      <h2>Tambah Data Wisata</h2>
      <form onSubmit={handleSubmit} style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
        <input type="text" placeholder="Nama Wisata" value={name} onChange={e => setName(e.target.value)} required />
        <input type="text" placeholder="Kategori" value={kategori} onChange={e => setKategori(e.target.value)} required />
        <input type="number" step="any" placeholder="Latitude" value={latitude} onChange={e => setLatitude(e.target.value)} required />
        <input type="number" step="any" placeholder="Longitude" value={longitude} onChange={e => setLongitude(e.target.value)} required />
        <input type="text" placeholder="URL Gambar (opsional)" value={gambar} onChange={e => setGambar(e.target.value)} />
        <textarea placeholder="Deskripsi (opsional)" value={deskripsi} onChange={e => setDeskripsi(e.target.value)} style={{width:'100%', minHeight:60, marginBottom:12}} />
        <button type="submit" style={{width:'100%', marginTop:'0.5rem'}}>Tambah</button>
      </form>
      {error && <p style={{color:'red', marginTop:'0.5rem'}}>{error}</p>}
      {success && <p style={{color:'green', marginTop:'0.5rem'}}>{success}</p>}
    </div>
  )
}

export default WisataForm
