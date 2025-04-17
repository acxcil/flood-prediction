import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress,
  useTheme 
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RegionsService } from '../../api/regions';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../contexts/AlertContext';

// Fix Leaflet default icon issue 
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom marker icons for different risk levels
const createRiskIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Map bounds updater component
const MapBounds = ({ regions }) => {
  const map = useMap();
  
  useEffect(() => {
    if (regions && regions.length > 0) {
      const bounds = L.latLngBounds(
        regions.map(region => [
          region.coordinates.lat,
          region.coordinates.lon
        ])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, regions]);
  
  return null;
};

const FloodRiskMap = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  
  // Define map center and zoom
  const mapCenter = [
    parseFloat(import.meta.env.VITE_MAP_CENTER_LAT) || 41.20,
    parseFloat(import.meta.env.VITE_MAP_CENTER_LON) || 74.76
  ];
  const mapZoom = parseInt(import.meta.env.VITE_MAP_ZOOM) || 7;

  // Create marker icons for different risk levels
  const riskIcons = {
    High: createRiskIcon('red'),
    Medium: createRiskIcon('orange'),
    Low: createRiskIcon('green')
  };

  // Fetch regions data
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        const data = await RegionsService.getAllRegions();
        setRegions(data);
      } catch (error) {
        console.error('Error fetching regions:', error);
        showAlert('Failed to load regions data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, [showAlert]);

  // Handle region click
  const handleRegionClick = (regionId) => {
    navigate(`/regions/${regionId}`);
  };

  // Calculate risk level color
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High':
        return theme.palette.error.main;
      case 'Medium':
        return theme.palette.warning.main;
      case 'Low':
        return theme.palette.success.main;
      default:
        return theme.palette.info.main;
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: '0 0 auto' }}>
        <Typography variant="h6">Flood Risk Map</Typography>
        <Typography variant="body2" color="text.secondary">
          Current flood risk levels by region
        </Typography>
      </CardContent>
      
      <Box sx={{ flex: '1 1 auto', height: '500px', p: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ height: '100%', width: '100%', borderRadius: '8px' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {regions.map((region) => (
              <Marker
                key={region.id}
                position={[region.coordinates.lat, region.coordinates.lon]}
                icon={riskIcons[region.risk_level]}
                eventHandlers={{
                  click: () => handleRegionClick(region.id)
                }}
              >
                <Popup>
                  <div>
                    <Typography variant="subtitle2">{region.name}</Typography>
                    <Typography variant="body2">
                      Basin: {region.basin}
                    </Typography>
                    <Typography variant="body2">
                      Current River Level: {region.current_river_level.toFixed(2)}m
                    </Typography>
                    <Typography variant="body2">
                      Flood Threshold: {region.flood_threshold.toFixed(2)}m
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: getRiskColor(region.risk_level)
                      }}
                    >
                      Risk Level: {region.risk_level}
                    </Typography>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            <MapBounds regions={regions} />
          </MapContainer>
        )}
      </Box>
    </Card>
  );
};

export default FloodRiskMap;