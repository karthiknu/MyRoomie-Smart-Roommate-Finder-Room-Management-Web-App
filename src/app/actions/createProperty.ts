'use server';
import prisma from '../lib/dbConnect';

export async function createProperty(propertyData: any, session: any) {
    try {
        // Validate session
        if (!session?.user?.email) {
            throw new Error("User is not logged in or email is not available in session.");
        }

        const userEmail = session.user.email;

        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (!user) {
            throw new Error(`User with email ${userEmail} not found.`);
        }

        const { category } = propertyData;

        if (!category) {
            throw new Error("Property category is required.");
        }

        const requiredFields = ['title', 'description', 'city', 'location', 'images', 'availableFrom', 'phoneNumber', 'email'];
        for (const field of requiredFields) {
            if (!propertyData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        const {
            type,
            apartmentType,
            bhkType,
            builtUpArea,
            balcony,
            bathrooms,
            floor,
            totalFloor,
            facing,
            amenities,
            gatedSecurity,
            parking,

            waterSupply,
            expectedPrice,
            expectedRent,
            expectedDeposit,
            maintenanceAmount,
            maintenanceOption,
            preferredTenants,
            nonVegAllowed,
            roommateOption,
            commonAmenities,
            roomAmenities,
            rules,
            foodIncluded,
            placeAvailableFor,
            preferredGuests,
            sharingType,
            propertyAge,
            ...basePropertyData
        } = propertyData;

        const baseProperty = await prisma.property.create({
            data: {
                ...basePropertyData,
                category,
                userEmail: user.email,
                roommateOption: category === 'PG' || (category === 'Home' && type === 'Rent') ? roommateOption : null,
                propertyAge: propertyAge || null,
            },
        });

        let propertyInfo;

        if (category === 'Home') {
            if (!type) {
                throw new Error("Property type is required for Home category.");
            }

            propertyInfo = await prisma.homeProperty.create({
                data: {
                    propertyId: baseProperty.propertyId,
                    type,
                    apartmentType: apartmentType || null,
                    bhkType: bhkType || null,
                    builtUpArea: builtUpArea || null,
                    balcony: balcony || null,
                    bathrooms: bathrooms || null,
                    floor: floor || null,
                    totalFloor: totalFloor || null,
                    facing: facing || null,
                    amenities: amenities || [],
                    gatedSecurity: gatedSecurity || false,
                    parking: parking || false,
                    waterSupply: waterSupply || null,
                    expectedPrice: type === 'Sale' ? expectedPrice : null,
                    expectedRent: type === 'Rent' ? expectedRent : null,
                    expectedDeposit: type === 'Rent' ? expectedDeposit : null,
                    maintenanceAmount: type === 'Rent' ? maintenanceAmount : null,
                    maintenanceOption: type === 'Rent' ? maintenanceOption : null,
                    preferredTenants: type === 'Rent' ? preferredTenants || [] : [],
                    nonVegAllowed: type === 'Rent' ? nonVegAllowed || false : null,
                },
            });
        } else if (category === 'PG') {
            propertyInfo = await prisma.pGProperty.create({
                data: {
                    propertyId: baseProperty.propertyId,
                    commonAmenities: commonAmenities || [],
                    roomAmenities: roomAmenities || [],
                    rules: rules || [],
                    foodIncluded: foodIncluded || null,
                    expectedRent: expectedRent || null,
                    expectedDeposit: expectedDeposit || null,
                    maintenanceAmount: maintenanceAmount || null,
                    maintenanceOption: maintenanceOption || null,
                    placeAvailableFor: placeAvailableFor || null,
                    preferredGuests: preferredGuests || null,
                    sharingType: sharingType || null,
                },
            });
        } else {
            throw new Error(`Invalid property category: ${category}`);
        }

        return {
            success: true,
            message: 'Property successfully saved',
            propertyInfo,
        };
    } catch (err: any) {
        console.error("Error creating property:", err);
        return {
            success: false,
            message: "Failed to create property",
            error: err.message,
        };
    }
}