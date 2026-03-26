'use client';
import { useRouter } from "next/navigation";
import 'leaflet/dist/leaflet.css';
import dynamic from "next/dynamic";
import { useState } from "react";
import useStore from "@/app/lib/useStore";

const MapComponent = dynamic(() => import('@/app/components/Map'), { ssr: false });

const PageComponent = () => {
    const router = useRouter();
    const property = useStore((state: any) => state.property);
    const addProperty = useStore((state: any) => state.addProperty);
    
    const [locationSelected, setLocationSelected] = useState(false); 

    const handleLocationSelect = (location: string) => {
        addProperty({
            ...property,
            location: location,
        });

        setLocationSelected(true);

        console.log({
            ...property,
            propertyId: property.propertyId,
            location,
        });
    };

    const handleNext = () => {
        if (!locationSelected) {
            alert("Please select a location before proceeding.");
            return;
        }

        if (property.category === "PG") {
            router.push(`/Post-your-property/${property.propertyId}/pg-rules`);
        } else if (property.category === "Home" && property.type === "Sale") {
            router.push(`/Post-your-property/${property.propertyId}/sale-price`);
        } else {
            router.push(`/Post-your-property/${property.propertyId}/rent-details`);
        }
    };

    return (
        <div className="h-screen flex flex-col">
            <div className="flex-grow overflow-y-scroll">
                <div className="flex flex-col gap-6 justify-center w-1/3 m-auto py-8">
                    <div className='text-2xl font-bold'>Is the pin in the right spot?</div>
                    <div className='text-muted-foreground text-red-500'>Share the exact location of your property to help tenants easily find and visit it.</div>
                    <div>
                        <MapComponent onLocationSelect={handleLocationSelect} />
                    </div>
                </div>
            </div>
            <footer className="w-full border-solid border-t-4 p-4 bg-white">
                <div className="flex justify-between items-center max-w-screen-xl mx-auto">
                    <div className="mr-auto" style={{ marginLeft: '-90px' }}>
                        <button className='font-bold underline' onClick={() => router.back()}>Back</button>
                    </div>
                    <div className="ml-auto" style={{ marginRight: '-90px' }}>
                        <button 
                            onClick={handleNext} 
                            className="p-3 bg-gradient-to-tr from-pink-600 via-pink-500 to-pink-400 font-bold text-white rounded-xl"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PageComponent;
