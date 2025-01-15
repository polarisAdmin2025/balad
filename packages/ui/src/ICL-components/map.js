'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
})

// Amman coordinates
const center = [31.9454, 35.9284]

const MapEvents = ({ onPositionSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      onPositionSelect({ lat, lng })
    }
  })
  return null
}

const Map = ({ onPositionSelect, selectedArea }) => {
  const [position, setPosition] = useState(null)
  const [map, setMap] = useState(null)

  useEffect(() => {
    if (map && selectedArea?.bounds) {
      const bounds = [
        [selectedArea.bounds[0], selectedArea.bounds[2]], // Southwest
        [selectedArea.bounds[1], selectedArea.bounds[3]]  // Northeast
      ]
      map.fitBounds(bounds)
    }
  }, [map, selectedArea])

  const handlePositionSelect = (pos) => {
    setPosition([pos.lat, pos.lng])
    if (onPositionSelect) {
      onPositionSelect(pos)
    }
  }

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ width: '100%', height: '100%' }}
      ref={setMap}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onPositionSelect={handlePositionSelect} />
      {position && <Marker position={position} />}
      {selectedArea?.geojson && (
        <GeoJSON 
          data={selectedArea.geojson}
          style={{
            fillColor: '#17406D',
            fillOpacity: 0.3,
            color: '#17406D',
            weight: 2
          }}
        />
      )}
    </MapContainer>
  )
}

export default Map