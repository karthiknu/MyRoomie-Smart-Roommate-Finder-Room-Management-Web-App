import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import MapSearch from './MapSearch';

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ['places'];

interface LocationInfo {
  formatted_address: string;
  name: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  place_id: string;
}

const MapComponent = ({ onLocationSelect, initialAddress }: { onLocationSelect: (location: string) => void, initialAddress: string }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [infoBoxVisible, setInfoBoxVisible] = useState(true);

  const center = useMemo(() => ({ lat: 51.505, lng: -0.09 }), []);

  // Handle clicks on the map
  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    const clickedLocation = event.latLng;
    if (clickedLocation) {
      const newLocation: LocationInfo = {
        formatted_address: '',
        name: '',
        geometry: {
          location: {
            lat: () => clickedLocation.lat(),
            lng: () => clickedLocation.lng(),
          },
        },
        place_id: '',
      };
      setLocation(newLocation);
      setInfoBoxVisible(true);
      onLocationSelect(`Lat: ${clickedLocation.lat()}, Lng: ${clickedLocation.lng()}`);

      new google.maps.Marker({
        position: clickedLocation,
        map: mapRef.current,
      });
    }
  }, [onLocationSelect]);

  // Search for the initial address
  const searchLocationByAddress = useCallback((address: string) => {
    if (!mapRef.current || !address) return;

    const service = new google.maps.places.PlacesService(mapRef.current);

    const request = {
      query: address,
      fields: ['formatted_address', 'geometry', 'name', 'place_id'],
    };

    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        const place = results[0];
        setLocation(place);

        if (place.geometry?.location) {
          mapRef.current?.panTo(place.geometry.location);

          new google.maps.Marker({
            position: place.geometry.location,
            map: mapRef.current,
          });
        }
      }
    });
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    if (initialAddress) {
      searchLocationByAddress(initialAddress);
    }
  }, [initialAddress, searchLocationByAddress]);

  const handleLocationSelect = (selectedLocation: LocationInfo) => {
    setLocation(selectedLocation);
    setInfoBoxVisible(true);
    onLocationSelect(selectedLocation.formatted_address);
  };

  const handleCloseInfoBox = () => {
    setInfoBoxVisible(false);
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="h-[500px] relative">
        <GoogleMap
          zoom={13}
          center={center}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
          }}
          onLoad={onMapLoad}
          onClick={handleMapClick}
        >
          <MapSearch mapRef={mapRef} onLocationSelect={handleLocationSelect} />
          {location && (
            <Marker
              position={{
                lat: location.geometry.location.lat(),
                lng: location.geometry.location.lng(),
              }}
            />
          )}
        </GoogleMap>
      </div>
      {location && infoBoxVisible && (
        <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
          <button
            className="float-right text-gray-500 hover:text-black"
            onClick={handleCloseInfoBox}
          >
            &times;
          </button>
          <h3 className="font-bold">{location.name}</h3>
          <p>{location.formatted_address}</p>
          <p>Latitude: {location.geometry.location.lat()}</p>
          <p>Longitude: {location.geometry.location.lng()}</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;