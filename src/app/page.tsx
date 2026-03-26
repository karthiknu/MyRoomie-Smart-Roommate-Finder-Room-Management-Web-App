'use client';

import { useEffect, useState } from 'react';
import Header from './components/Header';
import { fetchProperty } from './actions/fetchProperty';
import PropertyList from './components/PropertyList';

export default function Home() {
  const [properties, setProperties] = useState<any[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<{ category: string; type?: string }[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchProperty();
        const sanitizedData = JSON.parse(JSON.stringify(response.data)); // Ensure serialization
        setProperties(sanitizedData);
        setFilteredProperties(sanitizedData);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategorySelect = (categories: { category: string; type?: string }[]) => {
    setSelectedCategories(categories);
    filterProperties(categories, selectedLocation, userEmail);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    filterProperties(selectedCategories, location, userEmail);
  };

  const handleShowUserProperties = (email: string) => {
    setUserEmail(email);
    filterProperties(selectedCategories, selectedLocation, email);
  };

  const filterProperties = (
    categories: { category: string; type?: string }[],
    location: string | null,
    email: string | null
  ) => {
    let filtered = [...properties];

    // Filter based on selected categories
    if (categories.length > 0) {
      filtered = filtered.filter((property) =>
        categories.some(
          (category) =>
            property.category === category.category &&
            (category.type ? property.homeProperty?.type === category.type : true)
        )
      );
    }

    // Ensure location is correctly filtered
    if (location) {
      const locationWords = location
        .split(',')
        .map((word) => word.trim())
        .filter((word) => isNaN(Number(word))); // Remove numbers (e.g., zip codes)

      filtered = filtered.filter((property) => {
        const propertyLocation = typeof property.location === 'object' ? JSON.stringify(property.location) : property.location || '';
        return locationWords.every((word) => propertyLocation.includes(word));
      });
    }

    // Filter by email
    if (email) {
      filtered = filtered.filter((property) => property.email === email);
    }

    setFilteredProperties(filtered);
  };

  return (
    <div className="parent-container">
      <Header onCategorySelect={handleCategorySelect} onLocationSelect={handleLocationSelect} />

      {loading ? (
        <p className="text-center text-lg font-semibold mt-6">Loading properties...</p>
      ) : error ? (
        <p className="text-center text-lg font-semibold text-red-500 mt-6">{error}</p>
      ) : (
        <div className="content-section grid grid-cols-1 gap-4 pl-20 pr-20 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
          <PropertyList ProductData={{ data: filteredProperties }} />
        </div>
      )}
    </div>
  );
}
