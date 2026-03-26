'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useStore from "@/app/lib/useStore";

const PageContent = () => {
    const router = useRouter();
    const addProperty = useStore((state: any) => state.addProperty);
    const property = useStore((state: any) => state.property);

    const [apartmentType, setApartmentType] = useState<string>(property.apartmentType || "");
    const [bhkType, setBhkType] = useState<string>(property.bhkType || "");
    const [floor, setFloor] = useState<string>(property.floor || "");
    const [totalFloor, setTotalFloor] = useState<string>(property.totalFloor || "");
    const [propertyAge, setPropertyAge] = useState<string>(property.propertyAge || "");
    const [facing, setFacing] = useState<string>(property.facing || "");
    const [builtUpArea, setBuiltUpArea] = useState<number | "">(property.builtUpArea || "");

    const handleNext = () => {
        if (
            !apartmentType || !bhkType || !floor || !totalFloor ||
            !propertyAge || !facing || !builtUpArea
        ) {
            alert("Please select all options before proceeding to the next page.");
            return;
        }

        addProperty({
            ...property,
            apartmentType,
            bhkType,
            floor,
            totalFloor,
            propertyAge,
            facing,
            builtUpArea,
        });

        router.push(`/Post-your-property/${property.propertyId}/location`);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow overflow-y-auto pb-20">
                <div className='flex flex-col gap-6 w-3/4 m-auto'>
                    <h2 className='text-2xl font-bold mb-6'>Property Details</h2>
                    
                    <p className="text-2xl text-red-500 mb-8">Give some details about your property</p>

                    <div className='grid grid-cols-2 gap-x-6 gap-y-4'>
                        <div>
                            <label className='block mb-2 font-bold'>Apartment Type*</label>
                            <select 
                                className='w-full p-3 border rounded'
                                value={apartmentType}
                                onChange={(e) => setApartmentType(e.target.value)}
                            >
                                <option value="" disabled>Select</option>
                                <option value="Independent House">Independent House</option>
                                <option value="Gated Community">Gated Community</option>
                            </select>
                        </div>

                        <div>
                            <label className='block mb-2 font-bold'>BHK Type*</label>
                            <select 
                                className='w-full p-3 border rounded'
                                value={bhkType}
                                onChange={(e) => setBhkType(e.target.value)}
                            >
                                <option value="" disabled>Select</option>
                                <option value="1 RK">1 RK</option>
                                <option value="1 BHK">1 BHK</option>
                                <option value="2 BHK">2 BHK</option>
                                <option value="3 BHK">3 BHK</option>
                                <option value="4 BHK">4 BHK</option>
                                <option value="4+ BHK">4+ BHK</option>
                            </select>
                        </div>

                        <div>
                            <label className='block mb-2 font-bold'>Floor*</label>
                            <select 
                                className='w-full p-3 border rounded'
                                value={floor}
                                onChange={(e) => {
                                    setFloor(e.target.value);
                                    setTotalFloor("");
                                }}
                            >
                                <option value="" disabled>Select</option>
                                {[...Array(51)].map((_, i) => (
                                    <option key={i} value={i === 0 ? "Ground Floor" : i}>
                                        {i === 0 ? "Ground Floor" : i}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className='block mb-2 font-bold'>Total Floor*</label>
                            <select 
                                className='w-full p-3 border rounded'
                                value={totalFloor}
                                onChange={(e) => setTotalFloor(e.target.value)}
                                disabled={!floor}
                            >
                                <option value="" disabled>Select</option>
                                {[...Array(51)].map((_, i) => {
                                    if (floor !== "" && i >= parseInt(floor)) {
                                        return <option key={i} value={i}>{i === 0 ? "Ground Floor" : i}</option>;
                                    }
                                    return null;
                                })}
                            </select>
                        </div>

                        <div>
                            <label className='block mb-2 font-bold'>Property Age*</label>
                            <select 
                                className='w-full p-3 border rounded'
                                value={propertyAge}
                                onChange={(e) => setPropertyAge(e.target.value)}
                            >
                                <option value="" disabled>Select</option>
                                <option value="Less than a year">Less than a year</option>
                                <option value="1 to 3 years">1 to 3 years</option>
                                <option value="3 to 5 years">3 to 5 years</option>
                                <option value="5 to 10 years">5 to 10 years</option>
                                <option value="10+ years">10+ years</option>
                            </select>
                        </div>

                        <div>
                            <label className='block mb-2 font-bold'>Facing*</label>
                            <select 
                                className='w-full p-3 border rounded'
                                value={facing}
                                onChange={(e) => setFacing(e.target.value)}
                            >
                                <option value="" disabled>Select</option>
                                <option value="North">North</option>
                                <option value="East">East</option>
                                <option value="South">South</option>
                                <option value="West">West</option>
                                <option value="North-East">North-East</option>
                                <option value="North-West">North-West</option>
                                <option value="South-East">South-East</option>
                                <option value="South-West">South-West</option>
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className='block mb-2 font-bold'>Built Up Area*</label>
                            <div className='flex gap-4 items-center'>
                                <input
                                    type="number"
                                    className='w-full p-3 border rounded'
                                    placeholder='Built Up Area'
                                    value={builtUpArea}
                                    onChange={(e) => setBuiltUpArea(Number(e.target.value))}
                                />
                                <span>Sq.ft</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 flex w-full border-solid border-t-4 p-4 bg-white">
                <button className='font-bold underline' onClick={() => router.back()}>Back</button>
                <button 
                    onClick={handleNext} 
                    className="p-3 bg-gradient-to-tr from-pink-600 via-pink-500 to-pink-400 font-bold text-white rounded-xl ml-auto"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default PageContent;
