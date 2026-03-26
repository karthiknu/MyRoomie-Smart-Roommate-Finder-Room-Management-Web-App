'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useStore from "@/app/lib/useStore";
import { createProperty } from "@/app/actions/createProperty";
import { useSession } from "next-auth/react";

const PageComponent = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const maxTitleLength = 32;
    const maxDescriptionLength = 500;

    const addProperty = useStore((state: any) => state.addProperty);
    const property = useStore((state: any) => state.property);

    useEffect(() => {
        const updatedProperty = {
            ...property,
            title,
            description,
        };
        addProperty(updatedProperty);
    }, [title, description]);

    const handleNext = async () => {
        if (title && description && session && session.user) {
            const updatedProperty = {
                ...property,
                title,
                description,
                email: session.user.email, 
            };
    
            const result = await createProperty(updatedProperty, session);
    
            if (result?.success) {
                router.push(`/Post-your-property/${property.propertyId}/acknowledgement`);
            } else {
                alert("There was an error saving your property. Please try again.");
            }
        } else {
            alert("Please enter both title and description to proceed.");
        }
    };
    

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow overflow-y-auto pb-20">
                <div className='flex flex-col items-center gap-8 justify-center w-full max-w-2xl mx-auto py-8'>
                    <div className='text-3xl font-semibold text-gray-900 text-center text-red-500'>
                        <label htmlFor="title.title">Now, let's give your property a title</label>
                    </div>
                    <div className='w-full'>
                        <textarea
                            id="title.title"
                            placeholder="Enter your title here"
                            className="w-full p-4 text-2xl font-bold border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                            rows={2}
                            maxLength={maxTitleLength}
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                        />
                        <div className="text-right text-sm text-gray-400 mt-1">
                            <span>{title.length}/{maxTitleLength}</span>
                        </div>
                    </div>

                    <div className='text-3xl font-semibold text-gray-900 text-center text-red-500'>
                        <label htmlFor="description.description">Create your description</label>
                    </div>
                    <div className='text-gray-500 text-lg text-center'>
                        Share what makes your property special...
                    </div>
                    <div className='relative w-full'>
                        <textarea
                            id="description.description"
                            placeholder="The whole group will enjoy access to everything from this centrally located place."
                            className="p-4 text-xl font-bold border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent w-full"
                            style={{ height: '244px' }}
                            maxLength={maxDescriptionLength}
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                        />
                        <div className="absolute bottom-2 right-2 text-sm text-gray-400">
                            <span>{description.length}/{maxDescriptionLength}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 flex justify-between w-full border-t-4 p-4 bg-white">
                <button className='font-bold underline' onClick={() => router.back()}> Back </button>
                <button 
                    onClick={handleNext} 
                    className={`p-3 bg-gradient-to-tr from-pink-600 via-pink-500 to-pink-400 font-bold text-white rounded-xl ${
                        !title || !description ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={!title || !description}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default PageComponent;
