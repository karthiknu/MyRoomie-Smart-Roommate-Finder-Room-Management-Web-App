'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getFullPropertyById } from '../../actions/fetchProperty';
import dayjs from 'dayjs';
import MapComponent from '../../components/Map';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const handleRazorpayPayment = async (amount: number) => {
  const res = await loadRazorpayScript();

  if (!res) {
    alert('Razorpay SDK failed to load. Please check your internet connection.');
    return;
  }

  const response = await fetch('/api/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, currency: 'INR' }),
  });

  if (!response.ok) {
    alert('Failed to create the order. Please try again.');
    return;
  }

  const orderData = await response.json();

  const options = {
    key: process.env.RAZORPAY_ID_KEY,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'My Property Rental',
    description: 'Payment for property booking',
    order_id: orderData.id,
    handler: function (response: any) {
      alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
    },
    prefill: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      contact: '9999999999',
    },
    theme: {
      color: '#F37254',
    },
  };
  const paymentObject = new (window as any).Razorpay(options);
  paymentObject.open();
};

const amenitiesList = [
  { name: "Gym", icon: "💪" },
  { name: "Lift", icon: "🛗" },
  { name: "Air Conditioner", icon: "❄️" },
  { name: "Intercom", icon: "☎️" },
  { name: "Children Play Area", icon: "🧸" },
  { name: "Servant Room", icon: "🛏️" },
  { name: "Gas Pipeline", icon: "🛠️" },
  { name: "Rain Water Harvesting", icon: "💧" },
  { name: "House Keeping", icon: "🧹" },
  { name: "Visitor Parking", icon: "🚗" },
  { name: "Internet Services", icon: "📶" },
  { name: "Club House", icon: "🏠" },
  { name: "Swimming Pool", icon: "🏊‍♂️" },
  { name: "Fire Safety", icon: "🔥" },
  { name: "Shopping Center", icon: "🛍️" },
  { name: "Park", icon: "🌳" },
  { name: "Sewage Treatment Plant", icon: "🚽" },
  { name: "Power Backup", icon: "🔋" },
  { name: "Geyser", icon: "🚿" },
];

const PageComponent = ({ params }: any) => {
  const [property, setProperty] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapLocation, setMapLocation] = useState<string>('');

  useEffect(() => {
    const fetchPropertyInfoById = async () => {
      const propertyId = params.slug[0];
      const response = await getFullPropertyById(propertyId);

      if (response?.data) {
        setProperty(response.data);
        const address = response.data.location || '';
        setMapLocation(address);
      }
    };
    fetchPropertyInfoById();
  }, [params.slug]);

  if (!property) {
    return <div>Loading...</div>;
  }

  const locationToString = (location: any): string => {
    if (typeof location === 'object' && location !== null) {
      return Object.values(location).filter(Boolean).join(', ');
    }
    if (typeof location === 'string') {
      return location;
    }
    return 'Location not available';
  };

  const locationString = locationToString(property.location);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const showMaintenance = property.homeProperty?.maintenanceOption === 'Maintenance Extra';

  const getAmenityIcon = (amenityName: string) => {
    const amenity = amenitiesList.find(a => a.name === amenityName);
    return amenity ? amenity.icon : '🏷️';
  };

  return (
    <>
      <div className="p-4 border-b mb-4">
        <h1 className="text-xl font-semibold">{property.title}</h1>
        <p className="text-gray-500">{locationString}</p>
      </div>

      <div className="border-2 border-red-500 bg-white p-4 rounded-lg mb-6">
        <div className="flex justify-around items-center">
          <div className="text-center">
            <div className="text-xl font-bold">₹ {property.homeProperty?.expectedPrice || 'N/A'}</div>
            <div className="text-sm text-gray-500">Price</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{property.homeProperty?.builtUpArea || 'N/A'} sqft</div>
            <div className="text-sm text-gray-500">Builtup</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 p-6">
        <div className="w-full">
          {property.images && (
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              loop={true}
              navigation={true}
              pagination={{ clickable: true }}
              style={{ height: '420px' }}
            >
              {property.images.map((image: string, index: number) => (
                <SwiperSlide key={index}>
                  <img
                    className="object-cover rounded-lg"
                    src={image}
                    alt={`Property image ${index + 1}`}
                    style={{ width: '100%', height: '100%' }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-0 border border-gray-300 rounded-lg">
            <div className="flex flex-row items-center justify-start border p-4">
              <span className="mr-2">🛏️</span>
              <div>
                <div className="font-bold">{property.homeProperty?.bhkType || 'N/A'} Bedroom</div>
                <div className="text-sm text-gray-500">No. of Bedroom</div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-start border p-4">
              <span className="mr-2">🏢</span>
              <div>
                <div className="font-bold">{property.homeProperty?.apartmentType || 'N/A'}</div>
                <div className="text-sm text-gray-500">Property Type</div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-start border p-4">
              <span className="mr-2">🗝️</span>
              <div>
                <div className="font-bold">{property.availableFrom ? dayjs(property.availableFrom).format('MMM DD, YYYY') : 'N/A'}</div>
                <div className="text-sm text-gray-500">Possession</div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-start border p-4">
              <span className="mr-2">🚗</span>
              <div>
                <div className="font-bold">{property.homeProperty?.parking ? 'Available' : 'Unavailable'}</div>
                <div className="text-sm text-gray-500">Parking</div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-start border p-4">
              <span className="mr-2">🏗️</span>
              <div>
                <div className="font-bold">{property.propertyAge || 'N/A'}</div>
                <div className="text-sm text-gray-500">Age of Building</div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-start border p-4">
              <span className="mr-2">🏞️</span>
              <div>
                <div className="font-bold">{property.homeProperty?.balcony || 'N/A'}</div>
                <div className="text-sm text-gray-500">Balcony</div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-start border p-4">
              <span className="mr-2">🗓️</span>
              <div>
                <div className="font-bold">{property.createdAt ? dayjs(property.createdAt).format('MMM DD, YYYY') : 'N/A'}</div>
                <div className="text-sm text-gray-500">Posted On</div>
              </div>
            </div>
          </div>

          <button onClick={openModal} className="bg-red-500 text-white w-full py-4 font-semibold rounded-lg mt-4">
            Contact
          </button>
        </div>
      </div>

      <div className="p-4 mt-6">
        <div className="bg-red-500 text-white py-2 px-4 font-semibold rounded-lg inline-block mb-4">Overview</div>

        <div className="border-2 border-red-500 bg-white p-4 rounded-lg">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border p-2 rounded">
              <strong>Water Supply:</strong> {property.homeProperty?.waterSupply === 'Both' ? 'Borewell, Corporation' : property.homeProperty?.waterSupply || 'N/A'}
            </div>
            <div className="border p-2 rounded">
              <strong>Bathrooms:</strong> {property.homeProperty?.bathrooms || 'N/A'}
            </div>
            <div className="border p-2 rounded">
              <strong>Gated Security:</strong> {property.homeProperty?.gatedSecurity ? 'Yes' : 'No'}
            </div>
            <div className="border p-2 rounded">
              <strong>Facing:</strong> {property.homeProperty?.facing || 'N/A'}
            </div>
            <div className="border p-2 rounded">
              <strong>Floor:</strong> {property.homeProperty?.floor} out of {property.homeProperty?.totalFloor || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 mt-6">
        <div className="bg-red-500 text-white py-2 px-4 font-semibold rounded-lg inline-block mb-4">Description</div>
        <div className="border-2 border-gray-300 bg-white p-4 rounded-lg">
          <p>{property.description || 'No description available'}</p>
        </div>
      </div>

      <div className="p-4 mt-6">
        <div className="bg-red-500 text-white py-2 px-4 font-semibold rounded-lg inline-block mb-4">Amenities</div>

        <div className="border-2 border-red-500 bg-white p-4 rounded-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {property.homeProperty?.amenities?.map((amenity: string, index: number) => (
              <div key={index} className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
                <span className="text-2xl mb-2">{getAmenityIcon(amenity)}</span>
                <p className="text-center">{amenity}</p>
              </div>
            )) || <p>No amenities available</p>}
          </div>
        </div>
      </div>

      <div className="p-4 mt-6">
        <div className="bg-red-500 text-white py-2 px-4 font-semibold rounded-lg inline-block mb-4">Property Location</div>

        <div className="border-2 border-red-500 bg-white p-4 rounded-lg">
          <MapComponent initialAddress={mapLocation} onLocationSelect={() => {}} />
        </div>
      </div>

      <div className="flex justify-center items-center" style={{ marginTop: '40px' }}>
        <div className="text-center">
          <div className="bg-red-500 text-white py-2 px-4 font-semibold rounded-lg inline-block mb-4">
            Pay Now
          </div>

          <div className="border-2 border-red-500 bg-white p-4 rounded-lg" style={{ width: '500px' }}>
            <strong className="text-muted-foreground mb-6 block">
              You need to pay a token amount of ₹10,000 to reserve this property.
            </strong>
            <button
              onClick={() => handleRazorpayPayment(10000 * 100)}
              className="bg-green-500 text-white py-2 px-6 rounded-lg mx-auto block"
            >
              Proceed to Pay ₹10,000
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 z-60">
            <h2 className="text-xl font-bold mb-4">Owner Details</h2>
            <p><strong>Phone Number:</strong> {property.phoneNumber || 'N/A'}</p>
            <p><strong>Email:</strong> {property.email || 'N/A'}</p>
            <button onClick={closeModal} className="mt-4 bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PageComponent;
