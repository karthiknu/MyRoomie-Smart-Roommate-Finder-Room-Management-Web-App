'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const cities = [
  ['Bengaluru', 'Mumbai'],
  ['Pune', 'Chennai'],
  ['Gurgaon', 'Hyderabad'],
  ['Delhi', 'Noida'],
];

interface CitiesProps {
  setSelectedCity: (city: string | null) => void;
  showIcon?: boolean; 
}

const Cities = ({ setSelectedCity, showIcon = false }: CitiesProps) => {
  const [selectedCity, setCity] = React.useState<string | null>(null);

  const handleCityClick = (city: string) => {
    setCity(city);
    setSelectedCity(city);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="px-4 py-2 border bg-white rounded-md w-72 text-center text-sm flex items-center justify-center gap-2">
          {showIcon && <Globe className="h-4 w-4" />} 
          {selectedCity ? selectedCity : 'Select City'}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-0 border w-72">
        <table className="table-auto w-full text-center border-collapse">
          <tbody>
            {cities.map((row, rowIndex) => (
              <tr key={rowIndex} className="border">
                {row.map((city, cityIndex) => (
                  <td
                    key={cityIndex}
                    className={`border px-4 py-2 text-sm ${
                      selectedCity === city
                        ? 'bg-blue-500 text-white cursor-default' 
                        : 'hover:bg-gray-100 cursor-pointer' 
                    }`}
                    onClick={() => handleCityClick(city)}
                  >
                    {city || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Cities;
