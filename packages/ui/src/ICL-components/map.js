'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet'
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

const MapEvents = ({ onPositionSelect, setMarkerPosition }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      setMarkerPosition([lat, lng])
      onPositionSelect({ lat, lng })
    }
  })
  return null
}

const Map = ({ onPositionSelect, selectedArea }) => {
  const [markerPosition, setMarkerPosition] = useState(null)
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

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ width: '100%', height: '100%' }}
      ref={setMap}
    >
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents 
        onPositionSelect={onPositionSelect} 
        setMarkerPosition={setMarkerPosition}
      />
      {markerPosition && (
        <Marker position={markerPosition} />
      )}
    </MapContainer>
  )
}

export default Map