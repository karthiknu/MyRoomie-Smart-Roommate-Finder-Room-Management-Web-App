'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useStore from "@/app/lib/useStore";

const PageComponent = () => {
    const router = useRouter();
    const addProperty = useStore((state: any) => state.addProperty);
    const property = useStore((state: any) => state.property);

    const [roomAmenities, setRoomAmenities] = useState<string[]>(property.roomAmenities || []);
    const [commonAmenities, setCommonAmenities] = useState<string[]>(property.commonAmenities || []);

    const roomAmenitiesList = [
        { name: "Cupboard", icon: "🛏" },
        { name: "Geyser", icon: "🚿" },
        { name: "TV", icon: "📺" },
        { name: "AC", icon: "❄️" },
        { name: "Bedding", icon: "🛏" },
        { name: "Attached Bathroom", icon: "🚽" }
    ];

    const commonAmenitiesList = [
        { name: "Wifi", icon: "📶" },
        { name: "Common TV", icon: "📺" },
        { name: "Lift", icon: "🛗" },
        { name: "Power Backup", icon: "🔋" },
        { name: "Mess", icon: "🍽" },
        { name: "Refrigerator", icon: "🧊" },
        { name: "Cooking Allowed", icon: "🍳" },
        { name: "Parking", icon: "🚗" }
    ];

    const handleRoomAmenitiesChange = (amenity: string) => {
        setRoomAmenities((prev) =>
            prev.includes(amenity)
                ? prev.filter((item) => item !== amenity)
                : [...prev, amenity]
        );
    };

    const handleCommonAmenitiesChange = (amenity: string) => {
        setCommonAmenities((prev) =>
            prev.includes(amenity)
                ? prev.filter((item) => item !== amenity)
                : [...prev, amenity]
        );
    };

    useEffect(() => {
        const updatedProperty = {
            ...property,
            roomAmenities,
            commonAmenities
        };
        addProperty(updatedProperty);
    }, [roomAmenities, commonAmenities]);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow overflow-y-auto pb-20">
                <div className="container mx-auto py-8">
                    <h2 className="text-2xl font-semibold text-center mb-10 text-red-500">
                        Provide additional details about your property
                    </h2>

                    {/* Room Amenities Section */}
                    <div className="max-w-xl w-full mx-auto mb-10">
                        <h3 className="text-xl font-semibold mb-5">Room Amenities</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {roomAmenitiesList.map((amenity) => (
                                <div key={amenity.name} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={roomAmenities.includes(amenity.name)}
                                        onChange={() => handleRoomAmenitiesChange(amenity.name)}
                                        id={amenity.name}
                                    />
                                    <label htmlFor={amenity.name} className="ml-2 flex items-center">
                                        <span className="mr-2">{amenity.icon}</span>
                                        {amenity.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Common Amenities Section */}
                    <div className="max-w-xl w-full mx-auto mb-10">
                        <h3 className="text-xl font-semibold mb-5">Common Amenities</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {commonAmenitiesList.map((amenity) => (
                                <div key={amenity.name} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={commonAmenities.includes(amenity.name)}
                                        onChange={() => handleCommonAmenitiesChange(amenity.name)}
                                        id={amenity.name}
                                    />
                                    <label htmlFor={amenity.name} className="ml-2 flex items-center">
                                        <span className="mr-2">{amenity.icon}</span>
                                        {amenity.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 flex justify-between w-full border-t-4 p-4 bg-white">
                <button className='font-bold underline' onClick={() => router.back()}>
                    Back
                </button>
                <button
                    onClick={() => router.push(`/Post-your-property/${property.propertyId}/description`)}
                    className="p-3 bg-gradient-to-tr from-pink-600 via-pink-500 to-pink-400 font-bold text-white rounded-xl"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default PageComponent;
