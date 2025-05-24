import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Login from './Login'
import Register from './Register'
import WisataForm from './WisataForm'

//
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

function GeoJsonMarkers({ filter }) {
  const [features, setFeatures] = useState([])
  useEffect(() => {
    fetch('/wisata-jakarta.geojson')
      .then(res => res.json())
      .then(data => setFeatures(data.features || []))
  }, [])
  return (
    <>
      {features.filter(f => !filter || filter === 'Semua' || f.properties.kategori === filter).map((f, i) => (
        <Marker key={i} position={[f.geometry.coordinates[1], f.geometry.coordinates[0]]}>
          <Popup>
            <b>{f.properties.name}</b><br/>
            {f.properties.kategori}
          </Popup>
        </Marker>
      ))}
    </>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [kategoriList, setKategoriList] = useState([])
  const [filter, setFilter] = useState('Semua')

  useEffect(() => {
    fetch('/wisata-jakarta.geojson')
      .then(res => res.json())
      .then(data => {
        const kategori = Array.from(new Set((data.features || []).map(f => f.properties.kategori)))
        setKategoriList(['Semua', ...kategori])
      })
  }, [])

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'none' }}>
        {showRegister ? (
          <>
            <Register onRegister={() => setShowRegister(false)} />
            <p>Sudah punya akun? <button onClick={() => setShowRegister(false)}>Login</button></p>
          </>
        ) : (
          <>
            <Login onLogin={setUser} />
            <p>Belum punya akun? <button onClick={() => setShowRegister(true)}>Register</button></p>
          </>
        )}
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', width: '100vw', background: 'none' }}>
      <button className="logout-btn" onClick={() => { setUser(null); localStorage.removeItem('token') }}>Logout</button>
      <div style={{ position: 'absolute', left: 24, top: 24, zIndex: 1200, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(25,118,210,0.08)', padding: '0.5rem 1rem' }}>
        <label htmlFor="kategori">Kategori: </label>
        <select id="kategori" value={filter} onChange={e => setFilter(e.target.value)}>
          {kategoriList.map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>
      <div style={{ height: '100vh', width: '100%' }}>
        <MapContainer 
          center={[-6.2088, 106.8456]} 
          zoom={11} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <GeoJsonMarkers filter={filter} />
        </MapContainer>
      </div>
    </div>
  )
}

export default App