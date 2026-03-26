'use client';

import useStore from "@/app/lib/useStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";

const PhotosComponent = () => {
    const [images, setImages] = useState<ImageListType>([]);
    const [fullSizeImage, setFullSizeImage] = useState<string | null>(null);
    const maxNumber = 30;
    const router = useRouter();
    const addProperty = useStore((state: any) => state.addProperty);
    const property = useStore((state: any) => state.property);

    useEffect(() => {
        if (images) {
            const imageData = images.map((image: any) => image.data_url);
            const updatedProperty = {
                ...property,
                images: imageData
            };
            addProperty(updatedProperty);
        }
    }, [images]);

    const onChange = (imageList: ImageListType) => {
        setImages(imageList);
    };

    const handleImageClick = (imageUrl: string) => {
        setFullSizeImage(imageUrl);
    };

    const handleCloseFullSizeImage = () => {
        setFullSizeImage(null);
    };

    const handleNext = () => {
        if (property?.category === "PG") {
            router.push(`/Post-your-property/${property.propertyId}/pg-amenities`);
        } else if (property?.category === "Home" && property?.type === "Sale") {
            router.push(`/Post-your-property/${property.propertyId}/sale-amenities`);
        } else {
            router.push(`/Post-your-property/${property.propertyId}/amenities`);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-1">
                <div className="flex justify-center p-4">
                    <div className="flex flex-col gap-5">
                        <div className="text-2xl font-bold">Add Some photos of your property.</div>
                        <div className="text-muted-foreground text-red-500">You will need to add photos of your property</div>
                        <ImageUploading
                            multiple
                            value={images}
                            onChange={onChange}
                            maxNumber={maxNumber}
                            dataURLKey="data_url"
                        >
                            {({
                                imageList,
                                onImageUpload,
                                onImageRemoveAll,
                                onImageUpdate,
                                onImageRemove,
                                dragProps,
                            }) => (
                                <div className="flex flex-col gap-5">
                                    <div
                                        className="flex justify-center items-center h-80 border-dashed border-2 cursor-pointer"
                                        onClick={onImageUpload}
                                        {...dragProps}
                                    >
                                        Click or drop here
                                    </div>

                                    {imageList.length > 0 && (
                                        <div className="grid grid-cols-2 gap-3">
                                            {imageList.map((image, index) => (
                                                <div
                                                    key={index}
                                                    className="relative cursor-pointer"
                                                    onClick={() => handleImageClick(image['data_url'])}
                                                >
                                                    <img
                                                        src={image['data_url']}
                                                        alt=""
                                                        className="w-full h-40 object-cover"
                                                    />
                                                    <div className="mt-2 flex justify-between gap-2">
                                                        <button
                                                            onClick={() => onImageUpdate(index)}
                                                            className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                                                        >
                                                            Update
                                                        </button>
                                                        <button
                                                            onClick={() => onImageRemove(index)}
                                                            className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {imageList.length > 0 && (
                                        <button
                                            onClick={onImageRemoveAll}
                                            className="px-4 py-2 bg-black text-white rounded"
                                        >
                                            Remove all images
                                        </button>
                                    )}
                                </div>
                            )}
                        </ImageUploading>

                        {fullSizeImage && (
                            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
                                <div className="relative w-[700px] h-[700px] bg-white">
                                    <img
                                        src={fullSizeImage}
                                        alt="Full Size"
                                        className="w-full h-full object-contain"
                                    />
                                    <button
                                        onClick={handleCloseFullSizeImage}
                                        className="absolute top-4 right-4 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full"
                                        style={{ fontSize: '14px' }}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-none border-t-4 p-4 bg-white">
                <div className="flex justify-between items-center">
                    <button className='font-bold underline' onClick={() => router.back()}>Back</button>
                    <button onClick={handleNext} className="p-3 bg-gradient-to-tr from-pink-600 via-pink-500 to-pink-400 font-bold text-white rounded-xl ml-auto">Next</button>
                </div>
            </div>
        </div>
    );
}

export default PhotosComponent;
