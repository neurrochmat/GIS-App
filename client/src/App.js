import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Login from './Login'
import Register from './Register'
import WisataForm from './WisataForm'
import AdminDashboard from './components/AdminDashboard'

// Icon configuration
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

function GeoJsonMarkers({ filter, wisataData = [] }) {
  const [features, setFeatures] = useState([])
  
  useEffect(() => {
    fetch('/wisata-jakarta.geojson')
      .then(res => res.json())
      .then(data => setFeatures(data.features || []))
  }, [])

  return (
    <>
      {/* Render markers from geojson */}
      {features.filter(f => !filter || filter === 'Semua' || f.properties.kategori === filter).map((f, i) => (
        <Marker key={`geojson-${i}`} position={[f.geometry.coordinates[1], f.geometry.coordinates[0]]}>
          <Popup>
            <b>{f.properties.name}</b><br/>
            {f.properties.kategori}
          </Popup>
        </Marker>
      ))}

      {/* Render markers from database */}
      {wisataData.filter(w => !filter || filter === 'Semua' || w.kategori === filter).map((w, i) => (
        <Marker key={`db-${i}`} position={[w.latitude, w.longitude]}>
          <Popup>
            <b>{w.name}</b><br/>
            {w.kategori}
            {w.deskripsi && <><br/><br/>{w.deskripsi}</>}
            {w.gambar && <><br/><br/><img src={w.gambar} alt={w.name} style={{width: '200px'}}/></>}
          </Popup>
        </Marker>
      ))}
    </>
  )
}

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    contextmenu(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [kategoriList, setKategoriList] = useState([]);
  const [filter, setFilter] = useState('Semua');
  const [wisata, setWisata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  const handleLocationSelect = (lat, lng) => {
    if (user?.role === 'admin') {
      setSelectedLocation({ lat, lng });
      setIsSidebarOpen(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          console.log('User data:', data)
          if (data.email) {
            setUser(data)
          } else {
            localStorage.removeItem('token')
          }
        })
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch('/wisata-jakarta.geojson')
      .then(res => res.json())
      .then(data => {
        const kategori = Array.from(new Set((data.features || []).map(f => f.properties.kategori)))
        setKategoriList(['Semua', ...kategori])
      })
  }, [])

  useEffect(() => {
    // Fetch data wisata when component mounts and after adding new data
    const fetchWisata = () => {
      fetch('http://localhost:5000/api/wisata')
        .then(res => res.json())
        .then(data => {
          console.log('Wisata data:', data); // Debugging
          setWisata(data);
        })
        .catch(err => console.error('Error fetching wisata:', err));
    };

    fetchWisata();
  }, []); // Empty dependency array means this runs once when component mounts

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-container">
        <div className="auth-wrapper">
          {showRegister ? (
            <div className="form-container">
              <Register onRegister={() => setShowRegister(false)} />
              <p className="auth-switch">
                Sudah punya akun?{' '}
                <button className="btn btn-secondary" onClick={() => setShowRegister(false)}>
                  Login
                </button>
              </p>
            </div>
          ) : (
            <div className="form-container">
              <Login onLogin={setUser} />
              <p className="auth-switch">
                Belum punya akun?{' '}
                <button className="btn btn-secondary" onClick={() => setShowRegister(true)}>
                  Register
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>Wisata Pulau Jawa</h1>
        <div className="header-actions">
          {user.role === 'admin' && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowAdminDashboard(!showAdminDashboard)}
            >
              {showAdminDashboard ? 'Kembali ke Peta' : 'Dashboard Admin'}
            </button>
          )}
          <button 
            className="btn btn-secondary" 
            onClick={() => { setUser(null); localStorage.removeItem('token'); }}
          >
            Logout
          </button>
        </div>
      </header>

      {showAdminDashboard && user.role === 'admin' ? (
        <div className="admin-container">
          <AdminDashboard token={localStorage.getItem('token')} />
        </div>
      ) : (
        <>
          {user && user.role === 'admin' && (
            <>
              <button 
                className="toggle-sidebar-btn"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? '← Tutup Form' : '→ Tambah Data'}
              </button>
              <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <WisataForm 
                  token={localStorage.getItem('token')} 
                  selectedLocation={selectedLocation}
                  onSuccess={() => {
                    fetch('http://localhost:5000/api/wisata')
                      .then(res => res.json())
                      .then(data => {
                        setWisata(data);
                        setSelectedLocation(null);
                      })
                      .catch(err => console.error('Error updating wisata:', err));
                    setIsSidebarOpen(false);
                  }} 
                />
              </div>
            </>
          )}

          <div className="control-panel">
            <label htmlFor="kategori" className="filter-label">Filter Kategori:</label>
            <select 
              id="kategori" 
              value={filter} 
              onChange={e => setFilter(e.target.value)}
              className="filter-select"
            >
              {kategoriList.map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          <div className="map-container">
            <MapContainer 
              center={[-7.5, 110]}
              zoom={7} 
              style={{ height: '100%', width: '100%' }}
              contextmenu={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <MapClickHandler onLocationSelect={handleLocationSelect} />
              <GeoJsonMarkers filter={filter} wisataData={wisata} />
            </MapContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default App