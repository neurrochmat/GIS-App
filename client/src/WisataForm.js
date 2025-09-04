import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WisataForm.css';

function WisataForm({ token, onSuccess, selectedLocation }) {
  // Basic info state
  const [name, setName] = useState('');
  const [kategori, setKategori] = useState('');
  const [latitude, setLatitude] = useState(selectedLocation?.lat || '');
  const [longitude, setLongitude] = useState(selectedLocation?.lng || '');
  const [deskripsi, setDeskripsi] = useState('');

  // Operational hours state
  const [jamOperasional, setJamOperasional] = useState({
    senin: { buka: '', tutup: '' },
    selasa: { buka: '', tutup: '' },
    rabu: { buka: '', tutup: '' },
    kamis: { buka: '', tutup: '' },
    jumat: { buka: '', tutup: '' },
    sabtu: { buka: '', tutup: '' },
    minggu: { buka: '', tutup: '' }
  });

  // Ticket prices state
  const [hargaTiket, setHargaTiket] = useState({
    dewasa: '',
    anak: '',
    manula: ''
  });

  // Facilities state
  const [fasilitas, setFasilitas] = useState(['']);
  
  // Contact info state
  const [kontak, setKontak] = useState({
    telepon: '',
    email: '',
    website: ''
  });

  // Social media state
  const [socialMedia, setSocialMedia] = useState({
    facebook: '',
    instagram: '',
    twitter: ''
  });

  // Gallery state
  const [gallery, setGallery] = useState([{ url: '', caption: '' }]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available categories
  const kategoriList = [
    'Wisata Sejarah',
    'Kebun Binatang',
    'Taman Hiburan',
    'Wisata Alam',
    'Wisata Belanja',
    'Wisata Infrastruktur'
  ];

  useEffect(() => {
    if (selectedLocation) {
      setLatitude(selectedLocation.lat);
      setLongitude(selectedLocation.lng);
    }
  }, [selectedLocation]);

  // Handle jam operasional changes
  const handleJamChange = (hari, tipe, value) => {
    setJamOperasional(prev => ({
      ...prev,
      [hari]: { ...prev[hari], [tipe]: value }
    }));
  };

  // Handle harga tiket changes
  const handleHargaChange = (tipe, value) => {
    setHargaTiket(prev => ({
      ...prev,
      [tipe]: value
    }));
  };

  // Handle fasilitas changes
  const handleFasilitasChange = (index, value) => {
    const newFasilitas = [...fasilitas];
    newFasilitas[index] = value;
    setFasilitas(newFasilitas);
  };

  const addFasilitas = () => {
    setFasilitas([...fasilitas, '']);
  };

  const removeFasilitas = (index) => {
    const newFasilitas = fasilitas.filter((_, i) => i !== index);
    setFasilitas(newFasilitas);
  };

  // Handle gallery changes
  const handleGalleryChange = (index, field, value) => {
    const newGallery = [...gallery];
    newGallery[index] = { ...newGallery[index], [field]: value };
    setGallery(newGallery);
  };

  const addGalleryItem = () => {
    setGallery([...gallery, { url: '', caption: '' }]);
  };

  const removeGalleryItem = (index) => {
    const newGallery = gallery.filter((_, i) => i !== index);
    setGallery(newGallery);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const wisataData = {
        name,
        kategori,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        deskripsi,
        jamOperasional,
        hargaTiket: {
          dewasa: hargaTiket.dewasa ? parseInt(hargaTiket.dewasa) : undefined,
          anak: hargaTiket.anak ? parseInt(hargaTiket.anak) : undefined,
          manula: hargaTiket.manula ? parseInt(hargaTiket.manula) : undefined
        },
        fasilitas: fasilitas.filter(f => f.trim() !== ''),
        kontak,
        socialMedia,
        gallery: gallery.filter(g => g.url.trim() !== '')
      };

      await axios.post('http://localhost:5000/api/wisata', wisataData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Data wisata berhasil ditambah!');
      // Reset form
      setName('');
      setKategori('');
      setLatitude('');
      setLongitude('');
      setDeskripsi('');
      setJamOperasional({
        senin: { buka: '', tutup: '' },
        selasa: { buka: '', tutup: '' },
        rabu: { buka: '', tutup: '' },
        kamis: { buka: '', tutup: '' },
        jumat: { buka: '', tutup: '' },
        sabtu: { buka: '', tutup: '' },
        minggu: { buka: '', tutup: '' }
      });
      setHargaTiket({ dewasa: '', anak: '', manula: '' });
      setFasilitas(['']);
      setKontak({ telepon: '', email: '', website: '' });
      setSocialMedia({ facebook: '', instagram: '', twitter: '' });
      setGallery([{ url: '', caption: '' }]);

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambah data');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Tambah Data Wisata</h2>
      <form onSubmit={handleSubmit}>
        {/* Basic Information Section */}
        <div className="form-section">
          <h3>Informasi Dasar</h3>
          <div className="form-group">
            <label htmlFor="name">Nama Wisata</label>
            <input
              id="name"
              type="text"
              className="form-control"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="kategori">Kategori</label>
            <select
              id="kategori"
              className="form-control"
              value={kategori}
              onChange={e => setKategori(e.target.value)}
              required
            >
              <option value="">Pilih Kategori</option>
              {kategoriList.map(kat => (
                <option key={kat} value={kat}>{kat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
            <input
              id="latitude"
              type="number"
              step="any"
              className="form-control"
              value={latitude}
              onChange={e => setLatitude(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="longitude">Longitude</label>
            <input
              id="longitude"
              type="number"
              step="any"
              className="form-control"
              value={longitude}
              onChange={e => setLongitude(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="deskripsi">Deskripsi</label>
            <textarea
              id="deskripsi"
              className="form-control"
              value={deskripsi}
              onChange={e => setDeskripsi(e.target.value)}
              style={{ minHeight: '100px' }}
            />
          </div>
        </div>

        {/* Jam Operasional Section */}
        <div className="form-section">
          <h3>Jam Operasional</h3>
          {Object.entries(jamOperasional).map(([hari, jam]) => (
            <div key={hari} className="form-group jam-operasional-group">
              <label>{hari.charAt(0).toUpperCase() + hari.slice(1)}</label>
              <div className="jam-input-group">
                <input
                  type="time"
                  className="form-control"
                  value={jam.buka}
                  onChange={e => handleJamChange(hari, 'buka', e.target.value)}
                />
                <span>sampai</span>
                <input
                  type="time"
                  className="form-control"
                  value={jam.tutup}
                  onChange={e => handleJamChange(hari, 'tutup', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Harga Tiket Section */}
        <div className="form-section">
          <h3>Harga Tiket</h3>
          <div className="form-group">
            <label htmlFor="harga-dewasa">Dewasa</label>
            <input
              id="harga-dewasa"
              type="number"
              className="form-control"
              value={hargaTiket.dewasa}
              onChange={e => handleHargaChange('dewasa', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="harga-anak">Anak-anak</label>
            <input
              id="harga-anak"
              type="number"
              className="form-control"
              value={hargaTiket.anak}
              onChange={e => handleHargaChange('anak', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="harga-manula">Manula</label>
            <input
              id="harga-manula"
              type="number"
              className="form-control"
              value={hargaTiket.manula}
              onChange={e => handleHargaChange('manula', e.target.value)}
            />
          </div>
        </div>

        {/* Fasilitas Section */}
        <div className="form-section">
          <h3>Fasilitas</h3>
          {fasilitas.map((item, index) => (
            <div key={index} className="form-group fasilitas-group">
              <input
                type="text"
                className="form-control"
                value={item}
                onChange={e => handleFasilitasChange(index, e.target.value)}
                placeholder="Nama fasilitas"
              />
              {fasilitas.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeFasilitas(index)}
                >
                  Hapus
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addFasilitas}
          >
            Tambah Fasilitas
          </button>
        </div>

        {/* Kontak Section */}
        <div className="form-section">
          <h3>Kontak</h3>
          <div className="form-group">
            <label htmlFor="telepon">Telepon</label>
            <input
              id="telepon"
              type="tel"
              className="form-control"
              value={kontak.telepon}
              onChange={e => setKontak({ ...kontak, telepon: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={kontak.email}
              onChange={e => setKontak({ ...kontak, email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="url"
              className="form-control"
              value={kontak.website}
              onChange={e => setKontak({ ...kontak, website: e.target.value })}
            />
          </div>
        </div>

        {/* Social Media Section */}
        <div className="form-section">
          <h3>Media Sosial</h3>
          <div className="form-group">
            <label htmlFor="facebook">Facebook</label>
            <input
              id="facebook"
              type="url"
              className="form-control"
              value={socialMedia.facebook}
              onChange={e => setSocialMedia({ ...socialMedia, facebook: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="instagram">Instagram</label>
            <input
              id="instagram"
              type="url"
              className="form-control"
              value={socialMedia.instagram}
              onChange={e => setSocialMedia({ ...socialMedia, instagram: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="twitter">Twitter</label>
            <input
              id="twitter"
              type="url"
              className="form-control"
              value={socialMedia.twitter}
              onChange={e => setSocialMedia({ ...socialMedia, twitter: e.target.value })}
            />
          </div>
        </div>

        {/* Gallery Section */}
        <div className="form-section">
          <h3>Galeri Foto</h3>
          {gallery.map((item, index) => (
            <div key={index} className="form-group gallery-group">
              <input
                type="url"
                className="form-control"
                value={item.url}
                onChange={e => handleGalleryChange(index, 'url', e.target.value)}
                placeholder="URL foto"
              />
              <input
                type="text"
                className="form-control"
                value={item.caption}
                onChange={e => handleGalleryChange(index, 'caption', e.target.value)}
                placeholder="Keterangan foto"
              />
              {gallery.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => removeGalleryItem(index)}
                >
                  Hapus
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addGalleryItem}
          >
            Tambah Foto
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
          style={{ width: '100%', marginTop: '20px' }}
        >
          {isSubmitting ? 'Menambahkan...' : 'Tambah Data'}
        </button>
      </form>

      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}
    </div>
  );
}

export default WisataForm;
