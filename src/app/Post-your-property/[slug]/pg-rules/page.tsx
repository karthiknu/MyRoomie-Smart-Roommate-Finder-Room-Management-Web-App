'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import useStore from "@/app/lib/useStore";

const PageContent = () => {
    const router = useRouter();
    const addProperty = useStore((state: any) => state.addProperty);
    const property = useStore((state: any) => state.property);

    const [placeAvailableFor, setPlaceAvailableFor] = useState<string>(property.placeAvailableFor || "");
    const [preferredGuests, setPreferredGuests] = useState<string>(property.preferredGuests || "");
    const [foodIncluded, setFoodIncluded] = useState<string>(property.foodIncluded || "No");
    const [rules, setRules] = useState<string[]>(property.rules || []);

    const hostelRules = [
        { label: "No Smoking", icon: "🚭" },
        { label: "No Drinking", icon: "🍸" },
        { label: "No Non-Veg", icon: "🥩" },
        { label: "No Guardians Stay", icon: "🛌" },
    ];

    const dynamicRule = placeAvailableFor === "Male"
        ? { label: "No Girl's Entry", icon: "🚫👧" }
        : placeAvailableFor === "Female"
        ? { label: "No Boy's Entry", icon: "🚫👦" }
        : null;

    const handleNext = () => {
        if (!placeAvailableFor || !preferredGuests) {
            alert("Please fill all required fields.");
            return;
        }

        addProperty({
            ...property,
            placeAvailableFor,
            preferredGuests,
            foodIncluded,
            rules,
        });

        router.push(`/Post-your-property/${property.propertyId}/photos`);
    };

    const handleRulesChange = (rule: string) => {
        setRules((prev) =>
            prev.includes(rule) ? prev.filter((r) => r !== rule) : [...prev, rule]
        );
    };

    return (
        <div className="flex flex-col overflow-hidden">
            <div className="flex-grow p-2 flex flex-col justify-start items-center">
                <div className="w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-8 text-center text-red-500">Property Details</h2>

                    <div className="mb-6">
                        <label className="block text-lg font-bold mb-2">Place is available for</label>
                        <div className="flex justify-center gap-6">
                            {["Male", "Female", "Anyone"].map((option) => (
                                <label key={option} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="placeAvailableFor"
                                        value={option}
                                        checked={placeAvailableFor === option}
                                        onChange={() => setPlaceAvailableFor(option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mb-10">
                        <label className="block text-lg font-bold mb-2">Preferred Guests</label>
                        <select
                            className="border rounded p-2 w-full max-w-xs mx-auto block"
                            value={preferredGuests}
                            onChange={(e) => setPreferredGuests(e.target.value)}
                        >
                            <option value="" disabled>Select</option>
                            <option value="Working Professionals">Working Professionals</option>
                            <option value="Students">Students</option>
                            <option value="Both">Both</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-lg font-bold mb-2">Food Included</label>
                        <div className="flex gap-4 mb-8">
                            <button
                                className={`p-2 border transition-transform duration-300 ease-in-out ${
                                    foodIncluded === "Yes"
                                        ? 'bg-blue-500 text-white cursor-default'
                                        : 'hover:bg-gray-100 hover:scale-105 border-gray-300'
                                }`}
                                onClick={() => setFoodIncluded("Yes")}
                            >
                                YES
                            </button>
                            <button
                                className={`p-2 border transition-transform duration-300 ease-in-out ${
                                    foodIncluded === "No"
                                        ? 'bg-blue-500 text-white cursor-default'
                                        : 'hover:bg-gray-100 hover:scale-105 border-gray-300'
                                }`}
                                onClick={() => setFoodIncluded("No")}
                            >
                                NO
                            </button>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-bold mb-8 text-center text-red-500">PG/Hostel Rules</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[...hostelRules, dynamicRule].filter(Boolean).map((rule) => (
                                <div key={rule?.label} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={rule?.label}
                                        checked={rules.includes(rule!.label)}
                                        onChange={() => handleRulesChange(rule!.label)}
                                    />
                                    <label htmlFor={rule?.label} className="flex items-center gap-2">
                                        <span>{rule?.icon}</span> {rule?.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <footer className="fixed bottom-0 left-0 right-0 flex justify-between w-full border-t-4 p-4 bg-white">
                <button className="font-bold underline" onClick={() => router.back()}>
                    Back
                </button>
                <button
                    onClick={handleNext}
                    className="p-3 bg-gradient-to-tr from-pink-600 via-pink-500 to-pink-400 font-bold text-white rounded-xl"
                >
                    Next
                </button>
            </footer>
        </div>
    );
};

export default PageContent;
