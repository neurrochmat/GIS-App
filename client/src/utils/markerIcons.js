import L from 'leaflet';

const createCustomIcon = (color, darkColor) => {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <svg width="24" height="36" viewBox="0 0 24 36">
        <path 
          fill="${isDarkMode ? darkColor : color}" 
          d="M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24c0-6.6-5.4-12-12-12z"
        />
        <circle fill="${isDarkMode ? '#2c2c2c' : 'white'}" cx="12" cy="12" r="6"/>
      </svg>
    `,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36]
  });
};

export const categoryIcons = {
  'Wisata Sejarah': createCustomIcon('#E57373', '#ff6b6b'),         // Merah
  'Kebun Binatang': createCustomIcon('#81C784', '#69db7c'),         // Hijau
  'Taman Hiburan': createCustomIcon('#64B5F6', '#74c0fc'),          // Biru
  'Wisata Alam': createCustomIcon('#4CAF50', '#40c057'),            // Hijau Tua
  'Wisata Belanja': createCustomIcon('#9575CD', '#845ef7'),         // Ungu
  'Wisata Infrastruktur': createCustomIcon('#FFB74D', '#ffa94d'),   // Orange
  'default': createCustomIcon('#757575', '#adb5bd')                 // Abu-abu
};

// Listen for system color scheme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  // Force re-render of markers by dispatching a custom event
  window.dispatchEvent(new Event('themeChange'));
});
