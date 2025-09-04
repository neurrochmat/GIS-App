import React, { useState } from 'react';
import './WisataDetail.css';

function WisataDetail({ wisata }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const formatHarga = (harga) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(harga);
  };

  const formatJam = (jam) => {
    return jam || 'Tutup';
  };

  if (!wisata) return null;

  return (
    <div className="wisata-detail">
      <div className="wisata-detail-header">
        <h2>{wisata.name}</h2>
        <span className="wisata-detail-kategori">{wisata.kategori}</span>
      </div>

      {wisata.deskripsi && (
        <div className="wisata-detail-section">
          <p>{wisata.deskripsi}</p>
        </div>
      )}

      <div className="wisata-detail-section">
        <h3>Jam Operasional</h3>
        <div className="jam-operasional">
          <div>Senin</div>
          <div>{formatJam(wisata.jamOperasional?.senin?.buka)} - {formatJam(wisata.jamOperasional?.senin?.tutup)}</div>
          <div>Selasa</div>
          <div>{formatJam(wisata.jamOperasional?.selasa?.buka)} - {formatJam(wisata.jamOperasional?.selasa?.tutup)}</div>
          <div>Rabu</div>
          <div>{formatJam(wisata.jamOperasional?.rabu?.buka)} - {formatJam(wisata.jamOperasional?.rabu?.tutup)}</div>
          <div>Kamis</div>
          <div>{formatJam(wisata.jamOperasional?.kamis?.buka)} - {formatJam(wisata.jamOperasional?.kamis?.tutup)}</div>
          <div>Jumat</div>
          <div>{formatJam(wisata.jamOperasional?.jumat?.buka)} - {formatJam(wisata.jamOperasional?.jumat?.tutup)}</div>
          <div>Sabtu</div>
          <div>{formatJam(wisata.jamOperasional?.sabtu?.buka)} - {formatJam(wisata.jamOperasional?.sabtu?.tutup)}</div>
          <div>Minggu</div>
          <div>{formatJam(wisata.jamOperasional?.minggu?.buka)} - {formatJam(wisata.jamOperasional?.minggu?.tutup)}</div>
        </div>
      </div>

      {wisata.hargaTiket && (
        <div className="wisata-detail-section">
          <h3>Harga Tiket</h3>
          <div className="harga-tiket">
            {wisata.hargaTiket.dewasa && (
              <div className="harga-item">
                <div className="label">Dewasa</div>
                <div className="value">{formatHarga(wisata.hargaTiket.dewasa)}</div>
              </div>
            )}
            {wisata.hargaTiket.anak && (
              <div className="harga-item">
                <div className="label">Anak-anak</div>
                <div className="value">{formatHarga(wisata.hargaTiket.anak)}</div>
              </div>
            )}
            {wisata.hargaTiket.manula && (
              <div className="harga-item">
                <div className="label">Manula</div>
                <div className="value">{formatHarga(wisata.hargaTiket.manula)}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {wisata.fasilitas && wisata.fasilitas.length > 0 && (
        <div className="wisata-detail-section">
          <h3>Fasilitas</h3>
          <div className="fasilitas-list">
            {wisata.fasilitas.map((fasilitas, index) => (
              <div key={index} className="fasilitas-item">
                {fasilitas}
              </div>
            ))}
          </div>
        </div>
      )}

      {wisata.gallery && wisata.gallery.length > 0 && (
        <div className="wisata-detail-section">
          <h3>Galeri Foto</h3>
          <div className="gallery-container">
            {wisata.gallery.map((item, index) => (
              <div
                key={index}
                className="gallery-item"
                onClick={() => setSelectedImage(item)}
              >
                <img src={item.url} alt={item.caption || `Foto ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {(wisata.kontak || wisata.socialMedia) && (
        <div className="wisata-detail-section">
          <h3>Kontak & Media Sosial</h3>
          <div className="kontak-social">
            {wisata.kontak?.telepon && (
              <div className="kontak-item">
                <i className="fas fa-phone"></i>
                <a href={`tel:${wisata.kontak.telepon}`}>{wisata.kontak.telepon}</a>
              </div>
            )}
            {wisata.kontak?.email && (
              <div className="kontak-item">
                <i className="fas fa-envelope"></i>
                <a href={`mailto:${wisata.kontak.email}`}>{wisata.kontak.email}</a>
              </div>
            )}
            {wisata.kontak?.website && (
              <div className="kontak-item">
                <i className="fas fa-globe"></i>
                <a href={wisata.kontak.website} target="_blank" rel="noopener noreferrer">
                  Website
                </a>
              </div>
            )}
            {wisata.socialMedia?.facebook && (
              <div className="kontak-item">
                <i className="fab fa-facebook"></i>
                <a href={wisata.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </div>
            )}
            {wisata.socialMedia?.instagram && (
              <div className="kontak-item">
                <i className="fab fa-instagram"></i>
                <a href={wisata.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </div>
            )}
            {wisata.socialMedia?.twitter && (
              <div className="kontak-item">
                <i className="fab fa-twitter"></i>
                <a href={wisata.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal untuk menampilkan gambar yang diperbesar */}
      {selectedImage && (
        <div
          className="modal"
          onClick={() => setSelectedImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              position: 'relative',
            }}
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.caption}
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
              }}
            />
            {selectedImage.caption && (
              <div
                style={{
                  position: 'absolute',
                  bottom: -30,
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  color: 'white',
                }}
              >
                {selectedImage.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WisataDetail;