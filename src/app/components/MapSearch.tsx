import React, { useRef, useState } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';
import { X } from 'lucide-react';

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

interface MapSearchProps {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  onLocationSelect: (location: LocationInfo) => void;
}

const MapSearch: React.FC<MapSearchProps> = ({ mapRef, onLocationSelect }) => {
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  };

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      const place = places?.[0];
      if (place && place.geometry && place.geometry.location && mapRef.current) {
        const map = mapRef.current;
        map.panTo(place.geometry.location);
        map.setZoom(15);

        const locationInfo: LocationInfo = {
          formatted_address: place.formatted_address || '',
          name: place.name || '',
          geometry: {
            location: place.geometry.location,
          },
          place_id: place.place_id || '',
        };

        onLocationSelect(locationInfo);

        new google.maps.Marker({
          position: place.geometry.location,
          map: map,
        });
      }
    }
  };

  const clearSearch = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md">
      <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for places"
            className="p-2 pl-4 pr-10 border border-gray-300 rounded w-full shadow-md"
            style={{ backgroundColor: 'white' }}
          />
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
      </StandaloneSearchBox>
    </div>
  );
};

export default MapSearch;