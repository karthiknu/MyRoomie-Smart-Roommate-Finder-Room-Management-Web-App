'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import useStore from "@/app/lib/useStore";

const PageContent = () => {
    const router = useRouter();
    const addProperty = useStore((state: any) => state.addProperty);
    const property = useStore((state: any) => state.property);

    const [expectedPrice, setExpectedPrice] = useState<string>(property.expectedPrice || "");
    const [availableFrom, setAvailableFrom] = useState<string>(property.availableFrom || "");
    const [phoneNumber, setPhoneNumber] = useState<string>(property.phoneNumber || "");
    const [email, setEmail] = useState<string>(property.email || "");

    const handleNext = () => {
        if (!expectedPrice || !availableFrom || !phoneNumber || !email) {
            alert("Please fill all the required fields.");
            return;
        }

        const updatedProperty = {
            ...property,
            expectedPrice,
            availableFrom,
            phoneNumber,
            email
        };

        addProperty(updatedProperty);

        router.push(`/Post-your-property/${property.propertyId}/photos`);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className='flex-grow p-6 pb-24'>
                <div className='flex flex-col gap-6 justify-center w-1/2 m-auto'>
                    <div className='text-2xl font-bold'>Provide Pricing Details about your property</div>
                    <div className='text-muted-foreground text-red-500'>Add details such as price and availability.</div>

                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="flex flex-col">
                            <label className="font-semibold mb-2">Expected Price</label>
                            <div className="flex items-center border rounded px-2">
                                <span>₹</span>
                                <input
                                    type="number"
                                    placeholder="Enter Amount"
                                    className="w-full p-2 focus:outline-none"
                                    value={expectedPrice}
                                    onChange={(e) => setExpectedPrice(e.target.value)}
                                />
                                <span className="ml-2 whitespace-nowrap">/ Month</span>
                            </div>
                            <div className="mt-2">
                                <input type="checkbox" id="negotiable" />
                                <label htmlFor="negotiable" className="ml-2">Price Negotiable</label>
                            </div>
                        </div>

                        <div className="flex flex-col col-span-2">
                            <label className="font-semibold mb-2">Available From</label>
                            <input
                                type="date"
                                className="border rounded p-2 w-full focus:outline-none"
                                value={availableFrom}
                                onChange={(e) => setAvailableFrom(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col col-span-2">
                            <label className="font-semibold mb-2">Owner's Phone Number</label>
                            <input
                                type="text"
                                placeholder="Enter Phone Number"
                                className="border rounded p-2 w-full focus:outline-none"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col col-span-2">
                            <label className="font-semibold mb-2">Owner's Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter Email Address"
                                className="border rounded p-2 w-full focus:outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <footer className="fixed bottom-0 left-0 right-0 flex justify-between w-full border-solid border-t-4 p-4 bg-white">
                <button className='font-bold underline ml-6' onClick={() => router.back()}>Back</button>
                <button onClick={handleNext} className="p-3 bg-gradient-to-tr from-pink-600 via-pink-500 to-pink-400 font-bold text-white rounded-xl mr-6">
                    Next
                </button>
            </footer>
        </div>
    );
}

export default PageContent;
