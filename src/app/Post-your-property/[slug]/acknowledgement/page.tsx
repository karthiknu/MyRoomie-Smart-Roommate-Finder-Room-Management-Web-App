'use client';

import { useRouter } from "next/navigation";

const PageComponent = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <main className="flex-grow flex items-center justify-center">
                <div className="text-center px-4 max-w-2xl">
                    <h1 className="text-4xl font-bold text-green-600 mb-6">
                        Your property has been successfully posted!
                    </h1>
                    <p className="text-xl text-gray-700">
                        Thank you for posting your property. We will review it and get back to you soon.
                    </p>
                    <button
                        className="mt-6 p-3 bg-gradient-to-tr from-pink-600 via-pink-500 to-pink-400 font-bold text-white rounded-xl"
                        onClick={() => router.push('/')}
                    >
                        Go to Home
                    </button>
                </div>
            </main>
        </div>
    );    
};

export default PageComponent;
