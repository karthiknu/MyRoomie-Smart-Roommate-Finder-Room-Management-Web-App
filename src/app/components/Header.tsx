'use client';
import { useEffect, useRef, useState } from "react";
import AppLogo from "./AppLogo";
import Cities from "./Cities"; 
import Login from "./Login";
import { Search, X } from "lucide-react";
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api'; 
import { useRouter } from "next/navigation";

const libraries = ['places'];

interface HeaderProps {
  onLocationSelect: (location: string) => void;
  onCategorySelect: (selectedCategories: { category: string, type?: string }[]) => void;
}

const Header: React.FC<HeaderProps> = ({ onLocationSelect, onCategorySelect }) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null); 
  const [selectedCity, setSelectedCity] = useState<string | null>(null); 
  const [selectedCategories, setSelectedCategories] = useState<{ category: string, type?: string }[]>([]); 

  const onLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  };

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      const place = places?.[0];
      if (place && place.geometry) {
        const location = place.formatted_address || '';
        setSelectedLocation(location); 
        setSelectedCity(null); 
        onLocationSelect(location);    
      }
    }
  };

  const handleCitySelect = (city: string | null) => {
    setSelectedCity(city); 
    setSelectedLocation(null); 
    if (city) onLocationSelect(city); 
  };

  const clearSearch = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      setSelectedLocation(null); 
    }
  };

  const toggleCategory = (category: string, type?: string) => {
    const alreadySelected = selectedCategories.some(
      (selected) => selected.category === category && selected.type === type
    );

    let updatedCategories;
    if (alreadySelected) {
      
      updatedCategories = selectedCategories.filter(
        (selected) => !(selected.category === category && selected.type === type)
      );
    } else {
      
      updatedCategories = [...selectedCategories, { category, type }];
    }

    setSelectedCategories(updatedCategories);
    onCategorySelect(updatedCategories); 
  };

  const isCategorySelected = (category: string, type?: string) => {
    return selectedCategories.some(
      (selected) => selected.category === category && selected.type === type
    );
  };

  useEffect(() => {
    const element = document.querySelector('.parent-container');
    function handleScroll() {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 3) {
        element?.classList.add('show-item');
      } else {
        element?.classList.remove('show-item');
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className="main-header border-b-[1px] border-solid pl-20 pr-20 z-50 relative">
        <div className="flex h-20 items-center justify-between">
          <AppLogo />
          <div className="flex gap-6 primary-header ml-20">
            <button 
              className={isCategorySelected("Home", "Rent") ? "font-medium" : "text-muted-foreground"} 
              onClick={() => toggleCategory("Home", "Rent")}
            >
              Home Rent
            </button>
            <button 
              className={isCategorySelected("PG") ? "font-medium" : "text-muted-foreground"} 
              onClick={() => toggleCategory("PG")}
            >
              PG
            </button>
            <button 
              className={isCategorySelected("Home", "Sale") ? "font-medium" : "text-muted-foreground"} 
              onClick={() => toggleCategory("Home", "Sale")}
            >
              Home Sale
            </button>
          </div>
          <div className="flex gap-4 items-center">
            <div className="cursor-pointer" onClick={() => router.push('/Post-your-property')}>
              Post-your-property
            </div>
            <Cities setSelectedCity={handleCitySelect} showIcon={true} /> 
            <Login />
          </div>
        </div>

        
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} libraries={libraries}>
          <div className="primary-header flex w-full justify-center mb-4">
            <div className="flex w-fit min-w-[60%] justify-between rounded-full border-[1px] border-solid pb-2 pl-6 pt-2 hover:shadow-2xl">
              <div className="flex items-center w-full">
                <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
                  <div className="relative w-full">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search locality"
                      className="w-full bg-transparent border-none outline-none text-gray-500"
                      style={{ minWidth: '850px' }}
                    />
                    <button
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 mr-1"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </StandaloneSearchBox>
                <div className="ml-4 mr-3 h-12 w-12 rounded-full bg-red-500 flex justify-center items-center text-white">
                  <Search />
                </div>
              </div>
            </div>
          </div>
        </LoadScript>

        
        <div className="secondary-header flex w-full justify-center">
          <div className="flex w-fit justify-between gap-10 rounded-full border-[1px] border-solid pb-2 pl-6 pt-2 hover:shadow-lg min-w-[450px]">
            
            <div className="font-medium">{selectedLocation || selectedCity || " "}</div>
            <div className="mr-3 aspect-square h-8 w-8 rounded-full bg-red-500 flex justify-center items-center text-white">
              <Search />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
