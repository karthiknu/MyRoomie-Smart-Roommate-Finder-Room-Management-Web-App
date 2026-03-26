'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useStore from "@/app/lib/useStore";

const PageContent = () => {
    const router = useRouter();
    const addProperty = useStore((state: any) => state.addProperty);
    const property = useStore((state: any) => state.property);

    const [expectedRent, setExpectedRent] = useState<string>(property.expectedRent || "");
    const [expectedDeposit, setExpectedDeposit] = useState<string>(property.expectedDeposit || "");
    const [availableFrom, setAvailableFrom] = useState<string>(property.availableFrom || "");
    const [maintenanceOption, setMaintenanceOption] = useState<string>(property.maintenanceOption || "Maintenance Included");
    const [maintenanceAmount, setMaintenanceAmount] = useState<string>(property.maintenanceAmount || "");
    const [preferredTenants, setPreferredTenants] = useState<string[]>(property.preferredTenants || []);
    const [roommateOption, setRoommateOption] = useState<string>(property.roommateOption || "No, I was just renting out this property");
    const [phoneNumber, setPhoneNumber] = useState<string>(property.phoneNumber || "");
    const [email, setEmail] = useState<string>(property.email || "");
    const [showMaintenanceAmount, setShowMaintenanceAmount] = useState<boolean>(property.maintenanceOption === "Maintenance Extra");

    useEffect(() => {
        setShowMaintenanceAmount(maintenanceOption === "Maintenance Extra");
    }, [maintenanceOption]);

    const handleNext = () => {
        if (!expectedRent || !expectedDeposit || !availableFrom || preferredTenants.length === 0 || !phoneNumber || !email) {
            alert("Please fill all the required fields.");
            return;
        }

        if (showMaintenanceAmount && !maintenanceAmount) {
            alert("Please enter the maintenance amount.");
            return;
        }

        const updatedProperty = {
            ...property,
            expectedRent,
            expectedDeposit,
            maintenanceOption,
            maintenanceAmount: showMaintenanceAmount ? maintenanceAmount : null,
            availableFrom,
            preferredTenants,
            roommateOption,
            phoneNumber,
            email
        };

        addProperty(updatedProperty);

        router.push(`/Post-your-property/${property.propertyId}/photos`);
    };

    const handleTenantChange = (tenant: string) => {
        if (tenant === "Anyone") {
            if (preferredTenants.includes("Anyone")) {
                setPreferredTenants([]); 
            } else {
                setPreferredTenants(["Anyone", "Family", "Bachelor Female", "Bachelor Male"]); 
            }
        } else {
            setPreferredTenants(prev => {
                const updatedTenants = prev.includes(tenant)
                    ? prev.filter(t => t !== tenant) 
                    : [...prev, tenant]; 

                if (updatedTenants.length === 3 && !updatedTenants.includes("Anyone")) {
                    return [...updatedTenants, "Anyone"];
                }

                if (updatedTenants.includes("Anyone") && updatedTenants.length !== 4) {
                    return updatedTenants.filter(t => t !== "Anyone");
                }

                return updatedTenants;
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className='flex-grow p-6 pb-24'>
                <div className='flex flex-col gap-6 justify-center w-1/2 m-auto'>
                    <div className='text-2xl font-bold'>Provide Rental Details about your property</div>
                    <div className='text-muted-foreground text-red-500'>Add details such as rent, maintenance, and tenant preferences.</div>

                    <div className="grid grid-cols-2 gap-6 mt-6">
                        <div className="flex flex-col">
                            <label className="font-semibold mb-2">Expected Rent</label>
                            <div className="flex items-center border rounded px-2">
                                <span>₹</span>
                                <input
                                    type="number"
                                    placeholder="Enter Amount"
                                    className="w-full p-2 focus:outline-none"
                                    value={expectedRent}
                                    onChange={(e) => setExpectedRent(e.target.value)}
                                />
                                <span className="ml-2 whitespace-nowrap">/ Month</span>
                            </div>
                            <div className="mt-2">
                                <input type="checkbox" id="negotiable" />
                                <label htmlFor="negotiable" className="ml-2">Rent Negotiable</label>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="font-semibold mb-2">Expected Deposit</label>
                            <div className="flex items-center border rounded px-2">
                                <span>₹</span>
                                <input
                                    type="number"
                                    placeholder="Enter Amount"
                                    className="w-full p-2 focus:outline-none"
                                    value={expectedDeposit}
                                    onChange={(e) => setExpectedDeposit(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="font-semibold mb-2">Monthly Maintenance</label>
                            <select
                                className="border rounded p-2"
                                value={maintenanceOption}
                                onChange={(e) => setMaintenanceOption(e.target.value)}
                            >
                                <option value="Maintenance Included">Maintenance Included</option>
                                <option value="Maintenance Extra">Maintenance Extra</option>
                            </select>
                        </div>

                        {showMaintenanceAmount && (
                            <div className="flex flex-col">
                                <label className="font-semibold mb-2">Maintenance Amount</label>
                                <div className="flex items-center border rounded px-2">
                                    <span>₹</span>
                                    <input
                                        type="number"
                                        placeholder="Enter Amount"
                                        className="w-full p-2 focus:outline-none"
                                        value={maintenanceAmount}
                                        onChange={(e) => setMaintenanceAmount(e.target.value)}
                                    />
                                    <span className="ml-2 whitespace-nowrap">/ Month</span>
                                </div>
                            </div>
                        )}

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
                            <label className="font-semibold mb-2">Preferred Tenants</label>
                            <div className="flex gap-4 flex-wrap">
                                <div>
                                    <input 
                                        type="checkbox" 
                                        id="anyone" 
                                        checked={preferredTenants.includes("Anyone")} 
                                        onChange={() => handleTenantChange("Anyone")} 
                                    />
                                    <label htmlFor="anyone" className="ml-2">Anyone</label>
                                </div>
                                <div>
                                    <input 
                                        type="checkbox" 
                                        id="family" 
                                        checked={preferredTenants.includes("Family")} 
                                        onChange={() => handleTenantChange("Family")} 
                                    />
                                    <label htmlFor="family" className="ml-2">Family</label>
                                </div>
                                <div>
                                    <input 
                                        type="checkbox" 
                                        id="bachelor-female" 
                                        checked={preferredTenants.includes("Bachelor Female")} 
                                        onChange={() => handleTenantChange("Bachelor Female")} 
                                    />
                                    <label htmlFor="bachelor-female" className="ml-2">Bachelor Female</label>
                                </div>
                                <div>
                                    <input 
                                        type="checkbox" 
                                        id="bachelor-male" 
                                        checked={preferredTenants.includes("Bachelor Male")} 
                                        onChange={() => handleTenantChange("Bachelor Male")} 
                                    />
                                    <label htmlFor="bachelor-male" className="ml-2">Bachelor Male</label>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col col-span-2">
                            <label className="font-semibold mb-2">Looking for a roommate?</label>
                            <select
                                className="border rounded p-2"
                                value={roommateOption}
                                onChange={(e) => setRoommateOption(e.target.value)}
                            >
                                <option value="No, I was just renting out this property">No, I was just renting out this property</option>
                                <option value="Yes, looking for a roommate">Yes, looking for a roommate</option>
                            </select>
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