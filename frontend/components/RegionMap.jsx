// components/RegionMap.jsx
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function RegionMap({ forecasts, regionsMeta }) {
  return (
    <MapContainer
      center={[41.0, 74.6]}
      zoom={7}
      style={{ height: 350, width: '100%' }}
      className="rounded-lg shadow-sm"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {forecasts.map(f => {
        const meta = regionsMeta.find(r => r.id === f.region)
        if (!meta) return null
        const color =
          f.risk_level === 'High'
            ? 'red'
            : f.risk_level === 'Moderate'
            ? 'orange'
            : 'green'
        return (
          <CircleMarker
            key={f.region}
            center={[meta.lat, meta.lon]}
            radius={8}
            pathOptions={{ color, fillOpacity: 0.7 }}
          >
            <Popup>
              <strong>{meta.name}</strong><br/>
              {f.risk_level} ({f.prob_hybrid.toFixed(2)})
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
