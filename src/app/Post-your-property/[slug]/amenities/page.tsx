'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useStore from "@/app/lib/useStore";

const PageComponent = () => {
    const router = useRouter();
    const addProperty = useStore((state: any) => state.addProperty);
    const property = useStore((state: any) => state.property);

    const [bathrooms, setBathrooms] = useState<number>(property.bathrooms || 0);
    const [balcony, setBalcony] = useState<number>(property.balcony || 0);
    const [waterSupply, setWaterSupply] = useState<string>(property.waterSupply || "");
    const [parking, setParking] = useState<boolean>(property.parking || false);
    const [nonVegAllowed, setNonVegAllowed] = useState<boolean>(property.nonVegAllowed || false);
    const [gatedSecurity, setGatedSecurity] = useState<boolean>(property.gatedSecurity || false);
    const [amenities, setAmenities] = useState<string[]>(property.amenities || []);

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

    useEffect(() => {
        const updatedWaterSupply = waterSupply === "Both" ? "Borewell, Corporation" : waterSupply;

        const updatedProperty = {
            ...property,
            bathrooms,
            balcony,
            waterSupply: updatedWaterSupply, 
            parking,
            nonVegAllowed,
            gatedSecurity,
            amenities,
        };

        addProperty(updatedProperty);
    }, [bathrooms, balcony, waterSupply, parking, nonVegAllowed, gatedSecurity, amenities]);

    const handleAmenitiesChange = (amenity: string) => {
        setAmenities((prev) =>
            prev.includes(amenity)
                ? prev.filter((item) => item !== amenity)
                : [...prev, amenity]
        );
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow overflow-y-auto pb-20">
                <div className="container mx-auto py-8">
                    <h2 className="text-2xl font-semibold text-center mb-10 text-red-500">Provide additional details about your property to get maximum visibility</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-xl w-full mx-auto">
                        <div className="flex flex-col items-center">
                            <label className="font-bold">Bathroom(s)</label>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setBathrooms(bathrooms - 1)} disabled={bathrooms <= 0} className="p-2 border rounded">-</button>
                                <span>{bathrooms}</span>
                                <button onClick={() => setBathrooms(bathrooms + 1)} className="p-2 border rounded">+</button>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="font-bold">Balcony</label>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setBalcony(balcony - 1)} disabled={balcony <= 0} className="p-2 border rounded">-</button>
                                <span>{balcony}</span>
                                <button onClick={() => setBalcony(balcony + 1)} className="p-2 border rounded">+</button>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="font-bold">Water Supply</label>
                            <select
                                value={waterSupply}
                                onChange={(e) => setWaterSupply(e.target.value)}
                                className="border p-2 rounded w-full"
                            >
                                <option value="" disabled>Select</option>
                                <option value="Corporation">Corporation</option>
                                <option value="Borewell">Borewell</option>
                                <option value="Both">Borewell, Corporation</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-xl w-full mx-auto">
                        <div className="flex flex-col items-center">
                            <label className="font-bold">Parking</label>
                            <div className="flex gap-4">
                                <button
                                    className={`p-2 border transition-transform duration-300 ease-in-out ${parking === false ? 'bg-blue-500 text-white cursor-default' : 'hover:bg-gray-100 hover:scale-105 border-gray-300'}`}
                                    onClick={() => setParking(false)}
                                >
                                    No
                                </button>
                                <button
                                    className={`p-2 border transition-transform duration-300 ease-in-out ${parking === true ? 'bg-blue-500 text-white cursor-default' : 'hover:bg-gray-100 hover:scale-105 border-gray-300'}`}
                                    onClick={() => setParking(true)}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="font-bold">Non-Veg Allowed</label>
                            <div className="flex gap-4">
                                <button
                                    className={`p-2 border transition-transform duration-300 ease-in-out ${nonVegAllowed === false ? 'bg-blue-500 text-white cursor-default' : 'hover:bg-gray-100 hover:scale-105 border-gray-300'}`}
                                    onClick={() => setNonVegAllowed(false)}
                                >
                                    No
                                </button>
                                <button
                                    className={`p-2 border transition-transform duration-300 ease-in-out ${nonVegAllowed === true ? 'bg-blue-500 text-white cursor-default' : 'hover:bg-gray-100 hover:scale-105 border-gray-300'}`}
                                    onClick={() => setNonVegAllowed(true)}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <label className="font-bold">Gated Security</label>
                            <div className="flex gap-4">
                                <button
                                    className={`p-2 border transition-transform duration-300 ease-in-out ${gatedSecurity === false ? 'bg-blue-500 text-white cursor-default' : 'hover:bg-gray-100 hover:scale-105 border-gray-300'}`}
                                    onClick={() => setGatedSecurity(false)}
                                >
                                    No
                                </button>
                                <button
                                    className={`p-2 border transition-transform duration-300 ease-in-out ${gatedSecurity === true ? 'bg-blue-500 text-white cursor-default' : 'hover:bg-gray-100 hover:scale-105 border-gray-300'}`}
                                    onClick={() => setGatedSecurity(true)}
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>

                    <hr className="mb-10" />

                    <h3 className="text-2xl font-semibold mb-10 text-center text-red-500">Select the available amenities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl w-full mx-auto">
                        {amenitiesList.map((amenity) => (
                            <div key={amenity.name} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={amenities.includes(amenity.name)}
                                    onChange={() => handleAmenitiesChange(amenity.name)}
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

            <div className="fixed bottom-0 left-0 right-0 flex justify-between w-full border-t-4 p-4 bg-white">
                <button className='font-bold underline' onClick={() => router.back()}>Back</button>
                <button onClick={() => router.push(`/Post-your-property/${property.propertyId}/description`)} className="p-3 bg-gradient-to-tr from-pink-600 via-pink-500 to-pink-400 font-bold text-white rounded-xl">Next</button>
            </div>
        </div>
    );
}

export default PageComponent;
