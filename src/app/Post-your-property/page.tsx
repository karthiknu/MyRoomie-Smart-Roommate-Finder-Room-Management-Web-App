'use client';

import { useRouter } from "next/navigation";
import uniqid from 'uniqid';
import useStore from "../lib/useStore";
import { useEffect } from "react";

const PageComponent = () => {
    const router = useRouter();
    const addProperty = useStore((state: any) => state.addProperty);
    const property = useStore((state: any) => state.property);

    useEffect(() => {
        if (!property.propertyId) {
            const newPropertyId = uniqid();
            addProperty({
                propertyId: newPropertyId,
            });
        }
    }, [addProperty, property.propertyId]);

    const handleGetStarted = () => {
        router.push(`/Post-your-property/${property.propertyId}/city`);
    };

    return (
        <>
            <div className="flex max-w-screen-2xl justify-between items-center h-screen m-auto mt-[-80px]">
                <div className="flex max-w-md text-5xl font-bold">
                    It is easy to post your property
                </div>
                <div className="flex flex-col">
                    <div className="flex max-w-screen-md gap-6 h-32 mb-4">
                        <div className="text-2xl font-bold">1</div>
                        <div className="flex flex-col gap-3">
                            <div className="text-2xl font-bold">
                                Tell us about your place
                            </div>
                            <div className="text-2xl text-muted-foreground">
                                Share some basic info, such as where it is and what amenities are available at your property.
                            </div>
                        </div>
                    </div>
                    <div className="flex max-w-screen-md gap-6 h-32 mb-4">
                        <div className="text-2xl font-bold">2</div>
                        <div className="flex flex-col gap-3">
                            <div className="text-2xl font-bold">
                                Make it stand out
                            </div>
                            <div className="text-2xl text-muted-foreground">
                                Add 5 or more photos plus a title and description – we’ll help you out.
                            </div>
                        </div>
                    </div>
                    <div className="flex max-w-screen-md gap-6 h-32 mb-4">
                        <div className="text-2xl font-bold">3</div>
                        <div className="flex flex-col gap-3">
                            <div className="text-2xl font-bold">
                                Finish up and publish
                            </div>
                            <div className="text-2xl text-muted-foreground">
                                Set your price, verify the property details, and publish your listing.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="fixed w-full border-solid border-t-4 bottom-0 p-4 bg-white">
                <button className="font-bold underline" onClick={() => router.back()}>Back</button>
                <button 
                    onClick={handleGetStarted} 
                    className="p-3 bg-gradient-to-tr from-pink-600 via-pink-500 to-pink-400 float-right font-bold text-white rounded-xl"
                >
                    Get Started
                </button>
            </div>
        </>
    );
};

export default PageComponent;
