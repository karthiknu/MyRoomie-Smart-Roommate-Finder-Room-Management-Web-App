'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/app/lib/useStore';
import Cities from '../../../components/Cities';

const categories = [
  { id: 1, title: 'Home' },
  { id: 2, title: 'PG' },
];

const Page = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const addProperty = useStore((state: any) => state.addProperty);
  const property = useStore((state: any) => state.property);

  useEffect(() => {
    const updatedProperty = {
      category: selectedCategory,
      city: selectedCity || null,
    };

    if (selectedCategory === 'Home') {
      updatedProperty['type'] = propertyType || null;
    }

    addProperty(updatedProperty);

    console.log({
      selectedCategory,
      propertyType,
      selectedCity,
      propertyId: property.propertyId,
    });
  }, [selectedCategory, propertyType, selectedCity, property.propertyId]);

  const handleNext = () => {
    if (!selectedCategory || !selectedCity) {
      alert('Please select both city and property type.');
      return;
    }

    if (selectedCategory === 'Home' && !propertyType) {
      alert('Please select Rent or Sale.');
      return;
    }

    console.log('Property state:', property);

    if (selectedCategory === 'PG') {
      router.push(`/Post-your-property/${property.propertyId}/pg-price`);
    } else if (selectedCategory === 'Home') {
      router.push(`/Post-your-property/${property.propertyId}/property-details`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow pb-20">
        <div className="flex flex-col gap-10 justify-center items-center w-full mt-8">
          <div className="text-xl font-semibold">
            You have already posted 7 properties on NoBroker
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-xl font-bold">Select City:</div>
            <Cities setSelectedCity={setSelectedCity} />
          </div>

          <div className="h-24"></div>

          <div className="text-xl font-bold text-center">Select Property Type</div>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {categories.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedCategory(item.title);
                  setPropertyType(null);
                }}
                className={`${
                  selectedCategory === item.title
                    ? 'border-blue-500 text-blue-500'
                    : 'border-gray-300'
                } flex flex-col p-4 border-solid border-2 gap-2 rounded-lg cursor-pointer w-36 text-center`}
              >
                <span className="font-semibold">{item.title}</span>
              </div>
            ))}
          </div>

          {selectedCategory === 'Home' && (
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setPropertyType('Rent')}
                className={`${
                  propertyType === 'Rent'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200'
                } p-2 rounded-lg font-semibold w-32`}
              >
                Rent
              </button>
              <button
                onClick={() => setPropertyType('Sale')}
                className={`${
                  propertyType === 'Sale'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200'
                } p-2 rounded-lg font-semibold w-32`}
              >
                Sale
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="fixed w-full border-t-2 bottom-0 p-4 bg-white">
        <button className="font-bold underline" onClick={() => router.back()}>
          Back
        </button>
        <button
          onClick={handleNext}
          className="p-3 bg-gradient-to-tr from-pink-600 via-pink-500 to-pink-400 font-bold text-white rounded-xl float-right"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Page;
