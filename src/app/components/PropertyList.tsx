'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useSession } from 'next-auth/react'; 
import { useRouter } from 'next/navigation'; 


const OwnerModal = ({
  isOpen,
  onClose,
  phoneNumber,
  email,
}: {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber?: string;
  email?: string;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      aria-labelledby="owner-details-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-80">
        <h2 id="owner-details-title" className="text-lg font-bold mb-4">
          Owner Details
        </h2>
        <p className="mb-2">
          <strong>Phone:</strong> {phoneNumber || 'N/A'}
        </p>
        <p className="mb-2">
          <strong>Email:</strong> {email || 'N/A'}
        </p>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
          aria-label="Close Owner Details Modal"
        >
          ✕
        </button>
      </div>
    </div>
  );
};


const DeleteConfirmationModal = ({
  isOpen,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50"
      aria-labelledby="delete-confirmation-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-80">
        <h2 id="delete-confirmation-title" className="text-lg font-bold mb-4">
          Confirm Deletion
        </h2>
        <p className="mb-6">
          Your property will be deleted permanently. Are you sure you want to
          proceed?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

const PropertyList = ({ ProductData }: { ProductData: any }) => {
  const { data: session, status } = useSession(); 
  const router = useRouter();

  useEffect(() => {
  }, [session, status]);

  if (!ProductData) {
    return null;
  }

  const { data } = ProductData;

  const [selectedProperty, setSelectedProperty] = useState<any>(null); 
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false); 

  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 

  const openOwnerModal = (property: any) => {
    setSelectedProperty(property);
    setIsOwnerModalOpen(true);
  };

  const closeOwnerModal = () => {
    setIsOwnerModalOpen(false);
    setSelectedProperty(null);
  };

  
  const openDeleteModal = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPropertyToDelete(null);
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;

    try {
      const response = await fetch(`/api/properties/${propertyToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Property deleted successfully.');
        router.push('/');
      } else {
        const errorData = await response.json();
        alert(
          `Error deleting property: ${errorData.message || 'Unknown error'}`
        );
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('An unexpected error occurred while deleting the property.');
    }
  };

  const handleUpdate = (propertyId: string) => {
    router.push(`/Post-your-property/${propertyId}/city`);
  };

  const locationToString = (location: any): string => {
    if (typeof location === 'object' && location !== null) {
      return Object.values(location).filter(Boolean).join(', ');
    }
    if (typeof location === 'string') {
      return location;
    }
    return 'Location not available';
  };

  return (
    <>
      {data &&
        data.map((item: any) => {
          const isPG = item.category === 'PG';
          const isHomeForSale =
            item.category === 'Home' && item.homeProperty?.type === 'Sale';

          const href = isHomeForSale
            ? `/sale/${item.propertyId}/propertyInfo` 
            : isPG
            ? `/pg/${item.propertyId}/propertyInfo` 
            : `/rent/${item.propertyId}/propertyInfo`; 

          const locationString = locationToString(item.location);

          const availableFor =
            item.pgProperty?.placeAvailableFor === 'Anyone'
              ? 'Male, Female'
              : item.pgProperty?.placeAvailableFor || 'N/A';

          const preferredGuests =
            item.pgProperty?.preferredGuests === 'Both'
              ? 'Students, Working Professionals'
              : item.pgProperty?.preferredGuests || 'N/A';

          const preferredTenants = item.homeProperty?.preferredTenants?.includes(
            'Anyone'
          )
            ? 'Anyone'
            : item.homeProperty?.preferredTenants?.join(', ') || 'N/A';

          const floorInfo = `${item.homeProperty?.floor || 'N/A'} out of ${
            item.homeProperty?.totalFloor || 'N/A'
          }`;

          return (
            <div
              key={item.propertyId}
              className="product-card mb-3 flex flex-col p-4 border rounded-lg shadow-sm"
            >
              <Link href={href}>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="w-full lg:w-1/3 relative z-0">
                    <Swiper
                      modules={[Navigation, Pagination]}
                      spaceBetween={10}
                      slidesPerView={1}
                      loop={true}
                      navigation={true}
                      pagination={{ clickable: true }}
                      className="relative"
                      onClick={(e) => e.stopPropagation()} 
                    >
                      {item.images.map((image: string, index: number) => (
                        <SwiperSlide key={index}>
                          <img
                            className="object-cover rounded-lg"
                            src={image}
                            alt={`Property image ${index + 1}`}
                            style={{ width: '100%', height: '330px' }} 
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  <div className="w-full lg:w-2/3 flex flex-col justify-between">
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="text-lg font-bold">{item.title}</div>
                      <div className="text-sm text-black">{locationString}</div>

                      <div
                        className={`flex ${
                          isHomeForSale ? 'gap-8' : 'gap-4'
                        }`}
                      >
                        {isHomeForSale ? (
                          <>
                            <div>
                              <span className="font-semibold">
                                ₹ {item.homeProperty?.expectedPrice || 'N/A'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {' '}
                                Price
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold">
                                {item.homeProperty?.builtUpArea || 'N/A'} sqft
                              </span>
                              <span className="text-sm text-gray-500">
                                {' '}
                                Builtup
                              </span>
                            </div>
                          </>
                        ) : isPG ? (
                          <>
                            <div>
                              <span className="font-semibold">
                                ₹ {item.pgProperty?.expectedRent || 'N/A'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {' '}
                                Rent
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold">
                                ₹ {item.pgProperty?.expectedDeposit || 'N/A'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {' '}
                                Deposit
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <span className="font-semibold">
                                ₹ {item.homeProperty?.expectedRent || 'N/A'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {' '}
                                Rent
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold">
                                ₹ {item.homeProperty?.expectedDeposit || 'N/A'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {' '}
                                Deposit
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold">
                                {item.homeProperty?.builtUpArea || 'N/A'} sqft
                              </span>
                              <span className="text-sm text-gray-500">
                                {' '}
                                Builtup
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 p-2 border-2 border-black rounded-lg">
                        <div className="flex flex-col items-start border-r border-b border-red-500 p-2 hover:bg-gray-100 hover:scale-105 transition-all duration-200 ease-in-out">
                          <span className="font-semibold">
                            {isPG ? 'Available For' : 'BHK Type'}
                          </span>
                          <span className="text-sm">
                            {isPG
                              ? availableFor
                              : item.homeProperty?.bhkType || 'N/A'}{' '}
                            {isPG ? '' : 'Apartment Type'}
                          </span>
                        </div>
 
                        <div className="flex flex-col items-start border-b border-red-500 p-2 hover:bg-gray-100 hover:scale-105 transition-all duration-200 ease-in-out">
                          <span className="font-semibold">
                            {isHomeForSale
                              ? 'Property Age'
                              : isPG
                              ? 'Preferred Guests'
                              : 'Preferred Tenants'}
                          </span>
                          <span className="text-sm">
                            {isHomeForSale
                              ? item.propertyAge || 'N/A'
                              : isPG
                              ? preferredGuests
                              : preferredTenants}
                          </span>
                        </div>

                        <div className="flex flex-col items-start border-r border-red-500 p-2 hover:bg-gray-100 hover:scale-105 transition-all duration-200 ease-in-out">
                          <span className="font-semibold">Available From</span>
                          <span className="text-sm">
                            {item.availableFrom || 'N/A'}
                          </span>
                        </div>

                        <div className="flex flex-col items-start border-red-500 p-2 hover:bg-gray-100 hover:scale-105 transition-all duration-200 ease-in-out">
                          <span className="font-semibold">
                            {isPG ? 'Preferred Guests' : 'Floor'}
                          </span>
                          <span className="text-sm">
                            {isPG ? preferredGuests : floorInfo}
                          </span>
                        </div>
                      </div>
                    </div>

                    {session?.user?.email === item.email && (
                      <div className="flex gap-20 mt-2 mb-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleUpdate(item.propertyId); 
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-6"
                        >
                          Update
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openDeleteModal(item.propertyId); 
                          }}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg ml-40"
                        >
                          Delete
                        </button>
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openOwnerModal(item);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                      Get Owner Details
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}

      <OwnerModal
        isOpen={isOwnerModalOpen}
        onClose={closeOwnerModal}
        phoneNumber={selectedProperty?.phoneNumber}
        email={selectedProperty?.email}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={() => {
          handleDelete();
          closeDeleteModal();
        }}
        onCancel={() => {
          closeDeleteModal();
          router.push('/'); 
        }}
      />
    </>
  );
};

export default PropertyList;
