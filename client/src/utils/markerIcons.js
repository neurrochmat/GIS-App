import L from 'leaflet';

// Fungsi untuk membuat icon marker berdasarkan kategori
export const createMarkerIcon = (kategori) => {
  const baseConfig = {
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  };

  // Warna berdasarkan kategori
  const colors = {
    'Wisata Sejarah': '#e74c3c',      // Merah
    'Kebun Binatang': '#27ae60',      // Hijau
    'Taman Hiburan': '#f1c40f',       // Kuning
    'Wisata Alam': '#2ecc71',         // Hijau Muda
    'Wisata Belanja': '#9b59b6',      // Ungu
    'Wisata Infrastruktur': '#3498db', // Biru
    'default': '#95a5a6'              // Abu-abu
  };

  const color = colors[kategori] || colors.default;

  // SVG marker
  const markerSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
      <path fill="${color}" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
    </svg>
  `;

  const svgUrl = 'data:image/svg+xml;base64,' + btoa(markerSvg);

  return L.icon({
    ...baseConfig,
    iconUrl: svgUrl,
    // Efek bayangan
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
  });
};

// Konfigurasi untuk cluster
export const createClusterIcon = (cluster) => {
  const count = cluster.getChildCount();
  let size = 'small';
  
  if (count > 50) {
    size = 'large';
  } else if (count > 20) {
    size = 'medium';
  }

  const colors = {
    small: '#3498db',
    medium: '#e67e22',
    large: '#e74c3c'
  };

  return L.divIcon({
    html: `<div class="cluster-icon cluster-${size}">${count}</div>`,
    className: `marker-cluster marker-cluster-${size}`,
    iconSize: L.point(40, 40)
  });
};
