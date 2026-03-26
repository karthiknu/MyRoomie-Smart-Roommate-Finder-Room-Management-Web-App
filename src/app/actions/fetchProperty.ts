'use server';
import prisma from '../lib/dbConnect';

export async function fetchProperty() {
  try {
    const data = await prisma.property.findMany({
      select: {
        propertyId: true, 
        title: true,
        category: true, 
        phoneNumber: true, 
        email: true, 
        location: true, 
        availableFrom: true,
        images: true,
        propertyAge: true, 
        homeProperty: {
          select: {
            expectedRent: true,
            expectedDeposit: true,
            builtUpArea: true,
            bhkType: true,
            preferredTenants: true,
            floor: true,
            totalFloor: true,
            type: true, 
            expectedPrice: true, 
          },
        },
        pgProperty: {
          select: {
            expectedRent: true,
            expectedDeposit: true,
            preferredGuests: true, 
            placeAvailableFor: true, 
          },
        },
      },
    });

    return { data };  
  } catch (err: any) {  
    return {
      message: "Failed to fetch data from database",
      error: err
    };
  }
}

export async function getFullPropertyById(propertyId: string) {
  try {
    const property = await prisma.property.findUnique({
      where: {
        propertyId: propertyId,
      },
      select: {
        propertyId: true,
        category: true,
        title: true,
        location: true,
        availableFrom: true,
        propertyAge: true,
        createdAt: true,
        phoneNumber: true,
        email: true,
        images: true,
        description: true,

        // HomeProperty 
        homeProperty: {
          select: {
            bhkType: true,
            preferredTenants: true,
            parking: true,
            balcony: true,
            apartmentType: true,
            expectedRent: true,
            expectedPrice: true,
            expectedDeposit: true,
            builtUpArea: true,
            amenities: true,
            waterSupply: true,
            floor: true,
            totalFloor: true,
            gatedSecurity: true,
            nonVegAllowed: true,
            bathrooms: true,
            facing: true,

            maintenanceAmount: true,
            maintenanceOption: true,
          },
        },

        // PGProperty specific fields 
        pgProperty: {
          select: {
            commonAmenities:   true,
            roomAmenities:     true,
            rules:             true,
            foodIncluded:      true,
            expectedRent:      true,
            expectedDeposit:   true,
            maintenanceAmount: true,
            maintenanceOption: true,
            placeAvailableFor: true,
            preferredGuests:   true,
            sharingType:       true,
          },
        },
      },
    });

    return { data: property };
  } catch (err: any) {
    return {
      message: "Failed to fetch property details",
      error: err,
    };
  }
}






